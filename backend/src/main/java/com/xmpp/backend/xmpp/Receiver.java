package xmpp;

import java.net.InetAddress;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Set;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.jivesoftware.smack.AbstractXMPPConnection;
import org.jivesoftware.smack.ConnectionConfiguration;
import org.jivesoftware.smack.XMPPException;
import org.jivesoftware.smack.SmackException.NoResponseException;
import org.jivesoftware.smack.SmackException.NotConnectedException;
import org.jivesoftware.smack.XMPPException.XMPPErrorException;
import org.jivesoftware.smack.chat2.Chat;
import org.jivesoftware.smack.chat2.ChatManager;
import org.jivesoftware.smack.chat2.IncomingChatMessageListener;
import org.jivesoftware.smack.packet.Message;
import org.jivesoftware.smack.tcp.XMPPTCPConnection;
import org.jivesoftware.smack.tcp.XMPPTCPConnectionConfiguration;
import org.jivesoftware.smackx.iqregister.AccountManager;
import org.jxmpp.jid.EntityBareJid;
import org.jxmpp.jid.impl.JidCreate;
import org.jxmpp.stringprep.XmppStringprepException;

/**
 * Hello world!
 *
 */
public class Receiver {

    AbstractXMPPConnection connection;

    public void login(String userName, String password) throws Exception {
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
        connection.connect().login();
        System.out.println("Connected: " + connection.isConnected());
    }

    /**
     * Sends the specified text as a message to the other chat participant.
     * 
     * @param message
     * @param to
     * @throws XMPPException
     * @throws NotConnectedException
     * @throws XmppStringprepException
     */
    public void listenMessage() throws XMPPException, NotConnectedException, XmppStringprepException {
        ChatManager chatManager = ChatManager.getInstanceFor(connection);
        chatManager.addIncomingListener(new IncomingChatMessageListener() {
            @Override
            public void newIncomingMessage(EntityBareJid from, Message message, Chat chat) {
                System.out.println(from + " says: " + message.getBody());
                try {
                    Message mess = new Message();
                    EntityBareJid jidTo = JidCreate.entityBareFrom(from);
                    EntityBareJid jidFrom;
                    jidFrom = JidCreate.entityBareFrom("admin@localhost");
                    mess.setType(Message.Type.chat);
                    mess.setFrom(jidFrom);
                    mess.setTo(jidTo);
                    mess.setBody("OK");
                } catch (XmppStringprepException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void disconnect() {
        connection.disconnect();
    }

    public static void main(String args[]) throws Exception {
        Receiver xmppClient = new Receiver();
        xmppClient.login("admin", "9015");
        xmppClient.listenMessage();
        while (true) {
        }
        // xmppClient.disconnect();
    }

}