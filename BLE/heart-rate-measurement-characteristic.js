
var Bleno = require('@abandonware/bleno');
var DEBUG = true; //PS:chged to true 

// Spec
// PS: Change this to HR spec - https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.cycling_power_measurement.xml

class HeartRateMeasurementCharacteristic extends  Bleno.Characteristic {
 
  constructor() {
    super({
      uuid: '2A37', // Heart Rate Measurement
      value: null,
      properties: ['notify'],
      descriptors: [
        new Bleno.Descriptor({
					uuid: '2901',
					value: 'Heart Rate Measurement'
				}),
        //  check if/what of this is needed!!!
        new Bleno.Descriptor({
          // Client Characteristic Configuration
          uuid: '2902',
          value: Buffer.alloc(2)
        }),
        /* PS: still need to verify what descriptors are in fact needed for this Characteristic/service
        new Bleno.Descriptor({
          // Server Characteristic Configuration
          uuid: '2903',
          value: Buffer.alloc(2)
        })
        */
      ]
    });
    this._updateValueCallback = null;  
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    if (DEBUG) console.log('[HeartRateService] client subscribed to HR');
    this._updateValueCallback = updateValueCallback;
    return this.RESULT_SUCCESS;
  };

  onUnsubscribe() {
    if (DEBUG) console.log('[HeartRateService] client unsubscribed from HR');
    this._updateValueCallback = null;
    return this.RESULT_UNLIKELY_ERROR;
  };

  notify(event) {
    if (!('hr' in event)) {
      // ignore events with no heart rate data
      return this.RESULT_SUCCESS;;
    }
  
    if (this._updateValueCallback) {
		if (DEBUG) console.log("[heartRateService] Notify");
    /*
    var buffer = new Buffer(8); //check the size of buffer neede for HRM
		// flags PS: check what the Flags are for HRM 
		// 00000001 - 1   - 0x001 - Pedal Power Balance Present
		// 00000010 - 2   - 0x002 - Pedal Power Balance Reference
		// 00000100 - 4   - 0x004 - Accumulated Torque Present
		// 00001000 - 8   - 0x008 - Accumulated Torque Source
		// 00010000 - 16  - 0x010 - Wheel Revolution Data Present
		// 00100000 - 32  - 0x020 - Crank Revolution Data Present
		// 01000000 - 64  - 0x040 - Extreme Force Magnitudes Present
		// 10000000 - 128 - 0x080 - Extreme Torque Magnitudes Present
	   
		buffer.writeUInt16LE(0x0000, 0); //PS: still need to check and set the Flags appropriate to HRM, also length/size of this field
	   
		if ('hr' in event) {
		  var heartR = event.hr;
		  if (DEBUG) console.log("[heartRateService] HR: " + heartR);
		  buffer.writeInt16LE(heartR, 2); // PS: is this offset right? (depends of size of the Flags field!)
		}
	  
      this._updateValueCallback(buffer);
    */
    }
    
    return this.RESULT_SUCCESS;
  }
  
  
};

module.exports = HeartRateMeasurementCharacteristic;
