
var Bleno = require('@abandonware/bleno');
var DEBUG = false; //PS:chged to true 

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
          // Client Characteristic Configuration PS: its manadatory
          uuid: '2902',
          value: Buffer.alloc(2)
        })
        /* PS: still need to verify what descriptors are in fact needed for this Characteristic/service
        new Bleno.Descriptor({
          // Server Characteristic Configuration PS: this is NOT mentioned in the HRS spec. So I'm cutting it... 
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
    
    var buffer = Buffer.alloc(2); //check the size of buffer neede for HRM
		// flags PS: check what the Flags are for HRM 
		// 00000001 - 1   - 0x001 - HRM value format - 0 is 1 byte, 1 is 2 bytes
		// 00000010 - 2   - 0x002 - Contact bad => 1 (if bit 2 is 1), ) if its OK
		// 00000100 - 4   - 0x004 - Contact Sensor present if 1, not if 0
		// 00001000 - 8   - 0x008 - expanded energy present - if 1
		// 00010000 - 16  - 0x010 - RR data present if 1 (thought the SIG spec idiotically forgot to specify WHICH bit that should be!!)
		// 00100000 - 32  - 0x020 - reserved for futire use
		// 01000000 - 64  - 0x040 - reserved for futire use
		// 10000000 - 128 - 0x080 - reserved for futire use
	   
		buffer.writeUInt8(0x00, 0); //PS: still need to check and set the Flags appropriate to HRM, also length/size of this field
	   
		if ('hr' in event) {
		  var heartR = event.hr;
		  if (DEBUG) console.log("[heartRateService] HR: " + heartR);
		  buffer.writeUInt8(heartR, 1); // PS: is this offset right? (depends of size of the Flags field!)
		}
	  
      this._updateValueCallback(buffer);
    
    }
    
    return this.RESULT_SUCCESS;
  }
  
  
};

module.exports = HeartRateMeasurementCharacteristic;
