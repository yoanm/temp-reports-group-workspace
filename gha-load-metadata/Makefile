.PHONY: all
all: build

.PHONY: install
install:
	yarn install

.PHONY: build
build:
	@echo "Building package ..."
	@rm -rf dist/* && npx ncc build src/index.ts --target es2015 --minify --source-map --license LICENSE --out dist

.PHONY: compile
compile:
	@echo "Compile TS sources ..."
	@rm -rf ts-dist/* && tsc -p ./tsconfig.json

.PHONY: lint
lint:
	eslint index.js

.PHONY: test
test:
	echo "Error: no test specified"
	exit 1

get-action-nodejs-version: ## Display node version configured on action.yml
	@grep -E "using:\s*'?node" action.yml | sed -e "s/^.*using: '*node\([0-9][0-9]\)'*.*$$/\1/"
