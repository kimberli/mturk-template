var custom = {
    loadTasks: function(numSubtasks) {
        /*
         * This function is called on page load and should implement the promise interface
         * The final data returned should be an array of objects with length 
         * config.meta.numTasks, one object for each task
         *
         * numSubtasks - int indicating what length array to return (how many subtasks this task should have)
         */
        return $.get("").then(function() {
            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        });
    },
    showTask: function(taskInput, taskOutput) {
        /*
         * This function is called when the experiment view is unhidden 
         * or when the task index is changed
         *
         * taskInput - the object in the result from loadTasks corresponding to
         *   the current task
         * taskOutput - the object in the results array corresponding to the
         *   current task (i.e. a partially filled out task)
         */
        $(".exp-data").html(taskInput);
        $("#exp-input").val(taskOutput);
        $("#exp-input").focus();
    },
    collectData: function(taskInput) {
        /* 
         * This function should return the experiment data for the current task 
         * as an object
         *
         * taskInput - the object in the result from loadTasks corresponding to
         *   the current task
         */
        return $("#exp-input").val();
    },
    validateTask: function(taskOutput) {
        /*
         * This function should return true or false depending on whether the 
         * input task is valid (e.g. fully filled out)
         *
         * taskOutput - the object in the results array to validate
         */
        var matches = taskOutput.match(/\d+/g);
        if (matches != null) {
            return false;
        }
        return true;
    }
};
