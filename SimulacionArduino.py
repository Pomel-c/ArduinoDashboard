import serial
import time
import random

# Open serial connection (replace 'COM3' with the port Arduino is connected to)
ser = serial.Serial('COM3', 9600)

# Wait for the serial connection to initialize
time.sleep(2)

max_multiplier = 1.1
min_multiplier = 0.9
voltaje_necesario = 220
temperatura_max = 80
corriente_necesaria = 1.5
rpm_necesario = 3000

while True:
    # Write data to serial connection
    voltaje = random.uniform(min_multiplier * voltaje_necesario, max_multiplier * voltaje_necesario)
    voltaje = float("{:.2f}".format(voltaje))

    temperatura = random.uniform(min_multiplier * temperatura_max, max_multiplier * temperatura_max)
    temperatura = float("{:.2f}".format(temperatura))
    
    corriente = random.uniform(min_multiplier * corriente_necesaria, max_multiplier * corriente_necesaria)
    corriente = float("{:.2f}".format(corriente))

    rpm = random.uniform(min_multiplier * rpm_necesario, max_multiplier * rpm_necesario)
    rpm = float("{:.2f}".format(rpm))

    data = f'{voltaje},{temperatura},{corriente},{rpm}\n'
    ser.write(data.encode())  # Encode the string before writing
    
    print(f'Voltage: {voltaje}V')
    print(f'Temperatura: {temperatura}°C')
    print(f'RPM: {rpm}rpm')
    print(f'Corriente: {corriente}A')
    print('------------------')
    # Wait for a second
    time.sleep(1)
