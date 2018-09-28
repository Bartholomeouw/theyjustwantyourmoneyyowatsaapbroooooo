const { RichEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")){ 
    let embed = new RichEmbed()
      .setColor("RANDOM")
      .setTitle("Sorry, You not have permissions to kick members.");
return message.channel.send(embed);
  }
  if (!message.guild.member(client.user).hasPermission("MANAGE_NICKNAMES")) return message.channel.send(`**${message.author.tag}**, Sorry I am not have permissions \`KICK_MEMBERS\` please give me permissions \`KICK_MEMBERS\` to kick members.`).then(msg=>msg.delete(5000))
  
  let toKick = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!toKick) return message.channel.sendMessage("Can't find user ! Mention user first !");
  let reason = args.join(" ").slice(22);
  if (toKick.hasPermission("KICK_MEMBERS")) return message.channel.send("Hmm i am can't kick this user").then(msg => msg.delete(3000));
  
  if (toKick.highestRole.position < message.guild.member(client.user).highestRole.position) {
   message.guild.member(toKick).kick(reason);
   try {
    if (!reason) {
      toKick.send(`**${toKick.user.tag}** You has been kicked from **${message.guild.name}**`)
    } else {
      toKick.send(`**${toKick.user.tag}** You has been kicked from **${message.guild.name}**
Reason : "${reason}"`);
    }
    let embedB = new RichEmbed()
    .setColor('RANDOM')
    .setTitle('User has been kicked from server')
    .addField('username', toKick.user.username, true)
    .addField('ID', toKick.id, true)
    message.channel.send(embedB);
  } catch (e) {
    console.log(e.message)
  }
  } else {
   message.channel.send(`I am can't kick **${toKick.user.tag}** because the role is higher than mine.`)
  }
}

exports.conf = {
  aliases: ['kick'],
  cooldown: '5'
  }

exports.help = {
  name: "kick",
  description: 'Kick Someone from uyou server[ADMIN ONLY]',
  usage: 'Kick [@mention someone]'
}
