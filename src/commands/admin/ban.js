const { RichEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("BAN_MEMBERS")){ 
    let embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription("Sorry, You No Have Permissions To Ban Members");
return message.channel.send(embed);
  }
  if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.channel.send(`**${message.author.tag}** Sorry, I Am Not Have Permissions \`BAN_MEMBERS\` Please Give Me Permissions To Ban Members :)`).then(msg=>msg.delete(5000))
  
  let toBan = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!toBan) return message.channel.sendMessage("Can't Find User ! Please Mention User First !");
  let reason = args.join(" ").slice(22);
  if (toBan.hasPermission("BAN_MEMBERS")) return message.channel.send("This User Cannot Ban From Server 😞").then(msg => msg.delete(5000));
  
  if (toBan.highestRole.position < message.guild.member(client.user).highestRole.position) {
   message.guild.member(toBan).ban(reason);
   try {
    if (!reason) {
      toBan.send(`**${toBan.user.tag}** You Have Been Banned From **${message.guild.name}**`)
    } else {
      toBan.send(`**${toBan.user.tag}** You Have Been Banned From **${message.guild.name}**
Reason : "${reason}"`);
    }
    let embedB = new RichEmbed()
    .setColor('RANDOM')
    .setTitle('User Has Been Banned From Server')
    .addField('username', toBan.user.username, true)
    .addField('ID', toBan.id, true)
    message.channel.send(embedB);
  } catch (e) {
    console.log(e.message)
  }
  } else {
   message.channel.send(`I Can't ban **${toBan.user.tag}** because the role is higher than mine.`)
  }
}

exports.help = {
  name: "ban",
  description: 'Ban Seseorang Dari Servermu [PERMISSION BAN MEMBERS ONLY]',
  usage: 'ban [@mention someone]'
}
