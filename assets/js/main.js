var config = {};

var state = {
    taskIndex: 0,
    taskInputData: [],
    taskOutputData: [],
    assignmentId: gup("assignmentId"),
    workerId: gup("workerId"),
};

/* HELPERS */
function saveTaskData() {
    console.log("saving task data: " + custom.collectData());
    state.taskOutputData[state.taskIndex] = custom.collectData();
}

function updateTask() {
    custom.showTask(state.taskInputData[state.taskIndex], state.taskOutputData[state.taskIndex]);
    $("#progress-bar").progress("set progress", state.taskIndex + 1);
    if (state.taskIndex == config.meta.numTasks - 1) {
        $("#next-button").addClass("disabled");
        $("#prev-button").removeClass("disabled");
        $("#submit-button").removeClass("disabled");
        $("#final-task-fields").css("display", "block");
    } else if (state.taskIndex == 0) {
        $("#next-button").removeClass("disabled");
        $("#prev-button").addClass("disabled");
        $("#submit-button").addClass("disabled");
        $("#final-task-fields").css("display", "none");
    } else {
        $("#next-button").removeClass("disabled");
        $("#prev-button").removeClass("disabled");
        $("#submit-button").addClass("disabled");
        $("#final-task-fields").css("display", "none");
    }
}

function nextTask() {
    if (state.taskIndex < config.meta.numTasks - 1) {
        saveTaskData();
        if (custom.validateTask(state.taskOutputData[state.taskIndex])) {
            state.taskIndex++;
            updateTask();
            clearMessage();
        } else {
            generateMessage("negative", "Please complete the current task!", "Your task data is invalid.");
        }
    }
}

function prevTask() {
    if (state.taskIndex > 0) {
        saveTaskData();
        state.taskIndex--;
        updateTask();
    }
}

function toggleInstructions() {
    if ($("#experiment").css("display") == "none") {
        $("#experiment").css("display", "flex");
        $("#instructions").css("display", "none");
        updateTask();
    } else {
        $("#experiment").css("display", "none");
        $("#instructions").css("display", "flex");
    }
}

function clearMessage() {
    $("#message-field").html("");
}

function generateMessage(cls, header, body) {
    clearMessage();
    var messageStr = "<div class='ui message " + cls + "'>";
    messageStr += "<i class='close icon'></i>";
    messageStr += "<div class='header'>" + header + "</div>";
    messageStr += "<p>" + body + "</p></div>";

    var newMessage = $(messageStr);
    $("#message-field").append(newMessage);
    newMessage.click(function() {
        $(this).closest(".message").transition("fade");
    });
}

function submitHIT() {
    saveTaskData();
    clearMessage();
    $("#submit-button").addClass("loading");
    var form = $("#submit-form");
    console.log("submitting hit");
    for (var i = 0; i < config.meta.numTasks; i++) {
        var item = state.taskOutputData[i];
        if (!custom.validateTask(item)) {
            $("#submit-button").removeClass("loading");
            generateMessage("negative", "Please complete the task!", "Some tasks aren't correctly completed yet.");
            return;
        }
    }
    for (var key in state) {
        var val = "<input type='hidden' name='" + key + "' value='";
        val += JSON.stringify(state[key]) + "'>";
        form.append($(val));
    }
    form.append($("<input type='hidden' name='feedback' value='" + $("#feedback-input").val() + "'>"));
    $("#submit-form").attr("action", config.submitUrl); 
    $("#submit-form").attr("method", "POST"); 
    // $("#submit-form").submit();
    $("#submit-button").removeClass("loading");
}

function gup(name) {
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var tmpURL = window.location.href;
    var results = regex.exec( tmpURL );
    if (results == null) return "";
    else return results[1];
}

/* SETUP FUNCTIONS */
function populateMetadata(config) {
    $(".meta-title").html(config.meta.title);
    $(".meta-desc").html(config.meta.description);
    $(".instructions-simple").html(config.instructions.simple);
    for (var i = 0; i < config.instructions.steps.length; i++) {
        $(".instructions-steps").append($("<li>" + config.instructions.steps[i] + "</li>"));
    }
    $(".disclaimer").html(config.meta.disclaimer);
    if (config.instructions.images.length > 0) {
        $("#sample-task").css("display", "block");
    }
    $("#progress-bar").progress({
        total: config.meta.numTasks,
    });
}

function setupButtons() {
    $("#next-button").click(nextTask);
    $("#prev-button").click(prevTask);
    $(".instruction-button").click(toggleInstructions);
    $("#submit-button").click(submitHIT);
    if (state.assignmentId == "ASSIGNMENT_ID_NOT_AVAILABLE") {
        $("#submit-button").remove();
    }
}

/* MAIN */
$(document).ready(function() {
    custom.loadTasks().done(function(taskInputData) {
        state.taskInputData = taskInputData;
        $.getJSON("config.json").done(function(data) {
            config = data;
            populateMetadata(config);
            setupButtons(config);
        });
    });
});

