const Bleno = require('@abandonware/bleno');

const HeartRateMeasurementCharacteristic = require('./heart-rate-measurement-characteristic');
const StaticReadCharacteristic = require('./static-read-characteristic');

// https://developer.bluetooth.org/gatt/services/Pages/ServiceViewer.aspx?u=org.bluetooth.service.cycling_power.xml
class HeartRateService extends Bleno.PrimaryService {

  constructor() {
    let heartMeasurement = new HeartRateMeasurementCharacteristic();
    super({
        uuid: '180D',
        characteristics: [
          heartMeasurement
          //StaticReadCharacteristic('2A65', 'Cycling Power Feature', [0x08, 0, 0, 0]), // 0x08 - crank revolutions
          //new StaticReadCharacteristic('2A5D', 'Sensor Location', [13])         // 13 = rear hub
        ]
    });
    //PS: adding this console.log below
    console.log('starting HeartRateServise');

    this.heartMeasurement = heartMeasurement;
  }

  notify(event) {
    this.heartMeasurement.notify(event);
    return this.RESULT_SUCCESS;
  };
}

module.exports = HeartRateService;
