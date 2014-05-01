var request = require("request");

module.exports = {
	def : {
		exec : function (hook, callback) {
			request("http://api.urbandictionary.com/v0/define?term=" + hook.command_text, function (err, res, body) {
				if (err || res.statusCode != 200) {
					callback("Error " + err);
				} else {
                    data = JSON.parse(body);
                    if (data.result_type == "no_results") {
						callback("No entry found for term " + hook.command_text);
					} else {
                        callback("Definition: " + data.list[0].definition + String.fromCharCode(13) + "Example: " + data.list[0].example);
                    }
				}
			});
		},
		help : function (callback) {
			callback("Search for a Youtube Video. Usage !youtube @keywords (e.g. !youtube Coveo Blitz 2014)");
		}
	}
}
