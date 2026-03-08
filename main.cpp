#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "wifi_credentials.h"

String serialLine = "";

void connectWiFi()
{
    Serial.println("Connecting relay to camera AP...");
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("Relay connected to camera AP");
    Serial.print("Relay IP: ");
    Serial.println(WiFi.localIP());
}

void ensureWiFiConnected()
{
    if (WiFi.status() == WL_CONNECTED)
    {
        return;
    }

    Serial.println("Relay WiFi disconnected, reconnecting...");
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < 10000)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("Relay reconnected");
        Serial.print("Relay IP: ");
        Serial.println(WiFi.localIP());
    }
    else
    {
        Serial.println("Relay reconnect failed");
    }
}

bool sendTextToCamera(const String& text)
{
    if (WiFi.status() != WL_CONNECTED)
    {
        Serial.println("Cannot send: relay WiFi not connected");
        return false;
    }

    WiFiClient client;
    HTTPClient http;

    if (!http.begin(client, CAMERA_SERVER_URL))
    {
        Serial.println("http.begin() failed");
        return false;
    }

    http.addHeader("Content-Type", "text/plain");

    int responseCode = http.POST(text);

    Serial.print("Forwarded text: ");
    Serial.println(text);
    Serial.print("Camera response code: ");
    Serial.println(responseCode);

    if (responseCode > 0)
    {
        String responseBody = http.getString();
        Serial.print("Camera response body: ");
        Serial.println(responseBody);
    }
    else
    {
        Serial.print("HTTP POST failed: ");
        Serial.println(http.errorToString(responseCode));
    }

    http.end();
    return responseCode > 0;
}

void handleSerialInput()
{
    while (Serial.available() > 0)
    {
        char c = (char)Serial.read();

        if (c == '\r')
        {
            continue;
        }

        if (c == '\n')
        {
            if (serialLine.length() > 0)
            {
                sendTextToCamera(serialLine);
                serialLine = "";
            }
        }
        else
        {
            serialLine += c;

            // prevent runaway buffer growth
            if (serialLine.length() > 256)
            {
                serialLine = "";
                Serial.println("Input too long, cleared");
            }
        }
    }
}

void setup()
{
    Serial.begin(115200);
    delay(1000);

    Serial.println();
    Serial.println("Relay ESP32 serial->wifi bridge starting");

    connectWiFi();
}

void loop()
{
    ensureWiFiConnected();
    handleSerialInput();
}