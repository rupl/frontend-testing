/**
 * @file
 *   Testing to see if Picturefill selects the right source at multiple
 *   viewport sizes.
 */

// Define the suite of tests and give it the following properties:
// - Title, which shows up before any of the pass/fails.
// - Number of tests, must be changed as you add tests.
// - suite(), which contains all of your tests.
//
// @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#begin
casper.test.begin('Testing Picturefill', 5, function suite(test) {

  // casper.start() always wraps your first action. The first argument should
  // be the URL of the page you want to test.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#start
  casper.start('http://scottjehl.github.io/picturefill/examples/demo-02.html', function () {

    // First, we look for a <picture> element. The first argument is a query
    // selector, like jQuery or document.querySelectorAll(). Any <picture> tags
    // on the page are found by using the 'picture' selector.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#assertexists
    test.assertExists('picture', '<picture> element found.');

    // Now verify that the <picture> tag has three <source> tags. This is
    // another query selector. In a more complex test you will need to write
    // a more specific selector. This will find all <source> tags within all
    // <picture> tags in your document. This demo only has one <picture> tag
    // so the simple selector works fine.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#assertelementcount
    test.assertElementCount('picture > source', 3);

    // Before running any viewport-specific tests, set the viewport to 320x480.
    // PhantomJS has a default viewport of 400x300 and CasperJS does not alter
    // this default, so it's always a good idea to explicitly set the viewport
    // to your desired dimensions.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#viewport
    this.viewport(320, 480);
  });

  // casper.then() allows us to wait until previous tests and actions are
  // completed before moving on to the next steps. This is useful for many
  // situations and viewport resizing is one of them, since scripts like
  // Picturefill have to respond to the resize.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/casper.html#then
  casper.then(function() {

    // With the viewport resized, look for the src of the <img> and make sure it
    // is set to the value we expect. In this example we are testing the smaller
    // viewport first, so medium.jpg should be found since the Picturefill markup
    // declares it as default.
    //
    // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#assertevalequals
    test.assertEvalEquals(function () {
        return document.querySelectorAll('picture img')[0].getAttribute('src').match('medium.jpg').toString();
    }, 'medium.jpg', 'medium.jpg found using 320x480 viewport.');
  });

  // Resize the viewport again
  casper.then(function() {
    this.viewport(960, 640);
  });

  // With the viewport resized to 960px, check and see if the large.jpg is
  // now contained within the <img> src, since the demo markup specifies an
  // 800px breakpoint for this image.
  casper.then(function() {
    test.assertEvalEquals(function () {
        return document.querySelectorAll('picture img')[0].getAttribute('src').match('large.jpg').toString();
    }, 'large.jpg', 'large.jpg found using 960x640 viewport.');
  });

  // Resize the viewport again
  casper.then(function() {
    this.viewport(1280, 1024);
  });

  // Finally, with the 1280x1024 viewport, check to see if the <img> is now
  // using the extralarge.jpg source which was specified for viewports larger
  // than 1000px wide.
  casper.then(function() {
    test.assertEvalEquals(function () {
        return document.querySelectorAll('picture img')[0].getAttribute('src').match('extralarge.jpg').toString();
    }, 'extralarge.jpg', 'extralarge.jpg found using 1280x1024 viewport.');
  });

  // This code runs all the tests that we defined above.
  //
  // @see http://casperjs.readthedocs.org/en/latest/modules/tester.html#done
  casper.run(function () {
    test.done();
  });
});
