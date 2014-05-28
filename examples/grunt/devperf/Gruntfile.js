module.exports = function(grunt) {
  grunt.initConfig({
    devperf: {
      options: {
        urls: [
          'http://gruntjs.com'
        ],
        resultsFolder: './reports/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-devperf');
  grunt.registerTask('default', ['devperf']);
};
