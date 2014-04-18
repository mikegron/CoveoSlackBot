var express = require("express");
var Slack = require('node-slack');
var bodyParser = require('body-parser');
var slack = new Slack("coveo.slack.com", "NOT_USED");

var app = express();
app.use(bodyParser());
var port = Number(process.env.PORT || 5000);
app.listen(port, function () {
	console.log("listening on " + port);
});

app.get("/", function (req, res) {
	res.send("Slack bot online");
});

var commands = {
	"!yes" : function (hook) {
		return 'Good point, ' + hook.user_name;
	},
    "!tp" : function(hook) {
        return "http://targetprocess/entity/" + hook.command_text;
    },
    "!noice": function(hook) {
        return hook.user_name + " thinks " + hook.command_text + " is noice!";
    },
    "!wat" : function(hook) { 
        return hook.user_name + " hurts itself in its confusion!";
    }
};

var execute_command = function (hook) {
	var command = commands[hook.trigger_word];
    
	if (command) {
        hook.command_text = hook.text.substring(hook.trigger_word.length+1);
		return { text : command(hook) };
	} else {
		return {
			text : 'Unknown command "' + hook.trigger_word + '".'
		};
	}
}

app.post('/', function (req, res) {
    console.log("Content-type ", req.get('Content-Type'));
    console.log("Body ", req.body);

	hook = req.body;
	reply = execute_command(hook);
	res.json(reply);
});
