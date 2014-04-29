module.exports = {
    def: {
        exec : function (hook, callback) {
            var splited = hook.command_text.split(" ");
            if(splited.length != 2) {
                callback("Error: Must specify an attack and a target.");
            }
            
            // Extract given args
            var attack = splited[0];
            var target = splited[1];
            var back = hook.user_name + " used " + attack + " on " + target + "! ";
            
            // Change of success
            var random = Math.random();
            if(random >= 0.60) {
                back += "It's super effective :collision:";
            } else {
                back += "It's not very effective... :zzz:";
            }
            callback(back);
        },
        help : function(callback) {
          callback("Use an attack ! Must specify an attack and a target. Ex.: !use fire coveobot");
        }
    }
};