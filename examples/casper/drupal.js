/**
 * @file
 *   Testing a demo of Drupal. The script will log in and check for various
 *   features in Drupal core. This demo was inspired by a similar script for
 *   a Wordpress site. The original script was written by Henrique Vicente.
 *
 * @see https://github.com/henvic/phantom-casper-simple-talk/blob/master/wordpress.js
 */

// Set up variables to visit a URL and log in.
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

  // casper.start() always wraps your first action. The first argument should
  // be the URL of the page you want to test. Instead of being hard-coded, ours
  // comes from the config object we defined above.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#start
  casper.start(config.host, function() {

    // casper.fill() allows you to populate and submit forms.
    //
    // The first argument is any selector that can uniquely identify your form.
    //
    // The second argument is an object containing the data you want to submit
    // using this form. Our config.form variable was defined at the beginning of
    // this file. Each property name of the object you supply should be identical
    // to the `name` attr on the form you're filling out.
    //
    // The third argument is a boolean that tells Casper whether the form should
    // be submitted automatically. There are other ways of submitting forms,
    // such as finding the submit button and running the click() operation on it.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#fill
    casper.fill('form#user-login-form', config.form, true);

    // You can output comments at any point in your script. Sometimes it's good
    // to add a message when you're attempting an operation that might take a
    // few moments to respond, such as this login attempt.
    test.comment('Logging in...');
  });

  // casper.then() allows us to wait until previous tests and actions are
  // completed before moving on to the next steps. This is useful for many
  // situations and authenticated sessions are a prime candidate, since we
  // cannot perform any further actions if we failed to authenticate.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#then
  casper.then(function() {

    // test.assertHttpStatus() determines which HTTP response code was sent from
    // the server. All of the tests in this file are checking for 200, which is
    // a normal, successful response. But there's nothing stopping someone from
    // intentionally checking for 403, 404, or even 500 errors from the server.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#asserthttpstatus
    test.assertHttpStatus(200, "Authentication successful");

    // Now that we're logged in, check for the `logged-in` class that is appended
    // to the <body> tag for all authenticated Drupal traffic.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#assertexists
    test.assertExists('body.logged-in', 'Drupal class for logged-in users was found.');

    // We want to browse the content list that is available to Drupal admins,
    // so we are clicking the Content link in the admin toolbar. The next series
    // of steps assumes that Overlay module is enabled, which is the default for
    // the Standard installation profile in Drupal 7.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#click
    this.click('a[href="/drupal/admin/content"]');

    // Log the click to the console so we know why it's pausing momentarily.
    test.comment('Clicking the Content admin link...');
  });

  // Now that we've authenticated and loaded the content page, it's time to look
  // for some content.
  casper.then(function() {

    // First we see if the Overlay updated the page title correctly. The first
    // argument is a regex that is run against <title> tag. The second argument
    // is optional and can be used to provide a more descriptive test result.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#asserttitlematch
    test.assertTitleMatch(/Content | Drupal Demo Install/, 'Overlay changed page title to contain the word "Content"');

    // We also check that the URL is updated as expected. For science. Arguments
    // are the same as test.assertTitleMatch()
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#asserturlmatch
    test.assertUrlMatch(/drupal\/node#overlay=admin\/content/, 'Overlay updated the URL to drupal/node#overlay=admin/content');

    // Instead of clicking another link, we want to load the node/add/page page
    // without our dear friend, the Overlay. casper.open() simply loads a new
    // URL. We put this at the end of the code block and use casper.then() to
    // ensure that the next tests are run after the page is finished opening.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#open
    this.open(config.host + '/node/add/page');

    // Log this action to the console as an informational courtesy to the user.
    test.comment('Adding Basic page...');
  });

  // With our fresh node/add page, we want to populate and submit another form.
  casper.then(function() {

    // Check that the page loaded properly.
    test.assertHttpStatus(200, 'Opened the node/add/page page.');

    // Look for the node form that we want to populate.
    test.assertExists('form#page-node-form', 'Found the node/add/page form.');

    // Populate the form with the content we prepared at the beginning of this
    // file. As the notes above explain, we do not want to repeat the values we
    // submit here in the next test, because if we update these values later and
    // forget to change both simultaneously, then it will appear that the site
    // broke when it is actually our test that is broken.
    casper.fill('form#page-node-form', nodeContents, true);

    // Once again, report that we're saving the node to keep the user informed.
    test.comment('Saving new node...');
  });

  // Drupal automatically redirects to the published node on success. With the
  // form submitted, we check to see what the published content looks like.
  casper.then(function() {

    // Check the page title of the published node. Since we don't want to hard-
    // code any of the test values, we use the `new RegExp` syntax which allows
    // the regex to contain variables.
    test.assertTitleMatch(new RegExp(nodeContents.title), 'Our custom title was found on the published page.');

    // Now we do some very light screen scraping to find the text that we added
    // to the body field of this node. Since Drupal 7 has jQuery 1.4.4 out of
    // the box, it is safe to rely on it to extract our text.
    //
    // test.assertEvalEquals() allows us to execute arbitrary code and compare
    // the results with a pre-defined value. The first argument is a function
    // containing our code that will be evaluated in the context of the testing
    // environment. The second argument (which is sourced from our variable at
    // the beginning of the file) is the expected result. The third argument is
    // optional and allows us to provide a more descriptive test result.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#assertevalequals
    test.assertEvalEquals(function () {
      return jQuery('.node-page .content p').text();
    }, nodeContents['body[und][0][value]'], 'Our custom text was found on the published page.');
  });

  // This code runs all the tests that we defined above.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#done
  casper.run(function () {
    test.done();
  });
});
