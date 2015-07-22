import serial
import time
ser = serial.Serial('COM4', 9600, timeout=0)

while 1:
	try:
		test = ser.read(1024)
		print(test)
		time.sleep(1)
	except ser.SerialTimeoutException:
		print('Data could not be read')
	time.sleep(1)
