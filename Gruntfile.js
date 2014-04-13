module.exports = function(grunt) {

	grunt.registerTask('default', []);
	
	grunt.initConfig({
		uglify:	{
			options:	{},
			target:		{
				src:	[],
				dest:	'dist/dbpv.min.js'
			}
		}
	});	
};