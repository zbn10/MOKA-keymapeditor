(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connectBtn");
    let port;

    //function sendReport(cmd) {
    //  port.send(new TextEncoder('utf-8').encode(cmd));
    //}

    window.sendReport = function(data) {
      if (!port) {
        return false;
      }
      const FRAGMENT_PAYLOAD_SIZE = webhid_data.FRAGMENT_PAYLOAD_SIZE;
      let offset = 0;
      const total = data.length;
      while (offset < total) {
        const remaining = total - offset;
        const isLast = remaining <= FRAGMENT_PAYLOAD_SIZE;
        const fragment_type = isLast ? 0 : 1;
        const fragment_len = isLast ? remaining : FRAGMENT_PAYLOAD_SIZE;
        // ヘッダ2バイト + データ
        let fragment = new Uint8Array(2 + FRAGMENT_PAYLOAD_SIZE); // fixed size
        fragment[0] = fragment_type;
        fragment[1] = fragment_len;
        fragment.set(data.slice(offset, offset + fragment_len), 2);
        // 10ms待機 (従来の仕様を踏襲)
        const start = Date.now();
        while (Date.now() - start < 10) {}
        port.send(fragment);
        offset += fragment_len;
      }
      return true;
    }

    window.receiveReport = async function() {
      if (!port || typeof port.receive !== 'function') {
        return false;
      }
      const fragments = [];
      let totalLength = 0;

      while (true) {
        let report = await port.receive();
        if (!report || report.length < 2) {
          return false;
        }

        // delete report ID
        report = report.slice(1);
        const fragment_type = report[0];
        const fragment_len = report[1];
        const payloadEnd = Math.min(2 + fragment_len, report.length);
        const payload = report.slice(2, payloadEnd);

        fragments.push(payload);
        totalLength += payload.length;

        if (fragment_type === 0) {
          const merged = new Uint8Array(totalLength);
          let offset = 0;
          for (const fragment of fragments) {
            merged.set(fragment, offset);
            offset += fragment.length;
          }
          return merged;
        }
      }

      return true;
    }

    function addLine(linesId, text) {
      var senderLine = document.createElement("div");
      senderLine.className = 'line';
      var textnode = document.createTextNode(text);
      senderLine.appendChild(textnode);
      document.getElementById(linesId).appendChild(senderLine);
      return senderLine;
    }

    let currentReceiverLine;

    function appendLines(linesId, text) {
      if (!currentReceiverLine) {
        currentReceiverLine = addLine(linesId, text);
      } else {
        currentReceiverLine.innerHTML = currentReceiverLine.innerHTML + '<br>' + text;
      }
    }

    function handleInputReport(event) {
      if((event.data.getUint8(0) & 0x7f) == webhid_data.CMD_CLI) {
        let len = event.data.getUint8(2)
        let decoder = new TextDecoder('utf-8');
        let ar = new Uint8Array(event.data.buffer, 3, len);
        let data = decoder.decode(ar);
        console.log("HID input report cmd:", event.data.getUint8(0), ", len:", len, ", ", data);
        appendLines('receiver_lines', data);
      } else {
        //keyboard.processReceivedData(event.data);
      }
    }

    connectButton.addEventListener('click', function() {
      if (port) {
        connectButton.textContent = '未接続';
        port = null;
      } else {
        serial.requestPort(handleInputReport).then(selectedPort => {
          port = selectedPort;
          connectButton.textContent = `接続: ${port.name()}`;
          clearMessage();
          // 100ms待ってからinitialLoadBtnClickを呼ぶ
          setTimeout(() => {
            if (typeof initialLoadBtnClick === 'function') {
              initialLoadBtnClick();
            }
          }, 100);
        }).catch(error => {
          connectButton.textContent = '未接続';
          showMessageError(`接続失敗: ${error}`);
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length === 0) {
        connectButton.textContent = '未接続';
      } else {
        port = ports[0];
        connectButton.textContent = `接続: ${port.name()}`;
      }
    });

  });
})();
