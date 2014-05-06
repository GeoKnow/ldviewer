module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: [
                    'css/*.css'
                ],
                dest: 'dist/ldv.css'
            },
            js: {
                src: [
                    'js/*.js'
                ],
                dest: 'dist/ldv.js'
            },
			srcjs: {
				src: [
					'src/ldv.js',
					'src/config.js',
					'src/controller.js',
					'src/*/*.js'
				],
				dest: 'dist/ldv.js'
			}
        },
        cssmin: {
            css: {
                src: 'dist/ldv.css',
                dest: 'dist/ldv.css'
            }
        },
        ngmin: {
			dist: {
				files: {
					'dist/ldv.js': ['dist/ldv.js']
				}
			}
        },
        uglify: {
            js: {
                files: {
                    'dist/ldv.js': ['dist/ldv.js']
                }
            }
        },
        watch: {
          files: ['src/*', 'src/*/*'],
          tasks: ['buildSrc']
       }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat:css', 'cssmin:css', 'concat:js', 'uglify:js']);
	grunt.registerTask('build', 
		['concat:css', 'cssmin:css', 'concat:js', 'ngmin:dist', 'uglify:js']);
		
	grunt.registerTask('buildSrc',
		['concat:css', 'cssmin:css', 'concat:srcjs', 'ngmin:dist']);
};