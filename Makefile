SASS := sass
RM := rm

SASSFLAGS := --scss --unix-newlines --style compressed
RMFLAGS := -rf

SCSS_DIR := assets/scss
CSS_OUT := assets/css

SCSS_SRC := $(shell find $(SCSS_DIR) -name "*.scss")
CSS_OBJS := $(patsubst $(SCSS_DIR)%, $(CSS_OUT)%, $(patsubst %.scss, %.css, $(SCSS_SRC)))
CSS_MAPS := $(patsubst $(SCSS_DIR)%, $(CSS_OUT)%, $(patsubst %.scss, %.css.map, $(SCSS_SRC)))

ALL_OBJS := $(CSS_OBJS)

$(CSS_OUT)/%.css: $(SCSS_DIR)/%.scss
	$(SASS) $(SASSFLAGS) $< $@

all: $(ALL_OBJS)

watch:
	@$(SASS) --watch $(SASSFLAGS) $(SCSS_DIR):$(CSS_OUT)

clean:
	$(RM) $(RMFLAGS) $(ALL_OBJS) $(CSS_MAPS) .sass-cache

.PHONY: all watch clean
