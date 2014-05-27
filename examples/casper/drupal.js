/**
 * @file
 *   Testing a demo of Drupal. The script will log in and check for various
 *   features in Drupal core. This demo was inspired by a similar script for
 *   a Wordpress site. The original script was written by Henrique Vicente.
 *
 * @see https://github.com/henvic/phantom-casper-simple-talk/blob/master/wordpress.js
 */

// First, we do dome setup. We need to collect arguments that may have been set
// by the user via command-line, and we need to define all the fallbacks since
// this is a demo script.
var config = {
  'host': 'http://demo.opensourcecms.com/drupal',
  'form': {
    'name': 'admin',
    'pass': 'demo123'
  }
};

// In one of the tests we want to set some content up, then test it in the
// following block of code. Setting this content up as a global variable helps
// keep the testing code DRY and reliable.
var nodeContents = {
  'title': 'Hello, World!',
  'body[und][0][value]': 'This content was added by CasperJS!'
};

// Define the suite of tests and give it the following properties:
// - Title, which shows up before any of the pass/fails.
// - Number of tests, must be changed as you add tests.
// - suite(), which contains all of your tests.
//
// @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#begin
casper.test.begin('Testing Drupal demo site', 8, function suite(test) {
  casper.start(config.host, function() {
    casper.fill('form#user-login-form', config.form, true);
    console.log('Logging in...');
  });

  // casper.then() allows us to wait until previous tests and actions are
  // completed before moving on to the next steps. This is useful for many
  // situations and authenticated sessions are a prime candidate, since we
  // cannot perform any further actions if we failed to authenticate.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#then
  casper.then(function() {
    test.assertHttpStatus(200, "Authentication successful");
    test.assertExists('body.logged-in', 'Drupal class for logged-in users was found.');
    this.click('a[href="/drupal/admin/content"]');
    console.log('Clicking the Content admin link...');
  });

  // Now that we've authenticated and loaded the content page, it's time to look
  // for some content.
  casper.then(function() {
    test.assertTitleMatch(/Content | Drupal Demo Install/, 'Overlay changed page title to contain the word "Content"');
    test.assertUrlMatch(/drupal\/node#overlay=admin\/content/, 'Overlay updated the URL to drupal/node#overlay=admin/content');
    this.open('http://demo.opensourcecms.com/drupal/node/add/page');
    console.log('Adding Basic page...');
  });

  casper.then(function() {
    test.assertHttpStatus(200, 'Opened the node/add/page page.');
    test.assertExists('form#page-node-form', 'Found the node form.');
    casper.fill('form#page-node-form', nodeContents, true);
    console.log('Saving new node...');
  });

  casper.then(function() {
    test.assertTitleMatch(/Hello, World!/, 'Our custom title was found on the published page.');
    test.assertEvalEquals(function () {
      return jQuery('.node-page .content p').text();
    }, nodeContents['body[und][0][value]'], 'Our custom text was found on the published page.');
  });

  // This code runs all the tests that we defined above.
  casper.run(function () {
    test.done();
  });
});
