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

install:
	install-deps install-flow-typed

develop:
	npx webpack-dev-server

install-deps:
	npm install

test:
	npm test

.PHONY: test

install-actions:
	npm ci
