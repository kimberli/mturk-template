var config = {};

var state = {
    taskIndex: 0,
    taskInputs: [],
    taskOutputs: [],
    assignmentId: gup("assignmentId"),
    workerId: gup("workerId"),
};

/* HELPERS */
function saveTaskData() {
    console.log("saving task data: " + custom.collectData());
    state.taskOutputs[state.taskIndex] = custom.collectData();
}

function updateTask() {
    custom.showTask(state.taskInputs[state.taskIndex], state.taskOutputs[state.taskIndex]);
    $("#progress-bar").progress("set progress", state.taskIndex + 1);
    if (state.taskIndex == config.meta.numSubtasks - 1) {
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
    if (state.taskIndex < config.meta.numSubtasks - 1) {
        saveTaskData();
        if (custom.validateTask(state.taskOutputs[state.taskIndex])) {
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
    for (var i = 0; i < config.meta.numSubtasks; i++) {
        var item = state.taskOutputs[i];
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
    $("#submit-form").submit();
    $("#submit-button").removeClass("loading");
    generateMessage("positive", "Success!", "Thanks for helping us out with this task!");
    $("#submit-button").addClass("disabled");
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
        var instructionsIndex = Math.floor(Math.random() * config.instructions.images.length);
        var imgEle = "<img class='instructions-img' src='";
        imgEle += config.instructions.images[instructionsIndex] + "'></img>";
        $("#instructions-demo").append($(imgEle));

    }
    $("#progress-bar").progress({
        total: config.meta.numSubtasks,
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
    $.getJSON("config.json").done(function(data) {
        config = data;
        custom.loadTasks(config.meta.numSubtasks).done(function(taskInputs) {
            state.taskInputs = taskInputs;
            populateMetadata(config);
            setupButtons(config);
        });
    });
});

