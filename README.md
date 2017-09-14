# Generalized MTurk Task Template
A general-purpose template for Amazon Mechanical Turk tasks.

### Development
Run `make watch` to watch SCSS files and compile to CSS. Run something like `python -m SimpleHTTPServer` to see the page locally.

### Customization
This framework can be used to create MTurk HITs, broken up into discrete repeated "tasks". 

To define your own MTurk HIT, you only need to change things in three places:
* `config.json` - here, you can define your HIT's name, description, number of tasks, instructions, etc.
* `index.html` - find the section marked `<!-- vv CUSTOM EXPERIMENT MARKUP GOES HERE vv -->`, and add your custom HTML elements in that section (e.g. image divs, input boxes). Add `id`s to those HTML elements so you can easily refer to them with JQuery in the page's JavaScript (see next bullet).
* `assets/js/custom.js` - fill out the 4 functions: `loadTasks`, `showTask`, `collectData`, and `validateTask`. These define behavior for loading initial data, displaying a task, storing data frmo a task, and validating a task.

### Setting up the MTurk task
Use `script/create_hit.rb` to create a HIT.
