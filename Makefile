patchy-min.js: src/*.js
	rm -rf patchy-min.js
	jshint src/*.js
	browserify src/*.js -o patchy-min.js
	chmod -w patchy-min.js

clean:
	rm -rf patchy-min
