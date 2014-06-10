module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: [
                    'src/**/*.css'
                ],
                dest: 'dist/ldv.css'
            },
            js: {
                src: [
                    'js/*.js'
                ],
                dest: 'dist/ldv.js'
            },
			scss: {
				src: [
					'src/ldv.scss',
					'src/**/*.scss'
				],
				dest: 'dist/ldv.scss'
			},
			srcjs: {
				src: [
					'src/ldv.js',
					'src/controller.js',
					'src/pretty/**/*.js',
					'src/services/**/*.js',
					'src/taf/**/*.js',
					'src/tools/**/*.js',
					'src/triple-table/**/*.js',
					'src/ui/**/*.js',
					'dist/tpls/*.js'
				],
				dest: 'dist/ldv.js'
			},
			config: {
				src: ['src/dist/config.js'],
				dest: 'dist/cfg.js'
			},
			actions: {
				src: ['src/dist/actions/*.js'],
				dest: 'dist/actions.js'
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
            },
			config: {
				src:	'dist/cfg.js',
				dest:	'dist/cfg.js'
			},
			actions: {
				src:	'dist/actions.js',
				dest:	'dist/actions.js'
			}
        },
		html2js: {
			options: {
				module:	function(obj, target) {return "ldv.templates."+target;}
			},
			pretty: {
				src: 	'src/pretty/**/*.html',
				dest:	'dist/tpls/pretty.js'
			},
			ui:		{
				src:	'src/ui/**/*.html',
				dest:	'dist/tpls/ui.js'
			},
			tripletable: {
				src:	'src/triple-table/**/*.html',
				dest:	'dist/tpls/tripletable.js'
			},
			main: {
				src:	'src/tpl/*.html',
				dest:	'dist/tpls/main.js'
			}
		},
		sass: {
			dist: {
				src:	'dist/ldv.scss',
				dest:	'dist/ldv.css'
			}
		},
        watch: {
          files: ['src/*', 'src/*/*'],
          tasks: ['buildSrc']
       }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['build']);
	grunt.registerTask('build', 
		['buildConfig', 'buildActions', 'buildSrc', 'buildCss']);
	
	grunt.registerTask('buildSass', ['concat:scss', 'sass', 'cssmin']);
	grunt.registerTask('buildConfig', ['concat:config', 'uglify:config']);
	grunt.registerTask('buildActions', ['concat:actions', 'uglify:actions']);
	grunt.registerTask('buildSrc', ['html2js', 'concat:srcjs', 'ngmin:dist'/*, 'uglify:js'*/]);
	grunt.registerTask('buildCss', ['concat:css','cssmin']);
};