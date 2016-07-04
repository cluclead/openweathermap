'use strict';

var app = {};

app.webRequest = chrome.webRequest;
app.storage = chrome.storage;
app.tabs = chrome.tabs;
app.timers = window;
app.XMLHttpRequest = window.XMLHttpRequest;
app.DOMParser = window.DOMParser;
app.browserAction = chrome.browserAction;

app.startup = (function () {
  let loadReason, callback = function () {};
  function check () {
    if (loadReason === 'startup' || loadReason === 'install') {
      callback();
    }
  }
  chrome.runtime.onInstalled.addListener(function (details) {
    loadReason = details.reason;
    check();
  });
  chrome.runtime.onStartup.addListener(function () {
    loadReason = 'startup';
    check();
  });
  return (c) => {
    callback = c;
    check();
  };
})();
