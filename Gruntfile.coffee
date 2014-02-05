'use strict'
path = require('path')
# lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet

folderMount = (connect, point) ->
	return connect.static(path.resolve(point))


module.exports = (grunt) ->

	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')

		uglify:
			options:
				mangle: false
				preserveComments: 'some'
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %>  */'
			script:
				files:
					'js/script.min.js' : [
						'js/libs/jquery-2.0.3.min.js',
						'js/plugins/typogr.js',
						'js/plugins/hisrc.js',
						'js/script.js']
			touch:
				files:
					'js/script-touch.min.js' : [
						'js/libs/jquery-2.0.3.min.js',
						'js/plugins/typogr.js',
						'js/plugins/hisrc.js',
						'js/plugins/touchswipe.js',
						'js/touch.js',
						'js/script.js']
			init:
				files:
					'js/init.min.js' : [
						'js/libs/modernizr.min.js',
						'js/init.js']

		jshint:
			options:
				"camelcase" : false
				"es3" : false
				"trailing" : false
				"white" : false
				"smarttabs" : true
				"jquery" : true
				"browser" : true
			files:[
				'js/init.js',
				'js/touch.js',
				'js/script.js'
				]


		sass:
			options:
				style: 'compressed'
				compass: 'config.rb'
				#debugInfo: true
				trace: true
				loadPath: ['sass/','sass-extensions/**/*']
				sourcemap: true
			compile:
				files:[
					expand: true
					cwd: 'sass/'
					src: 'style.sass'
					dest: 'css/'
					ext: '.css'
				]

		autoprefixer:
			options:
				map: true
			src: 'css/*.css'

		jade:
			options:
				pretty: true
				data: (dest, src) -> return require('./data/portfolio.json')
			compile:
				files:[
					expand: true
					cwd: 'jade/'
					src: ['**/*.html.jade']
					dest: ''
					ext: '.html'
				]
		yaml:
			data:
				options:
					space: 2
				files: 
					'data/portfolio.json': ['data/portfolio.yml']

		watch:
			sass:
				files: ['sass/**/*.sass', 'sass/**/*.scss']
				tasks: ['sass', 'autoprefixer']

			jade:
				files: ['jade/**/*.jade', 'data/portfolio.json']
				tasks: ['jade']

			image:
				files: ['img/*']
				options:
					livereload: true
			html:
				files: ['*.html']
				options:
					livereload: true
			js:
				files: ['js/script.js', 'js/touch.js']
				tasks: ['jshint', 'uglify:script', 'uglify:touch']
			initjs:
				files: ['js/init.js']
				tasks: ['jshint', 'uglify:init']
			jsmin:
				files: ['js/script.min.js', 'js/init.min.js']
				options:
					livereload: true
			css:
				files: ['css/**/*']
				options:
					livereload: true
			yaml:
				files: ['data/portfolio.yml']
				tasks: ['yaml']

		connect:
			server:
				options:
					port: 9001


	grunt.loadNpmTasks('grunt-contrib-jshint')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.loadNpmTasks('grunt-autoprefixer')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-connect')
	grunt.loadNpmTasks('grunt-contrib-jade')
	grunt.loadNpmTasks('grunt-yaml');

	# Default task(s).
	grunt.registerTask('compile', ['sass', 'yaml', 'jade', 'jshint', 'uglify'])
	grunt.registerTask('default', ['compile', 'connect', 'watch'])
