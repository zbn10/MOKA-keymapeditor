let webhid_data = {
  selectedKey: null,
  selectedKeylist: null,

  FRAGMENT_PAYLOAD_SIZE: 60,

  CMD_NONE: 0,
  CMD_RESPONSE: 1,
  CMD_FETCH: 11,
  CMD_APPLY: 21,
  CMD_SAVE: 31,

  RESPONSE_ACK: 0,
  RESPONSE_NACK: 1,
  RESPONSE_CHG: 2,
  RESPONSE_INVALID_CMD: 3,
  RESPONSE_INVALID_PRIMARY: 4,
  RESPONSE_INVALID_PROFILE: 5,
  RESPONSE_INVALID_OSLAYOUT: 6,
  RESPONSE_INVALID_KEYMAP: 7,
  RESPONSE_INVALID_INDKEY: 8,
  RESPONSE_INVALID_MAGATTR: 9,
  RESPONSE_INVALID_KEYLED: 10,
  RESPONSE_INVALID_LED: 11,
  RESPONSE_INVALID_SAVE: 12,
  RESPONSE_ERROR: 127,

  ResponseCode: {
    0: 'ACK',
    1: 'NACK',
    2: 'CHG',
    3: 'Invalid Command',
    4: 'Invalid Primary Profile',
    5: 'Invalid Profile',
    6: 'Invalid OS Layout',
    7: 'Invalid Keymap Data',
    8: 'Invalid Individual Key',
    9: 'Invalid Magsw Attributes',
    10: 'Invalid Key LED Setting',
    11: 'Invalid LED Setting',
    12: 'Save Failed',
    127: 'Error'
  },

  PROFILE_PRIMARY: 124,
  PROFILE_DEFAULT: 125,
  PROFILE_ACTIVE: 126,

  ProfileName: {
    124: 'Primary',
    125: 'Default',
    126: 'Active',
  },

  LAYOUT_US: 0,
  LAYOUT_JP: 1,

  NUM_UNITS: 10,

  REPORTID: 3,

  layername: [
    'Layer 0',
    'Layer 1',
    'Layer 2',
    'Layer 3'
  ],
  oslayoutname: [
    'US',
    'JP'
  ],
  oslayoutcode: {
    'US': 0,
    'JP': 1
  },

  have_keylist: false,
};

(function() {
  'use strict';

})();
