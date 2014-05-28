module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    phantomas: {
      default: {
        options: {
          indexPath: './reports/',
          options: {},
          url: 'http://gruntjs.com/'
        }
      },
      screenshot: {
        options: {
          indexPath: './reports/',
          options: {
            'screenshot': 'screenshots/sample-' + Date.now() + '.png'
          },
          url: 'http://gruntjs.com/'
        }
      },
      requests: {
        options: {
          indexPath: './reports/',
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
