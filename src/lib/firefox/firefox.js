'use strict';

// Load Firefox based resources
var self = require('sdk/self'),
    tabs = require('sdk/tabs'),
    timers = require('sdk/timers'),
    unload = require('sdk/system/unload'),
    buttons = require('sdk/ui/button/action'),
    xhr = require('sdk/net/xhr'),
    {Ci, Cc, Cu} = require('chrome');

var {WebRequest} = Cu.import('resource://gre/modules/WebRequest.jsm');
var {MatchPattern} = Cu.import('resource://gre/modules/MatchPattern.jsm');

var onClick = function () {};

var button = buttons.ActionButton({
  id: self.name,
  label: 'OpenWeatherMap',
  icon: {
    '16': './icons/16.png',
    '32': './icons/32.png',
    '64': './icons/64.png'
  },
  onClick: () => onClick()
});

exports.browserAction = {
  onClicked: {
    addListener: (c) => onClick = c
  },
  setBadgeText: (v) => button.badge = v.text,
  setTitle: (v) => button.label = v.title
};

exports.tabs = {
  create: (obj) => tabs.open(obj)
};

exports.timers = timers;
exports.XMLHttpRequest = xhr.XMLHttpRequest;

exports.DOMParser = function () {
  return Cc['@mozilla.org/xmlextras/domparser;1']
    .createInstance(Ci.nsIDOMParser);
};

exports.webRequest = {
  onCompleted: {
    addListener: function (callback) {
      let pattern = new MatchPattern('http://openweathermap.org/*');

      WebRequest.onCompleted.addListener(callback, {urls: pattern}, []);
      unload.when(() => WebRequest.onCompleted.removeListener(callback));
    }
  }
};

//startup
exports.startup = function (callback) {
  if (self.loadReason === 'install' || self.loadReason === 'startup') {
    callback();
  }
};
