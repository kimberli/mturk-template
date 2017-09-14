var custom = {
    loadTasks: function() {
        /*
         * This function is called on page load and should implement the promise interface
         * The final data returned should be an array of objects with length 
         * config.meta.numTasks, one object for each task
         */
        return $.get("").then(function() {
            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        });
    },
    showTask: function(taskInputData, taskOutputData) {
        /*
         * This function is called when the experiment view is unhidden 
         * or when the task index is changed
         *
         * taskInputData - the object in the result from loadTasks corresponding 
         *   the current task
         * taskOutputData - the object in the results array corresponding to the 
         *   current task (i.e. a partially filled out task)
         */
        $(".exp-data").html(taskInputData);
        $("#exp-input").val(taskOutputData);
        $("#exp-input").focus();
    },
    collectData: function() {
        /* 
         * This function should return the experiment data for the current task 
         * as an object
         */
        return $("#exp-input").val();
    },
    validateTask: function(taskOutputData) {
        /*
         * This function should return true or false depending on whether the 
         * input task is valid (e.g. fully filled out)
         *
         * taskOutputData - the object in the results array to validate
         */
        var matches = taskOutputData.match(/\d+/g);
        if (matches != null) {
            return false;
        }
        return true;
    }
};
