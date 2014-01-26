module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    phantomas: {
      default: {
        options: {
          indexPath: './phantomas/',
          options: {},
          url: 'http://gruntjs.com/'
        }
      },
      screenshot: {
        options: {
          indexPath: './phantomas/',
          options: {
            'screenshot': 'screenshots/sample-' + Date.now() + '.png'
          },
          url: 'http://gruntjs.com/'
        }
      },
      requests: {
        options: {
          indexPath: './phantomas/',
          options: {
            'assert-requests': 20
          },
          url: 'http://gruntjs.com/'
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-phantomas');

  grunt.registerTask('default', ['phantomas:default']);
};
