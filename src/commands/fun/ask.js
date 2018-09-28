const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {

  var eightball = [
      "**Yes.**",
      "**No.**",
      "**Maybe?.**",
      "**Very likely.**",
      "**Probably not.**",
      "**😇Only God knows.**",
      "**🙄Hmmm...**",
      "**😆, What is your question?**",
  ];

        if (args[1] != null) message.reply(eightball[Math.floor(Math.random() * eightball.length).toString(16)]);
        else message.channel.send("🙄**Hmmm... |** `Please Type : <ask [question]`");

}

exports.conf = {
   aliases: ['8ball'],
   cooldown: '5'
}

exports.help = {
    name: "ask",
    description: "Ask your question here",
    usage: "ask (your question)"
}
