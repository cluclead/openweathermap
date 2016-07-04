'use strict';

var app = app || require('./firefox/firefox');

function check () {
  let req = new app.XMLHttpRequest();
  req.onload = function () {
    let parser = new app.DOMParser();
    let doc = parser.parseFromString(req.responseText, 'text/html');
    let widget = doc.querySelector('.weather-widget');
    let title = 'OpenWeatherMap';
    if (widget) {
      let location = widget.querySelector('h3').textContent.trim();
      let temperature = widget.querySelector('h2').textContent.trim();
      let text = Math.round(parseFloat(temperature));
      if (text) {
        app.browserAction.setBadgeText({text: text + ''});
      }
      if (location && temperature) {
        title += '\n\n' + location + ': ' + temperature + '\n\n';
      }

      Array.from(widget.querySelectorAll('tr')).forEach(function (tr) {
        let [name, value] = Array.from(tr.querySelectorAll('td'));
        [name, value] = [name.textContent.trim(), value.textContent.trim()];
        if (name && value) {
          title += name + ': ' + value + '\n';
        }
      });
    }
    app.browserAction.setTitle({title});
  };
  req.open('GET', 'http://openweathermap.org/', true);
  req.send();
  app.timers.clearTimeout(check.timer);
  check.timer = app.timers.setTimeout(check, 5 * 60 * 1000);
}
// check
// 1.
check();
// 2.
(function (urls, timer) {
  app.webRequest.onCompleted.addListener(function (details) {
    if (details.type === 'main_frame') {
      app.timers.clearTimeout(timer);
      timer = app.timers.setTimeout(check, 5000);
    }
  }, {urls}, []);
})(['<all_urls>'], null);

app.browserAction.onClicked.addListener(
  () => app.tabs.create({url: 'http://openweathermap.org/'})
);
