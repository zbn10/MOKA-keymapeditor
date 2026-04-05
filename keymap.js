// 追加設定項目の動的生成
function renderCustomSettings() {
  const customSettings = document.getElementById('customSettings');
  if (!customSettings) return;
  // 選択肢データ
  const keyOptions = [];
  for (let i = 0; i <= 41; i++) {
    keyOptions.push({ value: String(i), label: `キー${i}` });
  }
  keyOptions.push(
    {value: '42', label: 'タクトスイッチ'},
    {value: '44', label: 'タッチパッド左'},
    {value: '45', label: 'タッチパッド右'},
    {value: '47', label: '人感'},
    {value: '46', label: '光量'}
  );
  const stateOptions = [
    {value: '4', label: 'タップ'},
    {value: '6', label: '長押し1'},
    {value: '7', label: '長押し2'},
    {value: '1', label: '半押し'},
    {value: '9', label: '入力値'},
  ];
  const layerOptions = [
    {value: '0', label: '0'},
    {value: '1', label: '1'},
    {value: '2', label: '2'},
    {value: '3', label: '3'}
  ];
  // DOM生成方式
  customSettings.innerHTML = '';
  const table = document.createElement('table');
  table.style.margin = '0 auto';
  const tbody = document.createElement('tbody');
  for (let row = 0; row < 10; row++) {
    const tr = document.createElement('tr');
    // キーselect
    const tdKey = document.createElement('td');
    const labelKey = document.createElement('label');
    labelKey.textContent = 'キー';
    const selectKey = document.createElement('select');
    keyOptions.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      selectKey.appendChild(o);
    });
    labelKey.appendChild(selectKey);
    tdKey.appendChild(labelKey);
    tr.appendChild(tdKey);
    // 状態select
    const tdState = document.createElement('td');
    const labelState = document.createElement('label');
    labelState.textContent = '状態';
    const selectState = document.createElement('select');
    stateOptions.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      selectState.appendChild(o);
    });
    labelState.appendChild(selectState);
    tdState.appendChild(labelState);
    tr.appendChild(tdState);
    // レイヤselect
    const tdLayer = document.createElement('td');
    const labelLayer = document.createElement('label');
    labelLayer.textContent = 'レイヤ';
    const selectLayer = document.createElement('select');
    layerOptions.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      selectLayer.appendChild(o);
    });
    labelLayer.appendChild(selectLayer);
    tdLayer.appendChild(labelLayer);
    tr.appendChild(tdLayer);
    // 設定ボタン
    const tdBtn = document.createElement('td');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'function-btn';
    btn.setAttribute('aria-label', '設定ボタン');
    btn.setAttribute('data-func-value', '');
    btn.textContent = '';
    // ドラッグイベント（renderKeyboardと同様）
    btn.addEventListener('dragover', (e) => {
      e.preventDefault();
      btn.classList.add('selected');
    });
    btn.addEventListener('dragleave', () => {
      btn.classList.remove('selected');
    });
    btn.addEventListener('drop', (e) => {
      e.preventDefault();
      btn.classList.remove('selected');
      const funcValue = e.dataTransfer.getData('func-value');
      let funcName = e.dataTransfer.getData('func-name');
      // funcValueと16進数文字列をどちらも数値に変換して比較
      const tr = btn.closest('tr');
      if (tr) {
        const selects = tr.querySelectorAll('select');
        if (selects.length > 1) {
          const numFuncValue = Number(funcValue);
          const jigler = Number('0xB2'); // JIGLR
          const ledauto = Number('0xBD'); // LEDAT
          const tpscroll = Number('0xD7'); // TP_SC
          const tpleft = Number('0xDA'); // TP_L
          const tpleftx2 = Number('0xDB'); // TP_L2
          const tpright = Number('0xDC'); // TP_R
          const tprightx2 = Number('0xDD'); // TP_R2
          if (numFuncValue === jigler) {
            selects[1].value = '9'; // 状態を「入力値」に変更
            selects[0].value = '47'; // キーを「人感」に変更
          } else if (numFuncValue === ledauto) {
            selects[1].value = '9';
            selects[0].value = '46'; // キーを「光量」に変更
          } else if (numFuncValue === tpscroll) {
            selects[1].value = '9';
            selects[0].value = '44'; // キーを「タッチパッド左」に変更
          } else if (numFuncValue === tpleft || numFuncValue === tpleftx2) {
            selects[1].value = '9';
            selects[0].value = '44';
          } else if (numFuncValue === tpright || numFuncValue === tprightx2) {
            selects[1].value = '9';
            selects[0].value = '45';
          } else {
            selects[1].value = '4'; // 状態を「タップ」に変更
          }
        }
      }
      btn.setAttribute('data-func-value', funcValue);
      if (funcValue === '0' || funcValue === 0) {
        funcName = '';
      }
      btn.textContent = funcName;
    });
    btn.addEventListener('focus', () => {
      btn.classList.add('selected');
    });
    btn.addEventListener('blur', () => {
      btn.classList.remove('selected');
    });
    tdBtn.appendChild(btn);
    tr.appendChild(tdBtn);

    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  customSettings.appendChild(table);
}

// 磁気スイッチ設定項目の動的生成
function renderMagswSettings() {
  const magswSettings = document.getElementById('MagswSettings') || document.getElementById('magswSettings');
  if (!magswSettings) return;
  const layerColumnWidth = '56px';
  const settingColumnWidth = '120px';

  const settingColumns = [
    { key: 'partialPressPoint', label: '半押し' },
    { key: 'partialReleasePoint', label: '半リリース' },
    { key: 'PressPoint', label: '全押し' },
    { key: 'ReleasePoint', label: '全リリース' },
    { key: 'tapJudgeTime', label: 'タップ(～999ms)' }
  ];

  magswSettings.innerHTML = '';
  const table = document.createElement('table');
  table.style.margin = '0 auto';
  table.style.tableLayout = 'fixed';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');

  //const layerHeader = document.createElement('td');
  //layerHeader.textContent = 'レイヤ';
  //layerHeader.style.width = layerColumnWidth;
  //layerHeader.style.whiteSpace = 'nowrap';
  //headRow.appendChild(layerHeader);

  settingColumns.forEach((column) => {
    const td = document.createElement('td');
    td.textContent = column.label;
    td.style.width = settingColumnWidth;
    td.style.whiteSpace = 'nowrap';
    headRow.appendChild(td);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (let layer = 0; layer < 1; layer++) { // current layer only
    const tr = document.createElement('tr');

    //const tdLayer = document.createElement('td');
    //tdLayer.textContent = String(layer);
    //tdLayer.style.width = layerColumnWidth;
    //tdLayer.style.whiteSpace = 'nowrap';
    //tr.appendChild(tdLayer);

    const maxvalue = {partialPressPoint: 255, partialReleasePoint: 255, PressPoint: 255, ReleasePoint: 255, tapJudgeTime: 999};
    settingColumns.forEach((column) => {
      const td = document.createElement('td');
      td.style.width = settingColumnWidth;
      td.style.whiteSpace = 'nowrap';
      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = String(maxvalue[column.key] ?? 255);
      input.step = '10';
      input.value = '0';
      input.style.width = '100px';
      input.name = `magsw-layer-${layer}-${column.key}`;
      input.setAttribute('aria-label', `レイヤ${layer} ${column.label}`);
      td.appendChild(input);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  magswSettings.appendChild(table);
}

// タッチパッド設定の動的生成
function renderTouchpadSettings() {
  const touchpadSettings = document.getElementById('touchpadSettings');
  if (!touchpadSettings) return;
  touchpadSettings.innerHTML = '';

  // ラッパーdivで横並び
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'center';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '24px';

  const touchpadFeelOptions = [
    { value: '0', label: '安定' },
    { value: '1', label: '標準' },
    { value: '2', label: '軽快' }
  ];
  const touchpadStrengthOptions = [
    { value: '0', label: '0' },
    { value: '1', label: '1' },
    { value: '2', label: '2' }
  ];

  // 操作感 左
  const leftFeelLabel = document.createElement('label');
  leftFeelLabel.textContent = '左 操作感：';
  leftFeelLabel.style.marginRight = '5px';
  const leftFeelSelect = document.createElement('select');
  leftFeelSelect.name = 'touchpad-leftfeel';
  leftFeelSelect.setAttribute('aria-label', '左タッチパッド操作感');
  touchpadFeelOptions.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    leftFeelSelect.appendChild(o);
  });
  leftFeelLabel.appendChild(leftFeelSelect);
  wrapper.appendChild(leftFeelLabel);

  // 強さ 左
  const leftStrengthLabel = document.createElement('label');
  leftStrengthLabel.textContent = '左レベル：';
  leftStrengthLabel.style.marginRight = '5px';
  const leftStrengthSelect = document.createElement('select');
  leftStrengthSelect.name = 'touchpad-leftstrength';
  leftStrengthSelect.setAttribute('aria-label', '左タッチパッドレベル');
  touchpadStrengthOptions.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    leftStrengthSelect.appendChild(o);
  });
  leftStrengthLabel.appendChild(leftStrengthSelect);
  wrapper.appendChild(leftStrengthLabel);

  // 操作感 右
  const rightFeelLabel = document.createElement('label');
  rightFeelLabel.textContent = '右 操作感：';
  rightFeelLabel.style.marginRight = '5px';
  const rightFeelSelect = document.createElement('select');
  rightFeelSelect.name = 'touchpad-rightfeel';
  rightFeelSelect.setAttribute('aria-label', '右タッチパッド操作感');
  touchpadFeelOptions.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    rightFeelSelect.appendChild(o);
  });
  rightFeelLabel.appendChild(rightFeelSelect);
  wrapper.appendChild(rightFeelLabel);

  // 強さ 右
  const rightStrengthLabel = document.createElement('label');
  rightStrengthLabel.textContent = '右レベル：';
  rightStrengthLabel.style.marginRight = '5px';
  const rightStrengthSelect = document.createElement('select');
  rightStrengthSelect.name = 'touchpad-rightstrength';
  rightStrengthSelect.setAttribute('aria-label', '右タッチパッドレベル');
  touchpadStrengthOptions.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    rightStrengthSelect.appendChild(o);
  });
  rightStrengthLabel.appendChild(rightStrengthSelect);
  wrapper.appendChild(rightStrengthLabel);

  touchpadSettings.appendChild(wrapper);
}

// LED設定項目の動的生成
function renderLedSettings() {
  const ledSettings = document.getElementById('ledSettings');
  if (!ledSettings) return;

  const statusRows = [
    { key: '',          label: 'キーLED' },
    { key: 'release',   label: 'リリース' },
    { key: 'halfPress', label: '半押し' },
    { key: 'fullPress', label: '全押し' },
    { key: 'error',     label: 'エラー' },
  ];
  const systemStates = [
    { key: 'state1', label: 'キャリブレーション' },
    { key: 'state2', label: 'システムイベント' },
    { key: 'state3', label: 'サブマイコンエラー' },
    { key: 'state4', label: 'キーエラー' },
    { key: 'state5', label: 'NumLock' },
    { key: 'state6', label: 'CapsLock' },
    { key: 'state7', label: 'ScrollLock' }
  ];
  const colorOptions = [
    { value: 0, label: '色なし' },
    { value: 1, label: '赤' },
    { value: 2, label: '緑' },
    { value: 3, label: '青' },
    { value: 4, label: '黄' },
    { value: 5, label: 'シアン' },
    { value: 6, label: 'マゼンタ' },
    { value: 7, label: '白' },
    { value: 8, label: '虹' }
  ];

  const statusColumnWidth = '120px';
  const colorColumnWidth  = '120px';
  const rgbColumnWidth = '84px';

  ledSettings.innerHTML = '';

  // ステータス × カラー テーブル
  const table = document.createElement('table');
  table.style.margin = '0 auto';
  table.style.tableLayout = 'fixed';

  const tbody = document.createElement('tbody');

  const labelRow = document.createElement('tr');
  statusRows.forEach((status) => {
    const tdLabel = document.createElement('td');
    tdLabel.textContent = status.label;
    tdLabel.style.width = statusColumnWidth;
    tdLabel.style.whiteSpace = 'nowrap';
    labelRow.appendChild(tdLabel);
  });
  tbody.appendChild(labelRow);

  const selectRow = document.createElement('tr');
  statusRows.forEach((status) => {
    const tdColor = document.createElement('td');
    tdColor.style.width = colorColumnWidth;
    tdColor.style.whiteSpace = 'nowrap';
    if (status.key !== '') {
      const select = document.createElement('select');
      select.name = `led-color-${status.key}`;
      select.setAttribute('aria-label', `${status.label} カラー`);
      let optionsToAdd = colorOptions;
      //if (status.key === 'release') {
      //  optionsToAdd = colorOptions.filter(opt => opt.value === 0 || opt.value === 8);
      //}
      optionsToAdd.forEach((opt) => {
        const o = document.createElement('option');
        o.value = String(opt.value);
        o.textContent = opt.label;
        select.appendChild(o);
      });
      tdColor.appendChild(select);
    }
    selectRow.appendChild(tdColor);
  });
  tbody.appendChild(selectRow);

  table.appendChild(tbody);
  ledSettings.appendChild(table);

  // システム状態ごとのRGB設定
  const rgbTable = document.createElement('table');
  rgbTable.style.margin = '12px auto 0';
  rgbTable.style.tableLayout = 'fixed';

  const rgbHead = document.createElement('thead');
  const rgbHeadRow = document.createElement('tr');
  [
    { label: 'システムLED', width: '70px' },
    { label: 'R(0～255)', width: rgbColumnWidth },
    { label: 'G(0～255)', width: rgbColumnWidth },
    { label: 'B(0～255)', width: rgbColumnWidth }
  ].forEach((column) => {
    const td = document.createElement('td');
    td.textContent = column.label;
    td.style.width = column.width;
    td.style.whiteSpace = 'nowrap';
    rgbHeadRow.appendChild(td);
  });
  rgbHead.appendChild(rgbHeadRow);
  rgbTable.appendChild(rgbHead);

  const rgbBody = document.createElement('tbody');
  systemStates.forEach((state) => {
    const tr = document.createElement('tr');

    const labelCell = document.createElement('td');
    labelCell.textContent = state.label;
    labelCell.style.whiteSpace = 'nowrap';
    tr.appendChild(labelCell);

    ['r', 'g', 'b'].forEach((channel) => {
      const td = document.createElement('td');
      td.style.width = rgbColumnWidth;
      td.style.whiteSpace = 'nowrap';

      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '255';
      input.step = '1';
      input.value = '0';
      input.style.width = '64px';
      input.name = `led-rgb-${state.key}-${channel}`;
      input.setAttribute('aria-label', `${state.label} ${channel.toUpperCase()} (0～255)`);

      td.appendChild(input);
      tr.appendChild(td);
    });

    rgbBody.appendChild(tr);
  });
  rgbTable.appendChild(rgbBody);
  ledSettings.appendChild(rgbTable);

  // LEDの明るさ
  const brightnessRow = document.createElement('div');
  brightnessRow.style.marginTop = '12px';
  const brightnessLabel = document.createElement('label');
  brightnessLabel.style.display = 'inline-flex';
  brightnessLabel.style.alignItems = 'center';
  brightnessLabel.style.gap = '8px';
  brightnessLabel.textContent = 'LEDの明るさ（0〜255）：';
  const brightnessInput = document.createElement('input');
  brightnessInput.type = 'number';
  brightnessInput.id = 'led-brightness';
  brightnessInput.min = '0';
  brightnessInput.max = '255';
  brightnessInput.step = '1';
  brightnessInput.value = '128';
  brightnessInput.style.width = '80px';
  brightnessInput.setAttribute('aria-label', 'LEDの明るさ');
  brightnessLabel.appendChild(brightnessInput);
  brightnessRow.appendChild(brightnessLabel);
  ledSettings.appendChild(brightnessRow);

  // バックライト トグルスイッチ
  const backlightRow = document.createElement('div');
  backlightRow.style.marginTop = '12px';
  const backlightWrap = document.createElement('label');
  backlightWrap.style.display = 'inline-flex';
  backlightWrap.style.alignItems = 'center';
  backlightWrap.style.gap = '8px';
  const backlightText = document.createElement('span');
  backlightText.textContent = 'バックライト：';
  backlightWrap.appendChild(backlightText);
  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'toggle-switch';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'led-backlight';
  checkbox.setAttribute('aria-label', 'バックライト');
  const slider = document.createElement('span');
  slider.className = 'toggle-slider';
  toggleLabel.appendChild(checkbox);
  toggleLabel.appendChild(slider);
  backlightWrap.appendChild(toggleLabel);
  backlightRow.appendChild(backlightWrap);
  ledSettings.appendChild(backlightRow);
}

// キー数定義
const keyRows = [12, 12, 12, 6];
// const keyboard = document.getElementById('keyboard'); // グローバル取得を廃止
const layerCount = 4;
const keymapByLayer = Array.from({ length: 42 }, () =>
  Array.from({ length: layerCount }, () => ({ name: '', funcValue: '' }))
);

function getSelectedLayerIndex() {
  const layerSelect = document.getElementById('layerSelect');
  const value = Number(layerSelect?.value ?? '0');
  if (Number.isInteger(value) && value >= 0 && value < layerCount) {
    return value;
  }
  return 0;
}

function setLayerDataAttributes(button, keyIndex) {
  for (let layer = 0; layer < layerCount; layer++) {
    const data = keymapByLayer[keyIndex][layer];
    button.setAttribute(`data-layer-${layer}-name`, data.name);
    button.setAttribute(`data-layer-${layer}-func-value`, data.funcValue);
  }
}

function syncKeyboardDomFromLayerData() {
  const keyboard = document.getElementById('keyboard');
  if (!keyboard) return;
  const selectedLayer = getSelectedLayerIndex();
  const keyElements = keyboard.querySelectorAll('.key');

  keyElements.forEach((keyElement) => {
    const keyIndex = Number(keyElement.dataset.index);
    if (!Number.isInteger(keyIndex) || keyIndex < 0 || keyIndex >= keymapByLayer.length) {
      return;
    }

    const btn = keyElement.querySelector('button.key-input');
    if (!btn) return;

    const layerData = keymapByLayer[keyIndex][selectedLayer];
    if (layerData.funcValue === '0' || layerData.funcValue === 0) {
      btn.textContent = '';
    } else {
      btn.textContent = layerData.name;
    }
    btn.setAttribute('data-func-value', layerData.funcValue);
    setLayerDataAttributes(btn, keyIndex);
  });
}

function renderKeyboard() {
  const keyboard = document.getElementById('keyboard');
  if (!keyboard) return;
  const selectedLayer = getSelectedLayerIndex();
  keyboard.innerHTML = '';
  let keyIndex = 0;
  keyRows.forEach((count, rowIdx) => {
    const row = document.createElement('div');
    row.className = 'key-row';
    for (let i = 0; i < count; i++) {
      const currentKeyIndex = keyIndex;
      const key = document.createElement('div');
      key.className = 'key';
      key.tabIndex = 0;
      key.dataset.index = currentKeyIndex;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'key-input';
      const layerData = keymapByLayer[currentKeyIndex][selectedLayer];
      btn.textContent = layerData.name;
      btn.setAttribute('aria-label', `キー${currentKeyIndex}`);
      btn.style.width = '100%';
      btn.style.height = '100%';
      btn.setAttribute('data-func-value', layerData.funcValue);
      setLayerDataAttributes(btn, currentKeyIndex);

      // ドロップイベント
      btn.addEventListener('dragover', (e) => {
        e.preventDefault();
        key.classList.add('selected');
      });
      btn.addEventListener('dragleave', () => {
        key.classList.remove('selected');
      });
      btn.addEventListener('drop', (e) => {
        e.preventDefault();
        key.classList.remove('selected');
        const funcValue = e.dataTransfer.getData('func-value');
        let funcName = e.dataTransfer.getData('func-name');
        // 0xB2 または 0xBD の場合は配置不可
        // funcValueと16進数文字列をどちらも数値に変換して比較
        const numFuncValue = Number(funcValue);
        const ban1 = Number('0xB2'); // JIGLR
        const ban2 = Number('0xBD'); // LEDAT
        if (numFuncValue === ban1 || numFuncValue === ban2) {
          showMessageError('配置できません');
          setTimeout(clearMessage, 5000);
          return;
        }
        const activeLayer = getSelectedLayerIndex();
        keymapByLayer[currentKeyIndex][activeLayer] = {
          name: funcName,
          funcValue: funcValue
        };
        setLayerDataAttributes(btn, currentKeyIndex);
        btn.setAttribute('data-func-value', funcValue);
        if(funcValue === '0' || funcValue === 0) {
          funcName = '';
        }
        btn.textContent = funcName;
      });

      btn.addEventListener('focus', () => {
        key.classList.add('selected');
      });
      btn.addEventListener('blur', () => {
        key.classList.remove('selected');
      });
      key.appendChild(btn);
      row.appendChild(key);
      keyIndex++;
    }
    keyboard.appendChild(row);
  });
}

function toUint8(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return num & 0xff;
}

function toFixedReportData(source) {
  const payload = source instanceof Uint8Array ? source : new Uint8Array(source ?? []);
  const dataSize = Number(webhid_data?.DATA_SIZE);
  const fixedSize = Number.isInteger(dataSize) && dataSize > 0 ? dataSize : payload.length;
  const fixed = new Uint8Array(fixedSize);
  const copyLength = Math.min(payload.length, fixed.length);
  fixed.set(payload.subarray(0, copyLength), 0);
  return fixed;
}

function getFunctionNameByValue(funcValue) {
  const numValue = Number(funcValue);
  const found = functionCodeList.find((fn) => Number(fn.value) === numValue);
  return found ? found.name : '';
}

function setWebhidHeader(flat, cmd, protocolVersion, confVersion, primaryProfile, profile, osLang) {
  flat.push(toUint8(cmd));
  if (protocolVersion !== 0) {
    flat.push(toUint8(protocolVersion, confVersion));
  }
  flat.push(toUint8(primaryProfile));
  flat.push(toUint8(profile));
  flat.push(toUint8(osLang));
}

function flattenKeymapLayerToUint8Array(flat) {
  // be aware of the differences in processing based on the protocol version and conf version.
  
  for (let layer = 0; layer < layerCount; layer++) {
    for (let keyIndex = 0; keyIndex < keymapByLayer.length; keyIndex++) {
      flat.push(toUint8(keymapByLayer[keyIndex][layer].funcValue));
    }
  }

  const customSettings = document.getElementById('customSettings');
  if (customSettings) {
    const rows = customSettings.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const selects = row.querySelectorAll('select');
      const settingBtn = row.querySelector('button.function-btn');
      const keyValue = selects[0]?.value ?? '0';
      const stateValue = selects[1]?.value ?? '0';
      const layerValue = selects[2]?.value ?? '0';
      const funcValue = settingBtn?.getAttribute('data-func-value') ?? '0';

      flat.push(toUint8(keyValue));
      flat.push(toUint8(stateValue));
      flat.push(toUint8(layerValue));
      flat.push(toUint8(funcValue));
    });
  }

  const magswSettings = document.getElementById('MagswSettings') || document.getElementById('magswSettings');
  if (magswSettings) {
    const rows = magswSettings.querySelectorAll('tbody tr');
    let valuesToPush = [];
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const row = rows[rowIdx];
      const inputs = Array.from(row.querySelectorAll('input[type="number"]'));
      // 0〜3番目はそのままpush
      for (let i = 0; i < 4; i++) {
        valuesToPush.push(toUint8(inputs[i].value) & 0xFF);
      }
      // 5つ目はuint16としてhigh/lowに分割
      if (inputs[4]) {
        const val16 = Number(inputs[4].value) & 0xFFFF;
        valuesToPush.push((val16 >> 8) & 0xFF); // high byte
        valuesToPush.push(val16 & 0xFF);        // low byte
      }

      if(valuesToPush[0] <= valuesToPush[1]) {
        showMessageError('半押し動作ポイント > 半リリース動作ポイント に修正してください');
        setTimeout(clearMessage, 5000);
        return false;
      }
      if(valuesToPush[2] <= valuesToPush[3]) {
        showMessageError('全押し動作ポイント > 全リリース動作ポイント に修正してください');
        setTimeout(clearMessage, 5000);
        return false;
      }
      if(valuesToPush[2] <= valuesToPush[0]) {
        showMessageError('全押し動作ポイント > 半押し動作ポイント に修正してください');
        setTimeout(clearMessage, 5000);
        return false;
      }
      if((valuesToPush[4] << 8) + valuesToPush[5] >= 1000) {
        showMessageError('タップ判定時間 < 1000 に修正してください');
        setTimeout(clearMessage, 5000);
        return false;
      }
      valuesToPush.forEach(v => flat.push(v));
    }
  }

  // touchpad
  if (webhid_data.received_confversion >= 2) {
    const touchpadFeelLeft = document.querySelector('select[name="touchpad-leftfeel"]');
    const touchpadStrengthLeft = document.querySelector('select[name="touchpad-leftstrength"]');
    const touchpadFeelRight = document.querySelector('select[name="touchpad-rightfeel"]');
    const touchpadStrengthRight = document.querySelector('select[name="touchpad-rightstrength"]');
    flat.push(toUint8(touchpadFeelLeft.value));
    flat.push(toUint8(touchpadStrengthLeft.value));
    flat.push(toUint8(touchpadFeelRight.value));
    flat.push(toUint8(touchpadStrengthRight.value));
  }

  // LED
  const ledSettingsEl = document.getElementById('ledSettings');
  if (ledSettingsEl) {
    const colorSelects = ledSettingsEl.querySelectorAll('select[name^="led-color-"]');
    colorSelects.forEach((select) => {
      flat.push(toUint8(select.value));
    });
    const rgbInputs = ledSettingsEl.querySelectorAll('input[name^="led-rgb-"]');
    rgbInputs.forEach((input) => {
      flat.push(toUint8(input.value));
    });
    const brightness = ledSettingsEl.querySelector('#led-brightness');
    flat.push(toUint8(brightness?.value ?? '128'));
    const backlight = ledSettingsEl.querySelector('#led-backlight');
    flat.push(backlight?.checked ? 1 : 0);
  }

  return true;
}

function inflateKeymapLayerFromUint8Array(payload) {
  if (!payload || payload.length < 3) {
    return false;
  }

  let index = 0;
  index++; // コマンド種別

  const primaryProfileValue = payload[index++] ?? 0;
  const profileValue = payload[index++] ?? 0;
  const osLangValue = payload[index++] ?? 0;

  const primaryProfileSelect = document.getElementById('primaryProfileSelect');
  if (primaryProfileSelect) {
    primaryProfileSelect.value = String(primaryProfileValue);
  }

  const profileSelect = document.getElementById('profileSelect');
  if (profileSelect) {
    profileSelect.value = String(profileValue);
  }

  const osLangSelect = document.getElementById('osLangSelect');
  if (osLangSelect) {
    osLangSelect.value = String(osLangValue);
  }

  for (let layer = 0; layer < layerCount; layer++) {
    for (let keyIndex = 0; keyIndex < keymapByLayer.length; keyIndex++) {
      const funcValue = payload[index++] ?? 0;
      keymapByLayer[keyIndex][layer] = {
        name: getFunctionNameByValue(funcValue),
        funcValue: String(funcValue)
      };
    }
  }

  const customSettings = document.getElementById('customSettings');
  if (customSettings) {
    const rows = customSettings.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const keyValue = payload[index++] ?? 0;
      const stateValue = payload[index++] ?? 0;
      const layerValue = payload[index++] ?? 0;
      const funcValue = payload[index++] ?? 0;

      const selects = row.querySelectorAll('select');
      if (selects[0]) selects[0].value = String(keyValue);
      if (selects[1]) selects[1].value = String(stateValue);
      if (selects[2]) selects[2].value = String(layerValue);

      const settingBtn = row.querySelector('button.function-btn');
      if (settingBtn) {
        settingBtn.setAttribute('data-func-value', String(funcValue));
        if(funcValue === 0) {
          settingBtn.textContent = '';
        } else {
          settingBtn.textContent = getFunctionNameByValue(funcValue);
        }
      }
    });
  }

  // magsw
  const magswSettings = document.getElementById('MagswSettings') || document.getElementById('magswSettings');
  if (magswSettings) {
    const rows = magswSettings.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const inputs = row.querySelectorAll('input[type="number"]');
      for (let i = 0; i < 4; i++) {
        inputs[i].value = String(payload[index++] ?? 0);
      }
      if (inputs[4]) {
        const val_high = payload[index++] ?? 0;
        const val_low = payload[index++] ?? 0;
        inputs[4].value = String((val_high << 8) | val_low);
      }
    });
  }

  // touchpad
  if (webhid_data.received_confversion >= 2) {
    const leftfeel = payload[index++] ?? 0;
    const leftstrength = payload[index++] ?? 0;
    const rightfeel = payload[index++] ?? 0;
    const rightstrength = payload[index++] ?? 0;
    const touchpadFeelLeft = document.querySelector('select[name="touchpad-leftfeel"]');
    const touchpadStrengthLeft = document.querySelector('select[name="touchpad-leftstrength"]');
    const touchpadFeelRight = document.querySelector('select[name="touchpad-rightfeel"]');
    const touchpadStrengthRight = document.querySelector('select[name="touchpad-rightstrength"]');
    if (touchpadFeelLeft) touchpadFeelLeft.value = String(leftfeel);
    if (touchpadStrengthLeft) touchpadStrengthLeft.value = String(leftstrength);
    if (touchpadFeelRight) touchpadFeelRight.value = String(rightfeel);
    if (touchpadStrengthRight) touchpadStrengthRight.value = String(rightstrength);
  }

  // LED
  const ledSettingsEl = document.getElementById('ledSettings');
  if (ledSettingsEl) {
    const colorSelects = ledSettingsEl.querySelectorAll('select[name^="led-color-"]');
    colorSelects.forEach((select) => {
      select.value = String(payload[index++] ?? 1);
    });

    const rgbInputs = ledSettingsEl.querySelectorAll('input[name^="led-rgb-"]');
    rgbInputs.forEach((input) => {
      input.value = String(payload[index++] ?? 0);
    });

    const brightness = ledSettingsEl.querySelector('#led-brightness');
    if (brightness) {
      brightness.value = String(payload[index++] ?? 128);
    }

    const backlight = ledSettingsEl.querySelector('#led-backlight');
    if (backlight) {
      backlight.checked = Boolean(payload[index++] ?? 0);
    }
  }

  syncKeyboardDomFromLayerData();
  return true;
}



async function initialLoadBtnClick() {
  const reqprotover = [];

  const cmd = webhid_data.CMD_GETPROTOCOLVERSION;
  const protover = webhid_data.max_protocolversion;
  setWebhidHeader(reqprotover, cmd, protover, 0, 0, 0, 0);

  if(sendReport(reqprotover) === false) {
    showMessageError('デバイス接続状態を確認してください。');
    return;
  }
  console.log(Array.from(reqprotover));
  await new Promise((resolve) => setTimeout(resolve, 200));

  const receiveprotover = await receiveReport();
  // firmware v1.0.0 does not support CMD_GETPROTOCOLVERSION request
  if (!receiveprotover || receiveprotover.length === 0) {
    webhid_data.received_protocolversion = 0; // non support condition
  } else {
    console.log(Array.from(receiveprotover));
    if (receiveprotover[0] === webhid_data.RESPONSE_ACK) {
      let pver = receiveprotover[1] ?? 0;
      if(pver > webhid_data.max_protocolversion) {
        showMessageError('プロトコルバージョンが想定より大きいです。');
        pver = 0;
      }
      webhid_data.received_protocolversion = pver;
    }
  }

  const profileSelect = document.getElementById('profileSelect');
  if (profileSelect) {
    profileSelect.value = '126'; // Load active profile
  }
  await handleLoadBtnClick();
}

async function handleLoadBtnClick() {
  webhid_data.applied_keymap = false;

  const reqload = [];
  const cmd = webhid_data.CMD_FETCH;
  const protover = webhid_data.received_protocolversion;
  const confver = webhid_data.received_confversion;
  const primaryProfile = toUint8(document.getElementById('primaryProfileSelect').value, 10);
  const profile = toUint8(document.getElementById('profileSelect').value, 10);
  const oslayout = toUint8(document.getElementById('osLangSelect').value, 10);
  setWebhidHeader(reqload, cmd, protover, confver, primaryProfile, profile, oslayout);
  if(!sendReport(reqload)) {
    showMessageError('読込コマンド送信に失敗。デバイス接続状態を確認してください。');
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 200));

  const received = await receiveReport();
  if (!received || received.length === 0) {
    showMessageError('読込に失敗。デバイス接続状態を確認してください。');
    return;
  }

  console.log(Array.from(received));
  const loaded = inflateKeymapLayerFromUint8Array(received);
  if (!loaded) {
    showMessageError('受信データの形式が不正です。');
    return;
  }
  if (received[0] === webhid_data.RESPONSE_ACK) {
    showMessageInfo('読込に成功しました');
  } else if (received[0] === webhid_data.RESPONSE_INVALID_SAVE) {
    showMessageError('該当プロファイルは保存されていません');
  } else {
    const responseText = webhid_data.ResponseCode[received[0]] ?? String(received[0]);
    showMessageError('読み込みに失敗。エラー:' + responseText);
  }
}



async function handleApplyBtnClick() {
  webhid_data.applied_keymap = false;

  const flat = [];

  const cmd = webhid_data.CMD_APPLY;
  const protocolVersion = webhid_data.received_protocolversion;
  const confVersion = webhid_data.received_confversion;
  const primaryProfileSelect = document.getElementById('primaryProfileSelect');
  const primaryProfile = primaryProfileSelect?.value ?? '0';
  const profileSelect = document.getElementById('profileSelect');
  const profile = profileSelect?.value ?? '0';
  const osLangSelect = document.getElementById('osLangSelect');
  const osLang = osLangSelect?.value ?? '0';
  setWebhidHeader(flat, cmd, protocolVersion, confVersion, primaryProfile, profile, osLang);

  if(!flattenKeymapLayerToUint8Array(flat)) {
    return;
  }

  //const fixedPayload = toFixedReportData(flat);
  if(sendReport(flat) === false) {
    showMessageError('反映に失敗しました。デバイス接続状態を確認してください。');
    return;
  }
  console.log(Array.from(flat));
  await new Promise((resolve) => setTimeout(resolve, 200));

  const received = await receiveReport();
  if (!received || received.length === 0) {
    showMessageError('反映結果取得に失敗。デバイス接続状態を確認してください');
    return;
  }

  console.log(Array.from(received));
  if (received[0] === webhid_data.RESPONSE_ACK) {
    showMessageInfo('反映に成功しました');
    webhid_data.applied_keymap = true;
  } else {
    const responseText = webhid_data.ResponseCode[received[0]] ?? String(received[0]);
    showMessageError('反映に失敗。エラー:' + responseText);
  }
}


async function handleSaveBtnClick() {
  if(webhid_data.applied_keymap === false) {
    const confirmed = window.confirm('キーマップを反映していませんが、保存していいですか？');
    if (!confirmed) {
      return;
    }
  }

  const reqsave = [];
  const cmd = webhid_data.CMD_SAVE;
  const protover = webhid_data.received_protocolversion;
  const confver = webhid_data.received_confversion;
  const primaryProfile = toUint8(document.getElementById('primaryProfileSelect').value, 10);
  const profile = toUint8(document.getElementById('profileSelect').value, 10);
  const oslayout = toUint8(document.getElementById('osLangSelect').value, 10);
  setWebhidHeader(reqsave, cmd, protover, confver, primaryProfile, profile, oslayout);
  if(!sendReport(reqsave)) {
    showMessageError('保存に失敗。デバイス接続状態を確認してください。');
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 50));

  const received = await receiveReport();
  if (received && received.length > 0) {
    console.log(Array.from(received));

    if (received[0] === webhid_data.RESPONSE_ACK) {
      showMessageInfo('保存に成功しました');
    } else {
      const responseText = webhid_data.ResponseCode[received[0]] ?? String(received[0]);
      showMessageError('保存に失敗。エラー:' + responseText);
    }
  } else {
    showMessageError('保存に失敗。デバイス接続状態を確認してください。');
  }

}


async function handleImportBtnClick() {
  // ファイル選択ダイアログを表示
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.style.display = 'none';
  document.body.appendChild(input);

  input.addEventListener('change', async (e) => {
    const file = input.files[0];
    if (!file) {
      document.body.removeChild(input);
      return;
    }
    try {
      const text = await file.text();
      let data = JSON.parse(text);
      // osLang
      if (typeof data.osLang !== 'undefined') {
        const osLangSelect = document.getElementById('osLangSelect');
        if (osLangSelect) osLangSelect.value = String(data.osLang);
      }
      // keymapByLayer
      if (Array.isArray(data.keymap)) {
        for (let layer = 0; layer < layerCount; layer++) {
          for (let key = 0; key < keymapByLayer.length; key++) {
            const item = data.keymap[layer]?.[key];
            if (item) {
              keymapByLayer[key][layer] = { ...item };
            }
          }
        }
      }
      // customSettings
      const customSettings = document.getElementById('customSettings');
      if (customSettings && Array.isArray(data.customSettings)) {
        const rows = customSettings.querySelectorAll('tbody tr');
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const selects = row.querySelectorAll('select');
          const settingBtn = row.querySelector('button.function-btn');
          const obj = data.customSettings[i];
          if (obj) {
            if (selects[0]) selects[0].value = String(obj.key);
            if (selects[1]) selects[1].value = String(obj.state);
            if (selects[2]) selects[2].value = String(obj.layer);
            if (settingBtn) {
              settingBtn.setAttribute('data-func-value', String(obj.func));
              settingBtn.textContent = obj.func === '0' || obj.func === 0 ? '' : getFunctionNameByValue(obj.func);
            }
          }
        }
      }
      // magswSettings
      const magswSettings = document.getElementById('MagswSettings') || document.getElementById('magswSettings');
      if (magswSettings && Array.isArray(data.magswSettings)) {
        const rows = magswSettings.querySelectorAll('tbody tr');
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const obj = data.magswSettings[i];
          const inputs = row.querySelectorAll('input[type="number"]');
          if (obj) {
            if (inputs[0]) inputs[0].value = String(obj.partialPressPoint);
            if (inputs[1]) inputs[1].value = String(obj.partialReleasePoint);
            if (inputs[2]) inputs[2].value = String(obj.PressPoint);
            if (inputs[3]) inputs[3].value = String(obj.ReleasePoint);
            if (inputs[4]) inputs[4].value = String(obj.tapJudgeTime);
          }
        }
      }
      // touchpadSettings
      if (Array.isArray(data.touchpadSettings) && data.touchpadSettings.length > 0) {
        const obj = data.touchpadSettings[0];
        const touchpadFeelLeft = document.querySelector('select[name="touchpad-leftfeel"]');
        const touchpadStrengthLeft = document.querySelector('select[name="touchpad-leftstrength"]');
        const touchpadFeelRight = document.querySelector('select[name="touchpad-rightfeel"]');
        const touchpadStrengthRight = document.querySelector('select[name="touchpad-rightstrength"]');
        if (touchpadFeelLeft) touchpadFeelLeft.value = String(obj.leftFeel);
        if (touchpadStrengthLeft) touchpadStrengthLeft.value = String(obj.leftStrength);
        if (touchpadFeelRight) touchpadFeelRight.value = String(obj.rightFeel);
        if (touchpadStrengthRight) touchpadStrengthRight.value = String(obj.rightStrength);
      }
      // ledSettings
      if (Array.isArray(data.ledSettings) && data.ledSettings.length > 0) {
        const obj = data.ledSettings[0];
        const ledSettingsEl = document.getElementById('ledSettings');
        if (ledSettingsEl) {
          const colorSelects = ledSettingsEl.querySelectorAll('select[name^="led-color-"]');
          for (let i = 0; i < colorSelects.length; i++) {
            colorSelects[i].value = String(obj.colors?.[i] ?? '1');
          }
          const rgbInputs = ledSettingsEl.querySelectorAll('input[name^="led-rgb-"]');
          for (let i = 0; i < rgbInputs.length; i++) {
            rgbInputs[i].value = String(obj.rgb?.[i] ?? '0');
          }
          const brightness = ledSettingsEl.querySelector('#led-brightness');
          if (brightness) brightness.value = String(obj.brightness ?? '128');
          const backlight = ledSettingsEl.querySelector('#led-backlight');
          if (backlight) backlight.checked = Boolean(obj.backlight);
        }
      }
      syncKeyboardDomFromLayerData();
      showMessageInfo('インポートが完了しました');
    } catch (err) {
      showMessageError('インポートに失敗しました: ' + err);
    } finally {
      document.body.removeChild(input);
    }
  });
  input.click();
}

async function handleExportBtnClick() {
  // JSON形式でkeymapByLayerをエクスポート
  try {
    // osLang
    const osLangSelect = document.getElementById('osLangSelect');
    const osLang = osLangSelect?.value ?? '0';

    // [layer][key]順に変換
    const layerMajorArray = Array.from({ length: layerCount }, (_, layer) =>
      keymapByLayer.map(keyArr => keyArr[layer])
    );
    // customSettingsの内容を抽出
    const customSettingsObj = [];
    const customSettings = document.getElementById('customSettings');
    if (customSettings) {
      const rows = customSettings.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        const selects = row.querySelectorAll('select');
        const settingBtn = row.querySelector('button.function-btn');
        const keyValue = selects[0]?.value ?? '0';
        const stateValue = selects[1]?.value ?? '0';
        const layerValue = selects[2]?.value ?? '0';
        const funcValue = settingBtn?.getAttribute('data-func-value') ?? '0';
        customSettingsObj.push({
          key: keyValue,
          state: stateValue,
          layer: layerValue,
          func: funcValue
        });
      });
    }

    // magswSettingsの内容を抽出
    const magswSettingsObj = [];
    const magswSettings = document.getElementById('MagswSettings') || document.getElementById('magswSettings');
    if (magswSettings) {
      const rows = magswSettings.querySelectorAll('tbody tr');
      let rowValues = [];
      rows.forEach((row) => {
        const inputs = Array.from(row.querySelectorAll('input[type="number"]'));
        // 0〜3番目はそのまま
        const partialPressPoint = inputs[0]?.value ?? '0';
        const partialReleasePoint = inputs[1]?.value ?? '0';
        const PressPoint = inputs[2]?.value ?? '0';
        const ReleasePoint = inputs[3]?.value ?? '0';
        let tapJudgeTime = '0';
        if (inputs[4]) {
          tapJudgeTime = inputs[4].value;
        }
        const obj = {
          partialPressPoint,
          partialReleasePoint,
          PressPoint,
          ReleasePoint,
          tapJudgeTime
        };
        magswSettingsObj.push(obj);
        rowValues.push(obj);
      });
      // rowsが42未満の場合、最初のrowの値で埋める
      if (rows.length > 0 && magswSettingsObj.length < 42) {
        const fillObj = rowValues[0];
        for (let i = magswSettingsObj.length; i < 42; i++) {
          magswSettingsObj.push({ ...fillObj });
        }
      }
    }

    // touchpad設定の内容を抽出
    // even if conversion < 2, the touchpad elements may be extracted.
    const touchpadSettingsObj = [];
    const touchpadFeelLeft = document.querySelector('select[name="touchpad-leftfeel"]');
    const touchpadStrengthLeft = document.querySelector('select[name="touchpad-leftstrength"]');
    const touchpadFeelRight = document.querySelector('select[name="touchpad-rightfeel"]');
    const touchpadStrengthRight = document.querySelector('select[name="touchpad-rightstrength"]');
    touchpadSettingsObj.push({
      leftFeel: touchpadFeelLeft?.value ?? '0',
      leftStrength: touchpadStrengthLeft?.value ?? '0',
      rightFeel: touchpadFeelRight?.value ?? '0',
      rightStrength: touchpadStrengthRight?.value ?? '0'
    });

    // LED設定の内容を抽出
    const ledSettingsObj = [];
    const ledSettingsEl = document.getElementById('ledSettings');
    if (ledSettingsEl) {
      const colorSelects = ledSettingsEl.querySelectorAll('select[name^="led-color-"]');
      const ledColors = Array.from(colorSelects).map(select => select.value);
      const rgbInputs = ledSettingsEl.querySelectorAll('input[name^="led-rgb-"]');
      const ledRGB = Array.from(rgbInputs).map(input => input.value);
      const brightness = ledSettingsEl.querySelector('#led-brightness');
      const backlight = ledSettingsEl.querySelector('#led-backlight');
      ledSettingsObj.push({
        colors: ledColors,
        rgb: ledRGB,
        brightness: brightness?.value ?? '128',
        backlight: backlight?.checked ? 1 : 0
      });
    }

    const exportObj = {};
    exportObj.osLang = osLang;
    exportObj.keymap = layerMajorArray;
    exportObj.customSettings = customSettingsObj;
    exportObj.magswSettings = magswSettingsObj;
    exportObj.touchpadSettings = touchpadSettingsObj;
    exportObj.ledSettings = ledSettingsObj;
    // JSON.stringify でインデント2で整形
    let jsonStr = JSON.stringify(exportObj, null, 2);
    // 100文字以内で改行を入れる（LF）
    const lines = jsonStr.split('\n');
    const wrappedLines = [];
    for (const line of lines) {
      if (line.length <= 100) {
        wrappedLines.push(line);
      } else {
        let start = 0;
        while (start < line.length) {
          wrappedLines.push(line.slice(start, start + 100));
          start += 100;
        }
      }
    }
    const exportStr = wrappedLines.join('\n'); // LFのみ

    // Blobを使ってダウンロード
    const blob = new Blob([exportStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keymap.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    showMessageInfo('キーマップをエクスポートしました');
  } catch (e) {
    showMessageError('エクスポートに失敗しました: ' + e);
  }
}


function clearMessage() {
  const msgEl = document.getElementById('message');
  if (!msgEl) {
    return;
  }
  msgEl.textContent = '';
  msgEl.className = 'message-block';
}

function showMessageInfo(msg) {
  const msgEl = document.getElementById('message');
  if (!msgEl) {
    return;
  }
  msgEl.textContent = msg;
  msgEl.className = 'message-block info';
  msgEl.style.display = '';
}

function showMessageError(msg) {
  const msgEl = document.getElementById('message');
  if (!msgEl) {
    return;
  }
  msgEl.textContent = msg;
  msgEl.className = 'message-block error';
  msgEl.style.display = '';
}


// FunctionCode一覧（functions_code.h から手動で抽出・同期が必要）
const functionCodeList = [
  { name: 'NONE', value: 0x00 },
  { name: 'BS', value: 0x08 },
  { name: 'TAB', value: 0x09 },
  { name: 'ENT', value: 0x0a },
  { name: 'ESC', value: 0x1b },
  { name: 'SPC', value: 0x20 },
  { name: '!', value: 0x21 },
  { name: '"', value: 0x22 },
  { name: '#', value: 0x23 },
  { name: '$', value: 0x24 },
  { name: '%', value: 0x25 },
  { name: '&', value: 0x26 },
  { name: '\'', value: 0x27 },
  { name: '(', value: 0x28 },
  { name: ')', value: 0x29 },
  { name: '*', value: 0x2A },
  { name: '+', value: 0x2B },
  { name: ',', value: 0x2C },
  { name: '-', value: 0x2D },
  { name: '.', value: 0x2E },
  { name: '/', value: 0x2F },
  { name: '0', value: 0x30 },
  { name: '1', value: 0x31 },
  { name: '2', value: 0x32 },
  { name: '3', value: 0x33 },
  { name: '4', value: 0x34 },
  { name: '5', value: 0x35 },
  { name: '6', value: 0x36 },
  { name: '7', value: 0x37 },
  { name: '8', value: 0x38 },
  { name: '9', value: 0x39 },
  { name: ':', value: 0x3A },
  { name: ';', value: 0x3B },
  { name: '<', value: 0x3C },
  { name: '=', value: 0x3D },
  { name: '>', value: 0x3E },
  { name: '?', value: 0x3F },
  { name: '@', value: 0x40 },
  { name: 'A', value: 0x41 },
  { name: 'B', value: 0x42 },
  { name: 'C', value: 0x43 },
  { name: 'D', value: 0x44 },
  { name: 'E', value: 0x45 },
  { name: 'F', value: 0x46 },
  { name: 'G', value: 0x47 },
  { name: 'H', value: 0x48 },
  { name: 'I', value: 0x49 },
  { name: 'J', value: 0x4A },
  { name: 'K', value: 0x4B },
  { name: 'L', value: 0x4C },
  { name: 'M', value: 0x4D },
  { name: 'N', value: 0x4E },
  { name: 'O', value: 0x4F },
  { name: 'P', value: 0x50 },
  { name: 'Q', value: 0x51 },
  { name: 'R', value: 0x52 },
  { name: 'S', value: 0x53 },
  { name: 'T', value: 0x54 },
  { name: 'U', value: 0x55 },
  { name: 'V', value: 0x56 },
  { name: 'W', value: 0x57 },
  { name: 'X', value: 0x58 },
  { name: 'Y', value: 0x59 },
  { name: 'Z', value: 0x5A },
  { name: '[', value: 0x5B },
  { name: '\\', value: 0x5C },
  { name: ']', value: 0x5D },
  { name: '^', value: 0x5E },
  { name: '_', value: 0x5F },
  { name: '`', value: 0x60 },
  { name: 'a', value: 0x61 },
  { name: 'b', value: 0x62 },
  { name: 'c', value: 0x63 },
  { name: 'd', value: 0x64 },
  { name: 'e', value: 0x65 },
  { name: 'f', value: 0x66 },
  { name: 'g', value: 0x67 },
  { name: 'h', value: 0x68 },
  { name: 'i', value: 0x69 },
  { name: 'j', value: 0x6A },
  { name: 'k', value: 0x6B },
  { name: 'l', value: 0x6C },
  { name: 'm', value: 0x6D },
  { name: 'n', value: 0x6E },
  { name: 'o', value: 0x6F },
  { name: 'p', value: 0x70 },
  { name: 'q', value: 0x71 },
  { name: 'r', value: 0x72 },
  { name: 's', value: 0x73 },
  { name: 't', value: 0x74 },
  { name: 'u', value: 0x75 },
  { name: 'v', value: 0x76 },
  { name: 'w', value: 0x77 },
  { name: 'x', value: 0x78 },
  { name: 'y', value: 0x79 },
  { name: 'z', value: 0x7A },
  { name: '{', value: 0x7B },
  { name: '|', value: 0x7C },
  { name: '}', value: 0x7D },
  { name: '~', value: 0x7E },
  { name: 'CapsL', value: 0x80 },
  { name: 'F1', value: 0x81 },
  { name: 'F2', value: 0x82 },
  { name: 'F3', value: 0x83 },
  { name: 'F4', value: 0x84 },
  { name: 'F5', value: 0x85 },
  { name: 'F6', value: 0x86 },
  { name: 'F7', value: 0x87 },
  { name: 'F8', value: 0x88 },
  { name: 'F9', value: 0x89 },
  { name: 'F10', value: 0x8A },
  { name: 'F11', value: 0x8B },
  { name: 'F12', value: 0x8C },
  { name: 'PrtSc', value: 0x8D },
  { name: 'ScrL', value: 0x8E },
  { name: 'Pau', value: 0x8F },
  { name: 'Ins', value: 0x90 },
  { name: 'Home', value: 0x91 },
  { name: 'PG_UP', value: 0x92 },
  { name: 'Del', value: 0x93 },
  { name: 'End', value: 0x94 },
  { name: 'PG_DN', value: 0x95 },
  { name: 'Arw_R', value: 0x96 },
  { name: 'Arw_L', value: 0x97 },
  { name: 'Arw_D', value: 0x98 },
  { name: 'Arw_U', value: 0x99 },
  { name: 'NumL', value: 0x9A },
  { name: 'HNZN', value: 0x9B },
  { name: 'HRKN', value: 0x9C },
  { name: 'YEN', value: 0x9D },
  { name: 'CONV', value: 0x9E },
  { name: 'NCNV', value: 0x9F },
  { name: 'JIGLR', value: 0xB2 },
  { name: 'LEDAT', value: 0xBD },
  { name: 'LED_D', value: 0xBE },
  { name: 'LED_U', value: 0xBF },
  { name: 'BackL', value: 0xC0 },
  { name: 'EN/JP', value: 0xC5 },
  { name: 'ProfD', value: 0xC6 },
  { name: 'Prof0', value: 0xC7 },
  { name: 'Prof1', value: 0xC8 },
  { name: 'Prof2', value: 0xC9 },
  { name: 'Prof3', value: 0xCA },
  { name: 'MouL', value: 0xD0 },
  { name: 'MouR', value: 0xD1 },
  { name: 'MouM', value: 0xD2 },
  { name: 'MouBW', value: 0xD3 },
  { name: 'MouFW', value: 0xD4 },
  { name: 'TP_SC', value: 0xD7 },
  { name: 'TP_M', value: 0xD8 },
  { name: 'TP_EN', value: 0xD9 },
  { name: 'TP_L', value: 0xDA },
  { name: 'TP_L2', value: 0xDB },
  { name: 'TP_R', value: 0xDC },
  { name: 'TP_R2', value: 0xDD },
  { name: 'TP_BL', value: 0xDE },
  { name: 'TP_BR', value: 0xDF },
  { name: 'CtrlL', value: 0xE0 },
  { name: 'ShifL', value: 0xE1 },
  { name: 'AltL', value: 0xE2 },
  { name: 'GuiL', value: 0xE3 },
  { name: 'CtrlR', value: 0xE4 },
  { name: 'ShifR', value: 0xE5 },
  { name: 'AltR', value: 0xE6 },
  { name: 'GuiR', value: 0xE7 },
  { name: 'MCR00', value: 0xE8 },
  { name: 'MCR01', value: 0xE9 },
  { name: 'MCR02', value: 0xEA },
  { name: 'MCR03', value: 0xEB },
  { name: 'MCR04', value: 0xEC },
  { name: 'MCR05', value: 0xED },
  { name: 'MCR06', value: 0xEE },
  { name: 'CPLT', value: 0xEF },
  { name: 'L1', value: 0xF2 },
  { name: 'L2', value: 0xF3 },
  { name: 'L3', value: 0xF4 },
  { name: 'LHold', value: 0xF5 },
];

// 機能一覧ボタン描画
function renderFunctionList() {
  const functionList = document.getElementById('functionList');
  if (!functionList) return;
  let html = '';
  let idx = 0;
  for (let row = 0; row < 15; row++) {
    html += '<div style="display:flex; justify-content:center; width:100%">';
    for (let col = 0; col < 12; col++) {
      if (idx < functionCodeList.length) {
        const fn = functionCodeList[idx];
        html += `<button type="button" class="function-btn" data-func-value="${fn.value}" title="${fn.name}" draggable="true">${fn.name}</button>`;
        idx++;
      } else {
        html += `<button type="button" class="function-btn" disabled style="opacity:0.3;"></button>`;
      }
    }
    html += '</div>';
  }
  functionList.innerHTML = html;

  // ドラッグイベント設定
  const funcBtns = functionList.querySelectorAll('.function-btn[draggable="true"]');
  funcBtns.forEach(btn => {
    btn.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('func-value', btn.getAttribute('data-func-value'));
      e.dataTransfer.setData('func-name', btn.textContent);
    });
  });
}

// ボタンイベントリスナー設定
document.getElementById('loadBtn').addEventListener('click', handleLoadBtnClick);
document.getElementById('applyBtn').addEventListener('click', handleApplyBtnClick);
document.getElementById('saveBtn').addEventListener('click', handleSaveBtnClick);
document.getElementById('importBtn').addEventListener('click', handleImportBtnClick);
document.getElementById('exportBtn')?.addEventListener('click', handleExportBtnClick);

// DOMContentLoaded後に描画
window.addEventListener('DOMContentLoaded', () => {
  renderKeyboard();
  renderCustomSettings();
  renderMagswSettings();
  renderTouchpadSettings();
  renderLedSettings();
  renderFunctionList();

  const layerSelect = document.getElementById('layerSelect');
  if (layerSelect) {
    layerSelect.addEventListener('change', () => {
      syncKeyboardDomFromLayerData();
    });
  }
});
