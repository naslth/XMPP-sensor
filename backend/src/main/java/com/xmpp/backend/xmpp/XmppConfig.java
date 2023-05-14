package com.xmpp.backend.xmpp;

import java.net.InetAddress;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.List;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import org.jivesoftware.smack.ConnectionConfiguration;
import org.jivesoftware.smack.tcp.XMPPTCPConnection;
import org.jivesoftware.smack.tcp.XMPPTCPConnectionConfiguration;
import org.jivesoftware.smackx.iqregister.AccountManager;
import org.jivesoftware.smack.XMPPException;
import org.jivesoftware.smack.SmackException.NoResponseException;
import org.jivesoftware.smack.SmackException.NotConnectedException;
import org.jivesoftware.smack.XMPPException.XMPPErrorException;
import org.jivesoftware.smack.chat2.Chat;
import org.jivesoftware.smack.chat2.ChatManager;
import org.jivesoftware.smack.chat2.IncomingChatMessageListener;
import org.jivesoftware.smack.packet.Message;
import org.jxmpp.jid.EntityBareJid;
import org.jxmpp.jid.impl.JidCreate;
import org.jxmpp.stringprep.XmppStringprepException;
import com.xmpp.backend.model.Sensor;
import com.xmpp.backend.model.SensorProperty;
import com.xmpp.backend.utils.XmppApiPlugin;

import com.xmpp.backend.utils.StaticResource;

public class XmppConfig {
    XMPPTCPConnection connection;
    String userName;
    String password;

    public XmppConfig() {
    }

    public XmppConfig(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }

    public XMPPTCPConnection getConnection() {
        return connection;
    }

    public void setConnection(XMPPTCPConnection connection) {
        this.connection = connection;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void connect() throws Exception {
        SSLContext sslContext = null;
        sslContext = SSLContext.getInstance("TLS");
        TrustManager tm = new X509TrustManager() {
            @Override
            public void checkClientTrusted(X509Certificate[] x509Certificates, String s)
                    throws CertificateException {
            }

            @Override
            public void checkServerTrusted(X509Certificate[] x509Certificates, String s)
                    throws CertificateException {
            }

            @Override
            public X509Certificate[] getAcceptedIssuers() {
                return new X509Certificate[0];
            }
        };

        sslContext.init(null, new TrustManager[] { tm }, null);
        XMPPTCPConnectionConfiguration.Builder config = XMPPTCPConnectionConfiguration.builder()
                .setUsernameAndPassword(userName, password)
                .setHost("localhost")
                .setXmppDomain("localhost")
                .setSecurityMode(ConnectionConfiguration.SecurityMode.required)
                .setSendPresence(true)
                .setHostAddress(InetAddress.getByName("localhost"))
                // .setDebuggerEnabled(true)
                .setCustomSSLContext(sslContext)
                .setPort(5222);
        connection = new XMPPTCPConnection(config.build());
        connection.setUseStreamManagement(false);
        connection.connect().login();
        System.out.println("Connected: " + connection.isConnected());
    }

    public void disconnect() {
        connection.disconnect();
    }

    public void adminProcessMessage() throws XMPPException, NotConnectedException, XmppStringprepException {
        ChatManager chatManager = ChatManager.getInstanceFor(connection);
        chatManager.addIncomingListener(new IncomingChatMessageListener() {
            @Override
            public void newIncomingMessage(EntityBareJid from, Message message, Chat chat) {
                System.out.println(from + " says: " + message.getBody());
                try {
                    if (message.getBody().matches("-?\\d+(\\.\\d+)?")) {
                        int memory = Integer.parseInt(message.getBody());
                        Message mess = new Message();
                        EntityBareJid jidTo = JidCreate.entityBareFrom(from);
                        EntityBareJid jidFrom = JidCreate.entityBareFrom("admin" + "@" + StaticResource.DOMAIN);
                        if (memory > 800) {
                            mess.setType(Message.Type.chat);
                            mess.setFrom(jidFrom);
                            mess.setTo(jidTo);
                            mess.setBody("Overloaded. Half your memory!");
                        } else {
                            mess.setType(Message.Type.chat);
                            mess.setFrom(jidFrom);
                            mess.setTo(jidTo);
                            mess.setBody("OK");
                        }
                        chat.send(mess);
                    }
                } catch (XmppStringprepException | NotConnectedException | InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void sensorListenMessage() throws XMPPException, NotConnectedException, XmppStringprepException {
        ChatManager chatManager = ChatManager.getInstanceFor(connection);
        chatManager.addIncomingListener(new IncomingChatMessageListener() {
            @Override
            public void newIncomingMessage(EntityBareJid from, Message message, Chat chat) {
                System.out.println(from + " says: " + message.getBody());
                if (message.getBody().equals("Overloaded. Half your memory!")) {
                    XmppApiPlugin xmppApiPlugin = new XmppApiPlugin();
                    String[] splits = message.getTo().toString().split("@");
                    Sensor sensor = xmppApiPlugin.getSensor(splits[0]);
                    List<SensorProperty> properties = sensor.getProps();
                    for (SensorProperty property : properties) {
                        if (property.getKey().equals("mem")) {
                            String mem = Integer.toString(Integer.parseInt(property.getValue()) / 2);
                            property.setValue(mem);
                            Message mess = new Message();
                            try {
                                EntityBareJid jidTo = JidCreate.entityBareFrom(from);
                                EntityBareJid jidFrom = JidCreate.entityBareFrom(message.getTo().toString());
                                mess.setType(Message.Type.chat);
                                mess.setFrom(jidFrom);
                                mess.setTo(jidTo);
                                mess.setBody("Memory after half: " + mem);
                                chat.send(mess);

                            } catch (XmppStringprepException | NotConnectedException | InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    // for(SensorProperty property : properties) {
                    // System.out.println(property.getKey() + " " + property.getValue());
                    // }
                    xmppApiPlugin.updateSensor(sensor.getId(), sensor);
                }
            }
        });
    }

    public void sensorSendMessage(String message, String from, String to)
            throws XMPPException, NotConnectedException, XmppStringprepException {
        ChatManager chatManager = ChatManager.getInstanceFor(connection);
        EntityBareJid jidTo = JidCreate.entityBareFrom(to);
        EntityBareJid jidFrom = JidCreate.entityBareFrom(from);
        Chat chat = chatManager.chatWith(jidTo);
        Message mess = new Message();
        mess.setType(Message.Type.chat);
        mess.setFrom(jidFrom);
        mess.setTo(jidTo);
        mess.setBody(message);
        try {
            chat.send(mess);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }


}
