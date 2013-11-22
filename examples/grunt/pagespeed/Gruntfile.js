module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    pagespeed: {
      desktop: {
        url: "http://fourkitchens.com",
        locale: "en_US",
        strategy: "desktop",
        threshold: 85
      },
      mobile: {
        url: "http://fourkitchens.com",
        locale: "en_US",
        strategy: "mobile",
        threshold: 85
      },
      options: {
        key: function() {
          fs.readFile('~/.api/google-pagespeed.key', function (err, data) {
            if (err) throw err;
              return data;
          })
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-pagespeed');

  grunt.registerTask('default', ['pagespeed']);
};
