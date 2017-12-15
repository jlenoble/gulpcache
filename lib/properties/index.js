'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('./config');

Object.defineProperty(exports, 'setConfigProperties', {
  enumerable: true,
  get: function get() {
    return _config.setConfigProperties;
  }
});

var _main = require('./main');

Object.defineProperty(exports, 'getName', {
  enumerable: true,
  get: function get() {
    return _main.getName;
  }
});
Object.defineProperty(exports, 'setMainProperties', {
  enumerable: true,
  get: function get() {
    return _main.setMainProperties;
  }
});

var _streamer = require('./streamer');

Object.defineProperty(exports, 'setStreamerProperties', {
  enumerable: true,
  get: function get() {
    return _streamer.setStreamerProperties;
  }
});

var _functions = require('./functions');

Object.defineProperty(exports, 'setFunctionProperties', {
  enumerable: true,
  get: function get() {
    return _functions.setFunctionProperties;
  }
});