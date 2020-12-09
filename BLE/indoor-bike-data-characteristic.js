var Bleno = require('@abandonware/bleno');
var DEBUG = false;

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
			var buffer = Buffer.alloc(8); //PS: 10->8 bytes, in accordance with HR commented out below 
			// speed + power + heart rate 
			buffer.writeUInt8(0x44, 0); //PS:flags now reflect just speed, power and cadence passed to client (eg. Zwift)
			buffer.writeUInt8(0x00, 1); //PS: flag byte change form 02 to 00 to reflect no HR

			var index = 2;
			if ('speed' in event) { //PS: since Z calculates speed from Power, this would seem unnecessary, 
									// but maybe othe r clients use it...
				var speed = parseInt(event.speed * 100);
				if (DEBUG) console.log("[IndoorBikeDataCharacteristic] speed: " + speed);
				buffer.writeInt16LE(speed, index);
				index += 2;
			}
			
			if ('cadence' in event) { //PS: changed "rpm" to "cadence"
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

			/*if ('hr' in event) { //PS: removin this, since clearly Zwift takes the HR only from a HR Service
				var hr = event.hr;
				if (DEBUG) console.log("[IndoorBikeDataCharacteristic] hr : " + hr);
				buffer.writeUInt16LE(hr, index);
				index += 2;
			}*/
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
