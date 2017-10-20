var custom = {
    loadTasks: function(numSubtasks) {
        /*
         * This function is called on page load and should implement the promise interface
         *
         * numSubtasks - int indicating what length array to return (how many subtasks this task should have)
         * 
         * returns: If config.meta.aggregate is set to false, an array of objects with length config.meta.numTasks, 
         * one object for each task. If config.meta.aggregate is set to true, an object that will
         * be made available to all subtasks. 
         */
        return $.get("").then(function() {
            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        });
    },
    showTask: function(taskInput, taskIndex, taskOutput) {
        /*
         * This function is called when the experiment view is unhidden 
         * or when the task index is changed
         *
         * taskInput - If config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex. Else, the input object from loadTasks.
         * taskIndex - the number of the current subtask 
         * taskOutput - A partially filled out task corresponding to the subtask taskIndex. 
         *   If config.meta.aggregate is set to false, this is the results object for the current 
         *   subtask. If config.meta.aggregate is set to true, this is the results object for the
         *   entire task. 
         * 
         * returns: None
         */
        $(".exp-data").text("Input for task " + taskInput.toString());
        $("#exp-input").val(taskOutput);
        $("#exp-input").focus();
    },
    collectData: function(taskInput, taskIndex, taskOutput) {
        /* 
         * This function should return the experiment data for the current task 
         * as an object. 
         *
         * taskInput - If config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex. Else, the input object from loadTasks.
         * taskIndex - the number of the current subtask 
         * taskOutput - Outputs collected for the subtask taskIndex. 
         *   If config.meta.aggregate is set to false, this is the results object for the current 
         *   subtask. If config.meta.aggregate is set to true, this is the results object for the
         *   entire task.
         *
         * returns: if config.meta.aggregate is false, any javascript object that will be stored
         * as the new taskOutput for this subtask. If config.meta.aggregate is true, an object with key-value
         * pairs to be merged with taskOutput.  
         * 
         */
        return $("#exp-input").val();
    },
    validateTask: function(taskInput, taskIndex, taskOutput) {
        /*
         * This function should return true or false depending on whether the 
         * data stored in taskOutput is valid (e.g. fully filled out)
         *
         * taskInput - If config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex. Else, the input object from loadTasks.
         * taskIndex - the number of the current subtask 
         * taskOutput - Outputs collected for the subtask taskIndex. 
         *   If config.meta.aggregate is set to false, this is the results object for the current 
         *   subtask. If config.meta.aggregate is set to true, this is the results object for the
         *   entire task
         * 
         * returns: bool indicating if validation passed
         */
        return taskOutput.trim().length > 0;
    }
};
