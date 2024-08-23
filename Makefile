define RUN_FOR_ALL_PKGS
	echo "Executing \033[32m$(1)\033[0m for \033[34mall\033[0m packages"; \
	yarn workspaces foreach --worktree --topological-dev --exclude . $(2) -- $(1)
endef

define RUN_FOR_SPECIFICS_PKG
	echo "Executing \033[32m$(1)\033[0m for \033[34m$(2)\033[0m packages"; \
	yarn workspaces foreach -R --topological-dev --from '{$(2),}' $(3) -- $(1)
endef

define RUN_FROM
	@if [ -z "$(2)" ]; then $(call RUN_FOR_ALL_PKGS,$(1),$(3)); else $(call RUN_FOR_SPECIFICS_PKG,$(1),$2,$(3)); fi;
endef

##—— 📚 Help ——————————————————————————————————————————————————————————————
.PHONY: help
help: ## ❓ Display this help
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' \
		| sed -e 's/\[32m##——————————/[33m           /'  \
		| sed -e 's/\[32m##——/[33m ——/' \
		| sed -e 's/\[32m####/[34m                                 /' \
		| sed -e 's/\[32m###/[36m                                 /' \
		| sed -e 's/\[32m##\?/[35m /'  \
		| sed -e 's/\[32m##/[33m/'

.PHONY: install
install:
	yarn constraints --fix && yarn install

##—— 🔧 Documentation —————————————————————————————————————————————————————
.PHONY: build
build: ## 🏗️Build packages
#### Use from="..." to specify a package, e.g. from=pkg1 or from='{pkg1,pkg2}' (quotes are required !)
build: from ?=
#### Use opts="..." to specify additional options, e.g. opts="--include [...] --exclude [...]"
build: opts ?= "--parallel"
build:
	$(call RUN_FROM,run pkg:build,$(from),$(opts))

.PHONY: compile
compile: ## 🗜️Compile packages (TS mostly)
#### Use from="..." to specify a package, e.g. from=pkg1 or from='{pkg1,pkg2}' (quotes are required !)
compile: from ?=
#### Use opts="..." to specify additional options, e.g. opts="--include [...] --exclude [...]"
compile: opts ?= "--parallel"
compile:
	$(call RUN_FROM,run pkg:compile,$(from),$(opts))

##—— 🧪️Tests —————————————————————————————————————————————————————————————
.PHONY: test
test: ## 🏃 Test packages
#### Use from="..." to specify a package, e.g. from=pkg1 or from='{pkg1,pkg2}' (quotes are required !)
test: from ?=
#### Use opts="..." to specify additional options, e.g. opts="--include [...] --exclude [...]"
test: opts ?= "--parallel"
test:
	$(call RUN_FROM,run pkg:test,$(from),$(opts))

.PHONY: lint
lint: ## 🔎 Lint packages
#### Use from="..." to specify a package, e.g. from=pkg1 or from='{pkg1,pkg2}' (quotes are required !)
lint: from ?=
#### Use opts="..." to specify additional options, e.g. opts="--include [...] --exclude [...]"
lint: opts ?= "--parallel"
lint:
	$(call RUN_FROM,run pkg:lint,$(from),$(opts))

.PHONY: set-tag
set-tag: ## 🏷️ Replace inner action tag by the provided one
#### Use tag="..." to specify the tag, e.g. tag=v1
set-tag: tag ?= v0
set-tag:
	@find . \( -name 'action.yml' -or -path './.github/workflows/*.yml' \) \
		-exec sed -i .bkp -E 's/(uses: +yoanm\/temp-reports-group-workspace\/[^@]+)@.+/\1@$(tag)/g' {} \;
	@find . \( -name 'action.yml.bkp' -or -path './.github/workflows/*.yml.bkp' \) \
		-exec rm {} \;
