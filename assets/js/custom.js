var custom = {
    loadTasks: function(numSubtasks) {
        /*
         * This function is called on page load and should implement the promise interface
         * If config.meta.aggregate is set to false, the final data returned should be an array of objects 
         * with length config.meta.numTasks, one object for each task. 
         *
         * numSubtasks - int indicating what length array to return (how many subtasks this task should have)
         */
        return $.get("").then(function() {
            return [0, 1, 2];
        });
    },
    showTask: function(taskInput, taskIndex, taskOutput) {
        /*
         * This function is called when the experiment view is unhidden 
         * or when the task index is changed
         *
         * taskInput - If config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex. Else, the input object from loadTasks.
         * taskIndex - the index of the current subtask 
         * taskOutput - A partially filled out task corresponding to the subtask 
         *   taskIndex. If config.meta.aggregate is set to false, this is the object in the results
         *   array corresponding to the current task. If config.meta.aggregate is set to true, this 
         *   is the results object as collected so far. 
         */
        $(".exp-data").html(taskInput.toString());
        if (taskOutput) {
            $("#exp-input").val(taskOutput['results_' + taskIndex]);
        } else {
            $("#exp-input").val("");
        }
        $("#exp-input").focus();
    },
    collectData: function(taskIndex, taskInputs) {
        /* 
         * This function should return the experiment data for the current task 
         * as an object. 
         * If config.meta.aggregate is set to false, this data will be stored as the output
         * in the results array for this task. 
         * If config.meta.aggregate is set to true, this object will be merged with the 
         * existing results object. 
         *
         * taskIndex - the index of the current subtask
         * taskInputs - If config.meta.aggregate is false, the object in the array from loadTasks
         *   corresponding to subtask taskIndex. Else, the input object from loadTasks.
         */
        var key = 'results_' + taskIndex.toString();
        ret = {}
        ret[key] = $("#exp-input").val();
        return ret;
    },
    validateTask: function(taskOutput, taskIndex) {
        /*
         * This function should return true or false depending on whether the 
         * input task is valid (e.g. fully filled out)
         *
         * taskOutput - the result to validate. If config.meta.aggregate = false, 
         *   this is the object in the results array corresponding to 
         *   subtask taskIndex. Else, it is the results object so far.
         * taskIndex - the index of the subtask being validated
         */
        var output = taskOutput['results_' + taskIndex];
        return output.trim().length > 0;
    }
};
