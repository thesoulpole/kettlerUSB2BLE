var Bleno = require('@abandonware/bleno');
var DEBUG = false; //PS: I changed this to true, to see what data is reaching this point

class IndoorBikeDataCharacteristic extends Bleno.Characteristic {

	constructor() {
		super({
			uuid: '2AD2',
			value: null,
			properties: ['notify'],
			descriptors: [
				new Bleno.Descriptor({
					uuid: '2901',
					value: 'Indoor Bike Data'
				}),
				new Bleno.Descriptor({
					// Client Characteristic Configuration
					uuid: '2902',
					value: Buffer.alloc(2)
				})
			]
		});
		this._updateValueCallback = null;
	}

	onSubscribe(maxValueSize, updateValueCallback) {
		if (DEBUG) console.log('[IndoorBikeDataCharacteristic] client subscribed');
		this._updateValueCallback = updateValueCallback;
		return this.RESULT_SUCCESS;
	};

	onUnsubscribe() {
		if (DEBUG) console.log('[IndoorBikeDataCharacteristic] client unsubscribed');
		this._updateValueCallback = null;
		return this.RESULT_UNLIKELY_ERROR;
	};

	notify(event) {
		if (!('cadence' in event) && !('power' in event)) 
		{
			// ignore events with no power and no cadence data -> ignore those with no CADENCE
			return this.RESULT_SUCCESS; 
		}

		if (this._updateValueCallback) {
			if (DEBUG) console.log("[IndoorBikeDataCharacteristic] Notify");
			var buffer = Buffer.alloc(8);
			// speed + power + heart rate //PS: i.e. this is setting these flags
			//PS: I changed this to falg only instantanious Cadence
			buffer.writeUInt8(0x45, 0);
			buffer.writeUInt8(0x02, 1);

			var index = 2;
			/*if ('speed' in event) {
				var speed = parseInt(event.speed * 100);
				if (DEBUG) console.log("[IndoorBikeDataCharacteristic] speed: " + speed);
				buffer.writeInt16LE(speed, index);
				index += 2;
			}*/
			
			if ('cadence' in event) { //BUT THE FLAG IS NOT SET above!! -> Now its set! And - I chng "rpm" to "cadence"
				var cadence = event.cadence;
				if (DEBUG) console.log("[IndoorBikeDataCharacteristic] cadence: " + cadence);
				buffer.writeInt16LE(cadence*2, index);
				index += 2;
			}
			
			if ('power' in event) {
				var power = event.power;
				if (DEBUG) console.log("[IndoorBikeDataCharacteristic] power: " + power);
				buffer.writeInt16LE(power, index);
				index += 2;
			}

			if ('hr' in event) {
				var hr = event.hr;
				if (DEBUG) console.log("[IndoorBikeDataCharacteristic] hr : " + hr);
				buffer.writeUInt16LE(hr, index);
				index += 2;
			}
			this._updateValueCallback(buffer);
		}
		else
		{
			if (DEBUG) console.log("[IndoorBikeDataCharacteristic] nobody is listening");
		}
		return this.RESULT_SUCCESS;
	}

};

module.exports = IndoorBikeDataCharacteristic;
