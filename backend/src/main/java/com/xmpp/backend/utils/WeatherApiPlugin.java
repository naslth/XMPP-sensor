package com.xmpp.backend.utils;

import org.springframework.web.client.RestTemplate;

public class WeatherApiPlugin {
    public static final String getWeather(String city) {
        final String uri = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=" + StaticResource.openWeatherApiId;
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class);
        return result;
    }
}
