#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include "ap_credentials.h"

WebServer server(80);

IPAddress cameraAP_IP(192, 168, 4, 1);
IPAddress cameraNetmask(255, 255, 255, 0);

String latestText = "Waiting for text...";
bool newTextAvailable = false;

// Timer for periodic printing
unsigned long lastConnectionPrint = 0;
const unsigned long CONNECTION_PRINT_INTERVAL = 2000;

void handleRoot()
{
    String msg = "Camera ESP32 text receiver running\n";
    msg += "Latest text: " + latestText + "\n";
    server.send(200, "text/plain", msg);
}

void handleText()
{
    if (!server.hasArg("plain"))
    {
        server.send(400, "text/plain", "No text received");
        return;
    }

    latestText = server.arg("plain");
    newTextAvailable = true;

    Serial.println("Received text from relay:");
    Serial.println(latestText);

    server.send(200, "text/plain", "OK");
}

void startAccessPoint()
{
    Serial.println("Starting camera AP...");

    WiFi.mode(WIFI_AP);
    WiFi.softAPConfig(cameraAP_IP, cameraAP_IP, cameraNetmask);

    bool apStarted = WiFi.softAP(CAMERA_AP_SSID, CAMERA_AP_PASSWORD, 1, 0, 4);

    if (apStarted)
    {
        Serial.println("Camera AP started");
        Serial.print("SSID: ");
        Serial.println(CAMERA_AP_SSID);
        Serial.print("AP IP: ");
        Serial.println(WiFi.softAPIP());
    }
    else
    {
        Serial.println("Camera AP failed to start");
    }
}

void startServer()
{
    server.on("/", HTTP_GET, handleRoot);
    server.on("/text", HTTP_POST, handleText);
    server.begin();

    Serial.println("Camera web server started");
    Serial.println("Endpoints:");
    Serial.println("  GET  /");
    Serial.println("  POST /text");
}

// Print connection status if device connected
void printConnectionStatus()
{
    int connected = WiFi.softAPgetStationNum();

    if (connected > 0 && millis() - lastConnectionPrint > CONNECTION_PRINT_INTERVAL)
    {
        lastConnectionPrint = millis();

        Serial.print("Device connected to AP | Devices: ");
        Serial.println(connected);
    }
}

// Replace this with your real display code later
void updateDisplayIfNeeded()
{
    if (!newTextAvailable)
    {
        return;
    }

    newTextAvailable = false;

    Serial.println("Update display with:");
    Serial.println(latestText);

    // Put your display driver call here
}

void setup()
{
    Serial.begin(115200);
    delay(1000);

    Serial.println();
    Serial.println("Camera ESP32 text receiver starting");

    startAccessPoint();
    startServer();
}

void loop()
{
    server.handleClient();
    updateDisplayIfNeeded();
    printConnectionStatus();
}