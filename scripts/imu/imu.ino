#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_HMC5883_U.h>
#include <Adafruit_BMP085_U.h>
#include <HMC5883L.h>

#define SENSORS_PRESSURE_SEALEVELHPA 1013.25;

const int MPU=0x68;
const int BMP=10085;

int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ,pitch,roll;
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(BMP);

void setup(){
  /* Initialise MPU sensor */
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);
  Serial.begin(9600);

  /* Initialise BMP sensor */
//  Serial.println("Pressure Sensor Test"); Serial.println("");
  if(!bmp.begin()){
    /* There was a problem detecting the BMP085 ... check your connections */
    Serial.print("No BMP085 detected ... Check your wiring or I2C ADDR!");
    while(1);
  }
  
  /* Display some basic information on this sensor */
//  displaySensorDetails();
  
}
void loop(){
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
  Wire.endTransmission(false);
  Wire.requestFrom(MPU,14,true);  // request a total of 14 registers
  AcX=Wire.read()<<8|Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)    
  AcY=Wire.read()<<8|Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
  AcZ=Wire.read()<<8|Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
  Tmp=Wire.read()<<8|Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
  GyX=Wire.read()<<8|Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
  GyY=Wire.read()<<8|Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
  GyZ=Wire.read()<<8|Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)
  
//  const float alpha = 0.5; low pass filter
//  fXg = Xg * alpha + (fXg * (1.0 - alpha));
//  fYg = Yg * alpha + (fYg * (1.0 - alpha));
//  fZg = Zg * alpha + (fZg * (1.0 - alpha));
  
  
  roll = atan2(AcY, AcZ) * 180/M_PI;
  pitch = atan2(-AcX, sqrt(AcY*AcY + AcZ*AcZ)) * 180/M_PI;
  
  sensors_event_t event;
  bmp.getEvent(&event);
  float temperature;
  bmp.getTemperature(&temperature);
  float seaLevelPressure = SENSORS_PRESSURE_SEALEVELHPA;
  float altitude = bmp.pressureToAltitude(seaLevelPressure, event.pressure);
  float preassurePascals = event.pressure * 100;
  
  Serial.print("{");
  Serial.print("AcX: '"); Serial.print(AcX); Serial.print("',");
  Serial.print("AcY: '"); Serial.print(AcY); Serial.print("',");
  Serial.print("AcZ: '"); Serial.print(AcZ); Serial.print("',");
  Serial.print("Pitch: '"); Serial.print(pitch); Serial.print("',");
  Serial.print("Roll: '"); Serial.print(roll); Serial.print("',");
  Serial.print("GyroTemp: '"); Serial.print(Tmp/340.00+36.53); Serial.print("',"); //equation for temperature in degrees C from datasheet
  Serial.print("GyX: '"); Serial.print(GyX); Serial.print("',");
  Serial.print("GyY: '"); Serial.print(GyY); Serial.print("',");
  Serial.print("GyZ: '"); Serial.print(GyZ); Serial.print("',");
  Serial.print("AirPres: '"); Serial.print(event.pressure); Serial.print("',"); //hPa
  Serial.print("AirTemp: '"); Serial.print(temperature); Serial.print("',"); //celsius
  Serial.print("Altitude: '"); Serial.print(altitude); Serial.print("'"); //meters
  Serial.println("}");
  
  delay(200);
}

void displaySensorDetails(void) {
  sensor_t sensor;
  bmp.getSensor(&sensor);
  Serial.println("------------------------------------");
  Serial.print  ("Sensor:       "); Serial.println(sensor.name);
  Serial.print  ("Driver Ver:   "); Serial.println(sensor.version);
  Serial.print  ("Unique ID:    "); Serial.println(sensor.sensor_id);
  Serial.print  ("Max Value:    "); Serial.print(sensor.max_value); Serial.println(" hPa");
  Serial.print  ("Min Value:    "); Serial.print(sensor.min_value); Serial.println(" hPa");
  Serial.print  ("Resolution:   "); Serial.print(sensor.resolution); Serial.println(" hPa");  
  Serial.println("------------------------------------");
  Serial.println("");
}
