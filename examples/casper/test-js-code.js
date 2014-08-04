/**
 * @file
 *   Using CasperJS to run basic unit tests on various libraries.
 */

// Define the suite of tests and give it the following properties:
// - Title, which shows up before any of the pass/fails.
// - Number of tests, must be changed as you add tests.
// - suite(), which contains all of your tests.
//
// @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#begin
casper.test.begin('Basic unit tests for jQuery and Modernizr', 3, function suite(test) {
  // You can output comments at any point in your script. Sometimes it's good
  // to add a message when you're attempting an operation that might take a
  // few moments to respond, such as this page load.
  test.comment('⌚️  Opening http://fourword.fourkitchens.com...');

  // casper.start() always wraps your first action. The first argument should
  // be the URL of the page you want to test. Instead of being hard-coded, ours
  // comes from the config object we defined above.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#start
  casper.start('http://fourword.fourkitchens.com', function () {

    // Look at a specific property on the jQuery object to check its version.
    //
    // assertEvalEquals provides an easy way for us to test JavaScript variables
    // within the test environment. Any code within the assertEvalEquals() code
    // block is considered to be part of the webpage, as if we are typing into
    // the JS console of the fully-loaded page.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#assertevalequals
    test.assertEvalEquals(function () {
      return jQuery.fn.jquery;
    }, '1.7.1', 'jQuery 1.7.1 was found.');

    // Look at a specific property on the Modernizr object to check its version.
    test.assertEvalEquals(function () {
      return Modernizr._version;
    }, '2.6.2', 'Modernizr 2.6.2 was found.');

    // Check for required Modernizr tests. This is NOT testing the output! We
    // are only testing whether Modernizr is working, not what its output is.
    test.assertEvalEquals(function () {
      // An array of strings. Each one represents a required test that must be
      // found within Modernizr. That value might be true or false, but as long
      // as it is boolean we ultimately do not care.
      var requiredTests = [
        'inlinesvg',
        'svg'
      ];

      // confirmedTests will end up as a single boolean. First, we map the
      // requiredTests array and see if the global Modernizr object contains a
      // boolean for each value we entered into requiredTests.
      //
      // Note: we're not testing the value of the Modernizr test result, but
      // verifying that the test was present. Each browser will have a different
      // result, so it's not very useful to verify Modernizr's output in a test
      // environment.
      var confirmedTests = requiredTests.map(function(thisTest) {
        // This should return the type of data (boolean), not the boolean value.
        return typeof Modernizr[thisTest];
      }).every(function(thisValue) {
        // Each data type will be verified to be boolean, and the result of the
        // .every() function will only be true if all the values resolved to true.
        // If even one of the values is not boolean, .every() returns false.
        return thisValue === 'boolean';
      });

      // Return the result of our computation to Casper. The return value of
      // confirmedTests is ultimately what decides whether this test is reported
      // as PASS or FAIL. All of the other computation beforehand was internal.
      return confirmedTests;
    }, true, 'Required Modernizr tests are all present. (inlinesvg, svg)');
  });

  // This code runs all the tests that we defined above.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#done
  casper.run(function () {
    test.done();
  });
});
