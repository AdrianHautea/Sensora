import serial
import time

PORT = "COM5"
BAUD = 115200

ser = serial.Serial(PORT, BAUD, timeout=1)

time.sleep(2)

while True:
    message = "Hello from Python\n"
    ser.write(message.encode("utf-8"))
    print("Sent:", message)
    time.sleep(5)