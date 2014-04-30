var request = require("request");

module.exports = {
	def : {
		exec : function (hook, callback) {
			if(!hook.command_text) {
				hook.command_text = hook.user_name;
			}
			request("http://artii.herokuapp.com/make?text=" + hook.command_text, function (err, res, body) {
				if (err || res.statusCode != 200) {
					callback("Error");
				} else {
					var result = {
						text : "```" + body + "```",
						mrkdwn : true 
					}
					callback(result);
				}
			});
		},
		help : function (callback) {
			callback("Display your text as ASCII. Usage !ascii @text");
		}
	}
}
