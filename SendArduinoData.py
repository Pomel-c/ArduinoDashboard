import serial
import time
import random

# Open serial connection (replace 'COM3' with the port Arduino is connected to)
ser = serial.Serial('COM3', 9600)

# Wait for the serial connection to initialize
time.sleep(2)

while True:
    # Write data to serial connection
    voltaje = 220 * random.uniform(0, 1.5)
    voltaje = float("{:.2f}".format(voltaje))

    temperatura = 75 * random.uniform(0, 1.5)
    temperatura = float("{:.2f}".format(temperatura))
    
    corriente = 1.5 * random.uniform(0, 1.5)
    corriente = float("{:.2f}".format(corriente))

    rpm = 1600 * random.uniform(0, 1.5)
    rpm = float("{:.2f}".format(rpm))

    
    
    data = f'{voltaje},{temperatura},{corriente},{rpm}\n'
    ser.write(data.encode())  # Encode the string before writing
    
    # Wait for a second
    time.sleep(1)