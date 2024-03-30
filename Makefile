PKG_LIST := node-gha-helpers node-sdk gha-find gha-load-metadata gha-create gha-codecov-uploader gha-codacy-uploader gha-attach-check-run-to-triggering-workflow gha-fetch-workflow-metadata
TARGETS := configure install package lint test compile

define FOR_EACH_PKG
    @for PKG in $(PKG_LIST); do \
	    echo ">>>>>> $(1) \"$$PKG\" Package >>>>>>"; \
	    $(MAKE) -C $$PKG $(1) || exit 1; \
	    echo "<<<<<<\n"; \
    done
endef

build:
	yarn build

$(TARGETS):
	$(call FOR_EACH_PKG,$@)
