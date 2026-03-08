import serial
import time

PORT = 'COM5'      # change for your system
BAUD = 115200

TEST_MODE = True

class SerialSender:
    def __init__(self):

        if TEST_MODE:
            print('SerialSender running in TEST MODE')
            self.ser = None
            return

        try:
            self.ser = serial.Serial(PORT, BAUD, timeout=1)
            time.sleep(2)  # allow ESP to reset
            print(f'Connected to ESP on {PORT}')

        except Exception as e:
            print('Serial connection failed:', e)
            self.ser = None

    def send(self, message):
        if self.ser is None:
            print('[MOCK SERIAL] >', message)
            return
        try:
            msg = message.strip() + '\n'
            self.ser.write(msg.encode('utf-8'))
            print('Sending to ESP:', message)

        except Exception as e:
            print('Serial send error:', e)