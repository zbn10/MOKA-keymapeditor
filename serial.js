var serial = {};

(function() {
  'use strict';

  serial.getPorts = function() {
    return navigator.hid.getDevices().then(devices => {
      return devices.map(device => new serial.Port(device));
    });
  };

  serial.requestPort = function(callback) {
    const filters = [
      //{ 'vendorId': 0xcafe }, // TinyUSB
      { 'vendorId': 0x239a, 'productId': 0xcafe, 'usagePage': 0xff00}, // Adafruit
      //{ 'vendorId': 0x239a },
      //{ 'vendorId': 0x2e8a }, // Raspberry Pi
      //{ 'vendorId': 0x303a }, // Espressif
      //{ 'vendorId': 0x2341 }, // Arduino
    ];
    return navigator.hid.requestDevice({ 'filters': filters }).then(
      devices => new serial.Port(devices, callback)
    );
  }

  serial.Port = function(devices, callback) {
    if(devices.length == 0) {
      throw 'No device found.';
    }
    this.device_ = devices[0];
    this.device_.open().then(() => {
      // inputreport（通常のレポート）
      this.device_.addEventListener("inputreport", callback);

      for(let col of this.device_.collections) {
        console.log("Usage:" + col.usage + ":" + col.usagePage);
        for(let rep of col.inputReports) {
          console.log("input report:" + rep.reportId);
        }
        for(let rep of col.outputReports) {
          console.log("output report:" + rep.reportId);
        }
        for(let rep of col.featureReports) {
          console.log("feature report:" + rep.reportId);
        }
      }
    });
  };

  serial.Port.prototype.send = async function(data) {
    //console.log(typeof webhid_data.REPORTID);
    return await this.device_.sendFeatureReport(webhid_data.REPORTID, data);
  };


  serial.Port.prototype.name = function() {
    return this.device_.productName;
  };
})();

// デバイスから feature report を取得し、バイト列配列として返す
serial.Port.prototype.receive = async function() {
  // webhid.js の REPORTID を利用
  const reportId = webhid_data.REPORTID;
  try {
    const data = await this.device_.receiveFeatureReport(reportId);
    // data は DataView なので Uint8Array に変換
    return new Uint8Array(data.buffer);
  } catch (e) {
    console.error('receiveFeatureReport failed:', e);
    return null;
  }
};
