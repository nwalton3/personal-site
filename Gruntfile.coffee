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
						# 'js/libs/snap-svg.min.js',
						'js/plugins/typogr.js',
						'js/plugins/hisrc.js',
						'js/plugins/imageloader.js',
						'js/script.js']
			touch:
				files:
					'js/script-touch.min.js' : [
						'js/libs/jquery-2.0.3.min.js',
						# 'js/libs/snap-svg.min.js',
						'js/plugins/typogr.js',
						'js/plugins/hisrc.js',
						'js/plugins/imageloader.js',
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
			local:
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
			prod:
				options:
					style: 'compressed'
					compass: 'config.rb'
					loadPath: ['sass/','sass-extensions/**/*']
				compile:
					files:[
						expand: true
						cwd: 'sass/'
						src: 'style.sass'
						dest: 'css/'
						ext: '.css'
					]

		autoprefixer:
			local:
				options:
					map: true
				src: 'css/*.css'
			prod:
				options:
					map: false
				src: 'css/*.css'


		"merge-json":
			local:
				files:
					'data/index.json' : ['data/env/local.json', 'data/page/index.json']
					'data/portfolio.json' : ['data/env/local.json', 'data/page/portfolio.json']
					'data/students.json' : ['data/env/local.json', 'data/page/students.json']
			stage:
				files:
					'data/index.json' : ['data/page/index.json', 'data/env/stage.json']
					'data/portfolio.json' : ['data/page/portfolio.json', 'data/env/stage.json']
					'data/students.json' : ['data/page/students.json', 'data/env/stage.json']
			prod:
				files:
					'data/index.json' : ['data/page/index.json', 'data/env/prod.json']
					'data/portfolio.json' : ['data/page/portfolio.json', 'data/env/prod.json']
					'data/students.json' : ['data/page/students.json', 'data/env/prod.json']


		jade:
			options:
				pretty: true
			index:
				options:
					data: (dest, src) -> return require('./data/index.json')
				files:
					'index.html' : 'jade/index.html.jade'
			portfolio:
				options:
					data: (dest, src) -> return require('./data/portfolio.json')
				files:
					'portfolio.html' : 'jade/portfolio.html.jade'
			students:
				options:
					data: (dest, src) -> return require('./data/students.json')
				files:
					'students.html' : 'jade/portfolio.html.jade'


		yaml:
			options:
				space: 2
			pages: 
				files:
					'data/portfolio.json': ['data/portfolio.yml'],
					'data/students.json': ['data/students.yml'],
					'data/index.json': ['data/index.yml']
			environments:
				files:
					'data/env/local.json': ['data/env/local.yml'],
					'data/env/stage.json': ['data/env/stage.yml'],
					'data/env/prod.json': ['data/env/production.yml']

		watch:
			sass:
				files: ['sass/**/*.sass', 'sass/**/*.scss']
				tasks: ['sass', 'autoprefixer:local']

			jade:
				files: ['jade/**/*.jade', 'data/*.json']
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
				files: ['data/*.yml']
				tasks: ['yaml']

			local:
				files: ['data/env/local.yml']
				tasks: ['yaml:environments', 'merge-json:local', 'jade', 'local']
			stage:
				files: ['data/env/stage.yml']
				tasks: ['yaml:environments', 'merge-json:stage', 'jade', 'prod']
			prod:
				files: ['data/env/production.yml']
				tasks: ['yaml:environments', 'merge-json:prod', 'jade', 'prod']


		connect:
			server:
				options:
					port: 9001



	require('load-grunt-tasks')(grunt);

	grunt.registerTask('local', ['sass:local', 'autoprefixer:local'])
	grunt.registerTask('prod', ['sass:prod', 'autoprefixer:prod'])

	# Default task(s).
	grunt.registerTask('compile', ['sass:local', 'autoprefixer:local', 'yaml', "merge-json:local", 'jade', 'jshint', 'uglify'])
	grunt.registerTask('default', ['compile', 'connect', 'watch'])
