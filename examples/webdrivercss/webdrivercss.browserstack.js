'use strict';

// NPM packages
var c = require('chalk');
var webdriverio = require('webdriverio');
var webdrivercss = require('webdrivercss');

// All options go here, to allow easier boilerplating.
var options = {
  browser: {
    'browserstack.debug': 'true',
    'browserstack.local': 'true',
    os: 'Windows',
    os_version: '7',
    browser: 'ie',
    browser_version: '9.0'
  },
  test: {
    title: 'Jumbotron_win7-ie9',
    name: 'jumbotron',
    url: 'http://localhost:3000/audit', // this needs to be a real URL
    selector: '.jumbotron',
  },
  webdrivercss: {
    screenshotRoot: 'visual/reference',
    failedComparisonsRoot: 'visual/failed',
    misMatchTolerance: 0.05,
    screenWidth: [1024]
  }
};

// Script assumes your BrowserStack creds are listed in JSON somewhere in your
// system. Convenient if you want to avoid storing keys in VCS. If storing in
// VCS is ok, just assign an object literal to config:
//
// {
//   "browserstack": {
//     "user": "MY_USER",
//     "key": "MY_KEY"
//   }
// }
var config = require('./browserstack.json');

// Configure webdriverio
var client = webdriverio.remote({
  desiredCapabilities: options.browser,
  host: 'hub.browserstack.com',
  port: 80,
  user: config.browserstack.user,
  key: config.browserstack.key
}).init();

// Initialize webdrivercss
webdrivercss.init(client, options.webdrivercss);

// Run the test
client
  .url(options.test.url)
  .webdrivercss(options.test.title, {
    name: options.test.name,
    elem: options.test.selector
  }, function(err, res) {
    if (err === undefined) {
      if (res[options.test.name][0].isWithinMisMatchTolerance === true) {
        console.log(c.green('Hooray! No regressions.'));
      }
      else {
        console.log(c.red('Boo! We found a regression.'));
        console.log(res[options.test.name][0].message);
        console.log(res[options.test.name][0].regression);
      }
    }
    else {
      console.log(err);
    }
  })
  .end();
