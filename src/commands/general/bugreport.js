const Discord = require("discord.js")

exports.run = async (bot, message, args) => {
  
  var bug = args.join(" ");
  if(!bug)  {
   let inireturn = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("❌ Please give me specify bug !", "Usage : e/bugreport (bug)")
    .setTimestamp()
    
    message.channel.send(inireturn).then(message.delete())
    return
    
    }
  
  let embed = new Discord.RichEmbed()
     .setColor("RANDOM")
     .addField(`✅ Thank you for report bug !`, "Bug sended to my owner for review !")
     .setFooter(`Reported By : ${message.author.tag}`);
  
  message.channel.send(embed).then(() => {
    
    message.delete()
    
    let embed = new Discord.RichEmbed()
    .addField("❎ Bug :", `${bug}`)
    .setColor("RANDOM")
    .setFooter(`Bug From : ${message.author.tag}`);
    
    bot.users.get("290159952784392202").send(embed);
    
  })
  
}

exports.conf = {
  aliases: ['bug'],
  cooldowm: '5'
}

exports.help = {
   name: "bugreport",
   description: "Report bug from this bot.",
   usage: "bugreport (Bug)"
}
