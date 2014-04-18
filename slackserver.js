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

/*
hook contains the following:

token=QIwCdGmbI9BzuQtgiCbqCaJs
team_id=T0001
channel_id=C2147483705
channel_name=test
timestamp=1355517523.000005
user_id=U2147483697
user_name=Steve
text=googlebot: What is the air-speed velocity of an unladen swallow?
trigger_word=googlebot:
*/

var commands = {
	"yes" : function (hook) {
		return 'Good point, ' + hook.user_name;
	},
    "tp" : function(hook) {
        return "http://targetprocess/entity/" + hook.command_text;
    },
    "noice": function(hook) {
        return hook.user_name + " thinks " + hook.command_text + " is noice!";
    },
    "wat" : function(hook) { 
        return hook.user_name + " hurts itself in its confusion!";
    }
};

var execute_command = function (hook) {
    if (!hook || !hook.text || !hook.trigger_word) {
        return { text: 'Invalid request' };
    }
    
    console.log(hook);
    
    hook.full_command_text = hook.text.substring(hook.trigger_word.length).trim();
    var index = hook.full_command_text.indexOf(" ");
    console.log(hook.full_command_text);
    if (index !== -1) {
        hook.command_name = hook.full_command_text.substring(0, index)
        hook.command_text = hook.full_command_text.substring(index+1);
    } else {
        hook.command_name = hook.full_command_text;
    }
    
	var command = commands[hook.command_name];
    
	if (command) {
		return { text : command(hook) };
	} else {
		return {
			text : 'Unknown command "' + hook.command_name + '".'
		};
	}
}

app.post('/', function (req, res) {
	hook = req.body;
	reply = execute_command(hook);
	res.json(reply);
});
