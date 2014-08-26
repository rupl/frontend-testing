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
  url: 'http://fourword.fourkitchens.com/article/simulate-user-actions-casperjs',
};

// We are filling out a form later.
// We'll store the form contents in `config` too.
config.form = {
  "name": "Chris Ruppel",
  "email": "chris@fourkitchens.com",
  "project-title": "CasperJS Test Project",
  "project-desc": "CasperJS Test Project Description"
};

// Define the suite of tests and give it the following properties:
// - Title, which shows up before any of the pass/fails.
// - Number of tests, must be changed as you add tests.
// - suite(), which contains all of your tests.
//
// @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#begin
casper.test.begin('Testing navigation and forms', 4, function suite(test) {
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
  casper.then(function () {
    // test.assertUrlMatch() allows us to run a regular expression against the
    // current URL that Casper has loaded. Since we have moved from a subdomain
    // to our main domain, it's a simple regex.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#asserturlmatch
    test.assertUrlMatch(/\/\/fourkitchens\.com/, 'New location is ' + this.getCurrentUrl());

    // Report that we're attempting to use keyboard nav.
    test.comment('⌚️  Using keyboard nav to visit contact form...');

    // casper.sendKeys() allows us to simulate pressing one or more keys on the
    // keyboard. You can use this to trigger a JS event listener, enter text
    // into an <input> or element with `contenteditable` attribute, or use it
    // to test keyboard navigation.
    //
    // Our use-case is triggering the `accesskey` property on one of the menu
    // items, selecting the <body> works just fine. If you want to test a
    // specific <input> or editable element, the function can accept a more
    // specific selector.
    //
    // In this case we're pressing a combo: Ctrl+Alt+C, which is the way to use
    // keyboard navigation in PhantomJS. We do this passing the options object
    // to sendKeys() and specifying a `modifiers` value. You can find all the
    // possible modifier keys in the second docs link.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#sendkeys
    // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#options
    this.sendKeys('body', 'c', {modifiers: 'ctrl+alt'});
  });

  casper.then(function () {
    // Check the URL again to confirm navigation. Look earlier in this file for
    // explanation and docs link for test.assertUrlMatch().
    test.assertUrlMatch(/contact/, 'New location is ' + this.getCurrentUrl());

    // casper.fill() allows us to quickly fill out a form with a minimal amount
    // of code. If you can write a JSON object, you already know how to fill
    // forms in Casper.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#fill
    casper.fill('#contact', config.form, false);
  });

  casper.then(function () {
    // Look for the information we just populated within the form.
    //
    // assertEvalEquals provides an easy way for us to test JavaScript within
    // the test environment. Any code within the assertEvalEquals() code block
    // is considered to be part of the web page, as if we are typing into the
    // browser's JS console of the fully-loaded page.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#assertevalequals
    test.assertEvalEquals(function () {
      return $('#contact input[name="name"]').val();
    }, config.form.name, 'The name was filled out properly.');

    // Check the email using test.assertEvalEquals() too.
    test.assertEvalEquals(function () {
      return $('#contact input[name="email"]').val();
    }, config.form.email, 'The email was filled out properly.');
  });

  // This code runs all the tests that we defined above.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#done
  casper.run(function () {
    test.done();
  });
});
