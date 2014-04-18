var express = require("express");
var bodyParser = require('body-parser');
var request = require("request");

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
	"help" : function (hook, callback) {
		callback("Valid commands: " + Object.keys(commands).join(", "));
	},
	"yes" : function (hook, callback) {
		callback('Good point, ' + hook.user_name);
	},
	"tp" : function (hook, callback) {
		callback("http://targetprocess/entity/" + hook.command_text);
	},
	"noice" : function (hook, callback) {
		callback(hook.user_name + " thinks " + hook.command_text + " is noice!");
	},
	"wat" : function (hook, callback) {
		callback(hook.user_name + " hurts itself in its confusion!");
	},
	"wiki" : function (hook, callback) {
		request("http://en.wikipedia.org/w/api.php?format=json&action=opensearch&limit=2&format=json&search=" + hook.command_text, function (err, res, body) {
			if (err) {
				result.text = "Error " + err;
			} else {
				result = JSON.parse(body)[1][0];
				if (result) {
					callback("https://en.wikipedia.org/wiki/" + encodeURIComponent(result));
				} else {
					callback("No wiki article on " + hook.command_text);
				}
			}
		});
	},
	"slap" : function (hook, callback) {
		callback("_Slaps " + hook.command_text + " with a large trout._");
	}
}

var execute_command = function (hook, callback) {
	if (!hook || !hook.text || !hook.trigger_word) {
		return {
			text : 'Invalid request'
		};
	}

	console.log(hook);

	hook.full_command_text = hook.text.substring(hook.trigger_word.length).trim();
	var index = hook.full_command_text.indexOf(" ");
	if (index !== -1) {
		hook.command_name = hook.full_command_text.substring(0, index)
			hook.command_text = hook.full_command_text.substring(index + 1);
	} else {
		hook.command_name = hook.full_command_text;
	}

	var command = commands[hook.command_name];

	if (command) {
		var result = {};
		command(hook, function (result_text) {
			callback({
				text : result_text
			});
		});
	} else {
		callback({
			text : 'Unknown command "' + hook.command_name + '".'
		});
	}
}

app.post('/', function (req, res) {
	hook = req.body;
	execute_command(hook, function (result) {
		res.json(result);
	});
});
