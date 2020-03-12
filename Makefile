install: install-deps

install-deps:
	npm ci

publish:
	npm publish --dry-run

push:
	sudo git push origin master

lint:
	npx eslint .

build:
	rm -rf dist
	NODE_ENV=production npx webpack

fix:
	sudo npx eslint --fix .
