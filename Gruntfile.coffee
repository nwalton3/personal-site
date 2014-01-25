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
			compile:
				files:
					'js/script.min.js' : [
						'js/libs/jquery-2.0.3.min.js', 
						'js/libs/typogr.js',
						'js/libs/hisrc.js',
						'js/script.js']


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
				#'js/init.js',
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
			compile:
				files:[
					expand: true
					cwd: 'jade/'
					src: ['**/*.html.jade']
					dest: ''
					ext: '.html'
				]

		watch:
			sass:
				files: ['sass/**/*.sass', 'sass/**/*.scss']
				tasks: ['sass', 'autoprefixer']

			jade:
				files: ['jade/**/*.jade']
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
				files: ['js/script.js']
				tasks: ['jshint', 'uglify']
			jsmin:
				files: ['js/script.min.js']
				options:
					livereload: true
			css:
				files: ['css/**/*']
				options:
					livereload: true

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

	# Default task(s).
	grunt.registerTask('compile', ['sass', 'jade', 'jshint', 'uglify'])
	grunt.registerTask('default', ['compile', 'connect', 'watch'])