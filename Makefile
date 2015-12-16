patchy-edit-min.js: src/patchy-edit.js src/patchy-edit/*.js
	rm -rf patchy-edit-min.js
	jshint src/patchy-edit.js
	jshint src/patchy-edit/*.js
	browserify src/patchy-edit.js -o patchy-edit-min.js
	chmod -w patchy-edit-min.js

clean:
	rm -rf patchy-edit-min.js
	rm -rf patchy-server-min.js
	rm -rf patchy-entity-min.js
