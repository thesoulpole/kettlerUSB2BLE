const bleno = require("bleno");

const UUID = „69d9fdd724fa4987aa3f43b5f4cabcbf”; // set your own value
const MINOR = 2; // set your own value
const MAJOR = 1; // set your own value
const TX_POWER = -60; // just declare transmit power in dBm

console.log("starting BLEno...")

bleno.on('stateChange' , state => {
    if (state==='poweredOn') {
        console.log('start advertising...');
        bleno.startAdvertisingIBeaconif(err) {
            if(err) {
                console.error(err);
            } else {
            console.log(`Broadcasting as iBeacon uuid:${UUID}, major:${MAJOR}, minor: ${MINOR}`);
            console.log(`brdcst as iB uuid: ${UUID}, major: ${MAJOR}, minor: ${MINOR}`);
            }
        });
    } else {
        console.log(„Stopping broadcast...”);
        bleno.stopAdvertising();
    }
})