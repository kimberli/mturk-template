# Icon Identification interface
A static HTML page for an icon image selection task.

### Development
Run `make watch` to watch SCSS files and compile to CSS. Run something like `python -m SimpleHTTPServer` to see the page locally.

### Customization
Change the data in `assets/data` and run helper scripts `cpimg.sh` and `split.sh` as needed.

Update constants in `assets/js/script.js` and change the `index.html` file accordingly.

### Setting up the MTurk task
Use `script/create_hit.rb` to create a HIT.

### Partitioning the dataset
Run the helper script `split.sh`. Currently, the entire test dataset is in `assets/data/all_test.txt`, and the dataset to be split (minus the 330 original transcripted images) is in `new_data.txt`. To get 13 partitions, I ran `split.sh` with parameter 200 images per split. The partitioned files are `new_data_<x>.txt`, where `x` is the index in the URL parameter `task_index` (and the global variable `TASK_INDEX` in `assets/js/script.js`). Note that these task indices are 1-indexed (see `script/createhit.rb`).

If you have a different number of images/partitions, you need to update the constants in the following files: (say `n` is your target number of partitions)

* running `split.sh` - first parameter should be target number of images per partition (should create `n` new files)
* `assets/js/script.js` - NUM_PARTITIONS (should be `n`)
* `script/create_hit.rb` - NUM_TASKS (should be `n`)
