"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getter = exports.getter = function getter(name) {
  return function (args) {
    var value = void 0;

    args.some(function (arg) {
      if (arg[name]) {
        value = arg[name];
        return true;
      }

      return false;
    });

    return value;
  };
};

var returnsBool = exports.returnsBool = function returnsBool(fn) {
  return function (args) {
    return !!fn(args);
  };
};