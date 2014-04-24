module.exports = {
	play: function(hook, players){
		initPlayer(hook, players);
		var randomChoice = getRockPaperScissor(getRandomInt(0,2));//0 : Rock, 1 : Paper, 2 : Scissor
		var playerChoice = hook.command_text.toLowerCase();
		var outcome = "Draw";
		switch (playerChoice) {
			case "rock":
				if (randomChoice == "paper") { 
					outcome = "Lost";
				} else if (randomChoice == "scissor") {
					outcome = "Win"
				}
				break;
			case "paper":
				if (randomChoice == "scissor") { 
					outcome = "Lost";
				} else if (randomChoice == "rock") {
					outcome = "Win"
				}
				break;
			case "scissor":
				if (randomChoice == "rock") {
					outcome = "Lost";
				} else if (randomChoice == "paper") {
					outcome = "Win"
				}
				break;
			default :
				outcome = "Idiot";
				break;
		}
		var response = "";
		if(outcome == "Idiot") {
			response = "~~ Nope, not a valid choice ! It's rock paper scissor ~~"
		} else {
			updatePlayer(hook, players, outcome)
			response = "Coveo Bot choice is ... " + randomChoice + " ! "
			if(outcome == "Win") {
				response += "You win !";
			} else if(outcome == "Lost") {
				response += "You lose !";
			} else {
				response += "It's a draw !";
			}
			response += " Your stats : " + JSON.stringify(players[hook.user_name]);
		}
		return response;
	}
}

var getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getRockPaperScissor = function(choice) {
	switch (choice) {
		case 0:
			return "rock";
			break;
		case 1:
			return "paper";
			break;
		case 2:
			return "scissor";
			break;
		default:
			return "LAZOR";
	}
}

var initPlayer = function (hook,players){
	if(players[hook.user_name] == undefined){
		players[hook.user_name] = {
			lost: 0,
			won: 0,
			draw: 0,
			total: 0
		}
	}
}

var updatePlayer = function(hook, players, outcome) {
	players[hook.user_name].total ++;
	if(outcome == "Win") {
		players[hook.user_name].won ++;
	} else if (outcome == "Lost") {
		players[hook.user_name].lost ++;
	} else {
		players[hook.user_name].draw ++;
	}
}
