import serial
import time
import random

# Open serial connection (replace 'COM3' with the port Arduino is connected to)
ser = serial.Serial('COM3', 9600)

# Wait for the serial connection to initialize
time.sleep(2)

max_multiplier = 1.02
min_multiplier = 0.98
voltaje_necesario = 220
temperatura_max = 80
corriente_necesaria = 2
rpm_necesario = 3000
temperatura_media = 21
temperatura = 0

def getTemperature():
    global temperatura
    if temperatura < temperatura_media:
        temperatura = temperatura_media
    else:
        temperatura = temperatura + random.uniform(0, 2)
    
    if temperatura > temperatura_max:
        temperatura = random.uniform(min_multiplier * temperatura_max, max_multiplier * temperatura_max) 
    # temperatura = random.uniform(min_multiplier * temperatura_max, max_multiplier * temperatura_max)
    temperatura = float("{:.2f}".format(temperatura))
    return temperatura

def getRPM():
    rpm = random.uniform(min_multiplier * rpm_necesario, max_multiplier * rpm_necesario)
    rpm = float("{:.2f}".format(rpm))
    return rpm

def getVoltaje():
   voltaje = random.uniform(min_multiplier * voltaje_necesario, max_multiplier * voltaje_necesario)
   voltaje = float("{:.2f}".format(voltaje))
   return voltaje

def getCorriente():
    corriente = random.uniform(min_multiplier * corriente_necesaria, max_multiplier * corriente_necesaria)
    corriente = float("{:.2f}".format(corriente))
    return corriente

while True:
    # Write data to serial connection
    temperatura = getTemperature()
    corriente = getCorriente()
    rpm = getRPM()
    voltaje = getVoltaje()

    data = f'{voltaje},{temperatura},{corriente},{rpm}\n'
    ser.write(data.encode())  # Encode the string before writing
    
    print(f'Voltage: {voltaje}V')
    print(f'Temperatura: {temperatura}°C')
    print(f'RPM: {rpm}rpm')
    print(f'Corriente: {corriente}A')
    print('------------------')
    # Wait for a second
    time.sleep(1)
