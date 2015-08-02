import asyncio
import websockets
import serial
import time

@asyncio.coroutine
def hello(websocket, path):
    ser = serial.Serial('COM4', 9600, timeout=0)
    while 1:
      line = str(ser.readline())
      line = line.lstrip('b');
      line = line.rstrip('\r\n');
      yield from websocket.send(line)
      time.sleep (200.0 / 1000.0);

start_server = websockets.serve(hello, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
