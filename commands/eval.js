module.exports = {
  def: {
    exec : function (hook, callback) {
      callback("" + eval(hook.command_text));
    },
    help : function(){
      callback("GODLIKE POWER, Usage !eval @script")
    }
  }
}