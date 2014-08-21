/**
 * @file
 *   Simulating user actions with CasperJS. This script explores the ability to
 *   use Casper for navigation just like a user would: clicking the page and
 *   entering text to submit a form. This script accompanies a blog post from
 *   Four Kitchens:
 *
 * @see http://fourword.fourkitchens.com/article/simulate-user-actions-casperjs
 */

// This will hold all of the content that Casper needs to supply.
var config = {
  url: 'http://fourword.fourkitchens.com/article/simulate-user-actions-casperjs'
};

// Define the suite of tests and give it the following properties:
// - Title, which shows up before any of the pass/fails.
// - Number of tests, must be changed as you add tests.
// - suite(), which contains all of your tests.
//
// @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#begin
casper.test.begin('Testing navigation and forms', 1, function suite(test) {
  test.comment('⌚️  Loading ' + config.url + '...');

  // casper.start() always wraps your first action. The first argument should
  // be the URL of the page you want to test. Instead of being hard-coded, ours
  // comes from the config object we defined above.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#start
  casper.start(config.url, function() {

    // casper.click() fires a click event on a particular element. In this case
    // we're clicking on the main logo of the site.
    //
    // The only argument needed is a selector. Be careful to be specific when
    // initiating an action like this. For instance, a selector such as plain
    // "a" would not be specific enough.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#click
    this.click('header p a:first-child');

    // Log the click to the console so we know why it's pausing momentarily.
    test.comment('⌚️  Clicking the Fourkitchens.com link...');
  });

  // casper.then() allows us to wait until previous tests and actions are
  // completed before moving on to the next steps. This is useful for many
  // situations and authenticated sessions are a prime candidate, since we
  // cannot perform any further actions if we failed to authenticate.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#then
  casper.then(function() {
    // test.assertUrlMatch() allows us to run a regular expression against the
    // current URL that Casper has loaded. Since we have moved from a subdomain
    // to our main domain, it's a simple regex.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#asserturlmatch
    test.assertUrlMatch(/\/\/fourkitchens\.com/, 'Navigation successful. New location is ' + this.getCurrentUrl());
  });

  // This code runs all the tests that we defined above.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#done
  casper.run(function () {
    test.done();
  });
});
