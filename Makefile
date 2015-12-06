patchy-min.js: src/*.js src/patch-graph/*.js src/patch-vis/*.js
	rm -rf patchy-min.js
	jshint src/*.js
	jshint src/patch-graph/*.js
	browserify src/patchy.js -o patchy-min.js
	chmod -w patchy-min.js

clean:
	rm -rf patchy-min.js
