import serial
import time
import random
import threading

# Wait for the serial connection to initialize
# ser = serial.Serial('COM3', 9600)
print('Waiting for serial connection...')
time.sleep(2)

# Global variables to store the state
running = True
operating = False
temperature = 32.0

# Maximum and minimum multipliers
max_multiplier = 1.02
min_multiplier = 0.98

# Necessary values
voltaje_necesario = 220
temperatura_max = 75
corriente_necesaria = 3
rpm_necesario = 3000

def read_input():
    global operating
    while True:
        user_input = input()
        if user_input == '1':
            operating = True
        elif user_input == '0':
            operating = False

def send_data():
    global operating, temperature
    while running:
        if operating:
            voltaje = random.uniform(min_multiplier * voltaje_necesario, max_multiplier * voltaje_necesario)
            if temperature < temperatura_max:
                temperature += random.uniform(0, 0.5)  # Increase temperature by 1 degree each second
                if temperature > temperatura_max:
                    temperature = temperatura_max
            corriente = random.uniform(min_multiplier * corriente_necesaria, max_multiplier * corriente_necesaria)
            rpm = int(random.uniform(min_multiplier * rpm_necesario, max_multiplier * rpm_necesario))
        else:
            voltaje = 0.0
            try:
                temperature = temperatura  # Reset temperature to 32 when not operating
            except UnboundLocalError:
                temperature = 32.0
            corriente = 0.0
            rpm = 0.0
        voltaje = float("{:.2f}".format(voltaje))
        temperatura = float("{:.2f}".format(temperature))
        corriente = float("{:.2f}".format(corriente))

        data = f'{voltaje},{temperatura},{corriente},{rpm}\n'
        # ser.write(data.encode())  # Encode the string before writing

        print(f'Voltage: {voltaje}V')
        print(f'Temperatura: {temperatura}°C')
        print(f'RPM: {rpm}rpm')
        print(f'Corriente: {corriente}A')
        print('------------------')
        
        time.sleep(1)

# Create and start threads
input_thread = threading.Thread(target=read_input)
data_thread = threading.Thread(target=send_data)

input_thread.start()
data_thread.start()

# Keep the main thread running, otherwise signals are ignored.
try:
    while True:
        time.sleep(0.1)
except KeyboardInterrupt:
    running = False
    input_thread.join()
    data_thread.join()
