#PKG_LIST := node-gha-helpers node-sdk gha-find gha-load-metadata gha-create gha-codecov-uploader gha-codacy-uploader gha-attach-check-run-to-triggering-workflow gha-fetch-workflow-metadata
#TARGETS := configure build package lint test compile

#define FOR_EACH_PKG
#    @for PKG in $(PKG_LIST); do \
#	    echo ">>>>>> $(1) \"$$PKG\" Package >>>>>>"; \
#	    $(MAKE) -C $$PKG $(1) || exit 1; \
#	    echo "<<<<<<\n"; \
#    done
#endef

.PHONY: configure
configure:
	yarn workspaces foreach --worktree --topological-dev --exclude . run pkg:configure

.PHONY: build
build:
	yarn workspaces foreach --worktree --topological-dev --exclude . run pkg:build

.PHONY: install
install:
	yarn constraints --fix && yarn install

.PHONY: package
package:
	yarn workspaces foreach --worktree --topological-dev --exclude . run pkg:package

.PHONY: lint
lint:
	yarn workspaces foreach --worktree --topological-dev --exclude . run pkg:lint

.PHONY: test
test:
	yarn workspaces foreach --worktree --topological-dev --exclude . run pkg:test

.PHONY: compile
compile:
	yarn workspaces foreach --worktree --topological-dev --exclude . run pkg:compile
