#include <OneWire.h>
#include <DallasTemperature.h>    
#include <ZMPT101B.h>

#define SENSITIVITY 500.0f

#define ONE_WIRE_BUS_TEMP 2   // Pin para el sensor de temperatura DS18B20 2 Digital

// ZMPT101B sensor output connected to analog pin A1 and the voltage source frequency is 50 Hz.
ZMPT101B voltageSensor(A1, 50.0);

OneWire oneWire(ONE_WIRE_BUS_TEMP);
DallasTemperature sensors(&oneWire);

// Sensor de Corriente colocar en A0, el pin 0 Analogico
const int sensorCorriente = 14;     

// Sensor de RPM en el pin D3, pin 3 digital
volatile int cont = 0; 
int voltas = 0;
const int sensorRPM = 3;

unsigned long loopStartTime = 0;

void setup() {
  Serial.begin(9600);
  voltageSensor.setSensitivity(SENSITIVITY);
  pinMode(sensorCorriente, INPUT);
  sensors.begin();
  pinMode(sensorRPM, INPUT);
  attachInterrupt(digitalPinToInterrupt(3), interrupcao, RISING);

}

void loop() {
  analogReference(DEFAULT);
  loopStartTime = millis();

  // Sensor de RPM
  detachInterrupt(digitalPinToInterrupt(3));
  voltas = (cont*3);
  if (voltas-210<0){
    voltas = 0;
  }
  else {
    voltas = voltas-200;
  }
  cont = 0;
  attachInterrupt(digitalPinToInterrupt(3), interrupcao, RISING);


  // Sensor de voltaje
  float voltage = voltageSensor.getRmsVoltage();

 
  // Sensor de Temperatura DS18B20
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0); // Obtener temperatura en grados Celsius

  // Sensor de Corriente
  analogReference(INTERNAL);
  float Irms=get_corriente(); //Corriente eficaz (A)
  Irms = Irms;

 
  if (voltas != 0 && Irms != 0) {
    voltage += 210;
  }

  else {
    voltage = 0;
  }

  Serial.print(voltage);
  Serial.print(",");
  Serial.print(temperatureC);
  Serial.print(",");
  Serial.print(Irms,2);
  Serial.print(",");
  Serial.print(voltas);
  

  unsigned long loopEndTime = millis();
  unsigned long loopExecutionTime = loopEndTime - loopStartTime;
  Serial.print(",");
  Serial.println(loopExecutionTime);
  

}

void interrupcao(){
  cont++;
}

float get_corriente() {
  float voltajeSensor;
  float corriente = 0;
  float Sumatoria = 0;
  long tiempo = millis();
  int N = 0;
  while (millis() - tiempo < 500) { // Duración de 1 segundo (50 ciclos de 50Hz)
    voltajeSensor = analogRead(A0) * (1.1 / 1023.0); // Voltaje del sensor
    corriente = voltajeSensor * 30.0; // Corriente = VoltajeSensor * (20A/1V) para 50Hz
    Sumatoria = Sumatoria + sq(corriente); // Sumatoria de Cuadrados
    N = N + 1;
    delay(1);
  }
  Sumatoria = Sumatoria * 2; // Para compensar los cuadrados de los semiciclos negativos.
  corriente = sqrt((Sumatoria) / N); // Ecuación del RMS
  return (corriente);
}