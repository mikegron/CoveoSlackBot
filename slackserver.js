var express = require("express");
var Slack = require('node-slack');
var slack = new Slack("coveo.slack.com","SORN4gqdTDeBL0Il4dpgcOx7");

var app = express();

app.get("/", function(req, res) {
    res.send("Slack bot online");
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("listening on " + port);
});

app.post('/yesman',function(req,res) {
    console.log("Received /yesman");
    console.log(req);
    var reply = slack.respond(req.body,function(hook) {

        return {
            text: 'Good point, ' + hook.user_name,
            username: 'Bot'
        };

    });

    res.json(reply);
});