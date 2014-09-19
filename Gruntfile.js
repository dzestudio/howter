module.exports = function(grunt) {

  // Package-specific configs
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        files: {
          'dist/howter.js': ['src/howter.context.js', 'src/howter.route.js', 'src/howter.js']
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/howter.min.js': ['src/howter.context.js', 'src/howter.route.js', 'src/howter.js']
        }
      }
    }

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default tasks
  grunt.registerTask('dist', ['concat:dist', 'uglify:dist']);
  grunt.registerTask('default', ['dist']);
};