var express = require("express");
var Slack = require('node-slack');
var bodyParser = require('body-parser');
var slack = new Slack("coveo.slack.com", "NOT_USED");

var app = express();
app.use(bodyParser.json());
var port = Number(process.env.PORT || 5000);
app.listen(port, function () {
	console.log("listening on " + port);
});

app.get("/", function (req, res) {
	res.send("Slack bot online");
});

var commands = {
	"!yes" : function (hook) {
		return {
			text : 'Good point, ' + hook.user_name
		};
	},
    "!tp" : function(hook) {
        return {
            text : "http://targetprocess/entity/" + hook.command_text
        };
    }
};

var execute_command = function (hook) {
    console.log("Executing hook:");
    console.log(hook);
	var command = commands[hook.trigger_word];
    
	if (command) {
        hook.command_text = hook.text.substring(hook.trigger_word.length+1);
		return command(hook);
	} else {
		return {
			text : 'Unknown command "' + hook.trigger_word + '".'
		};
	}
}

app.post('/', function (req, res) {
	hook = req.body;
	reply = execute_command(hook);
	res.json(reply);
});
