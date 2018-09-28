const ms = require('ms');
const Discord = require("discord.js");
exports.run = (client, message, args) => {
  if (!client.lockit) client.lockit = [];
  const time = args.join(' ');
  const validUnlocks = ['release', 'unlock'];
  if (!time) return message.reply('You must set a duration for the lockdown in either hours, minutes or seconds');
  
 if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(`**${message.author.username}**, Sorry, you no have permissions to lock channels`).then(msg=>msg.delete(5000));
  if (validUnlocks.includes(time)) {
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: null
    }).then(() => {
      message.channel.send('Lockdown lifted.');
      clearTimeout(client.lockit[message.channel.id]);
      delete client.lockit[message.channel.id];
    }).catch(error => {
      console.log(error);
    });
  } else {
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: false
    }).then(() => {
       let embed = new Discord.RichEmbed()
           .setColor("RANDOM")
           .addField("⛔ Channel Locked 🚫", `<:loading:481473613808140289> Channel locked for ${ms(ms(time), { long:true })}`)
           .setFooter(`Locked By : ${message.author.tag}`);
                      
      
    message.channel.send(embed).then(() => {

       message.delete()
        client.lockit[message.channel.id] = setTimeout(() => {
          message.channel.overwritePermissions(message.guild.id, {
            SEND_MESSAGES: null
          }).then(message.channel.send('Lockdown lifted.')).catch(console.error);
          delete client.lockit[message.channel.id];
        }, ms(time));

      }).catch(error => {
        console.log(error);
      });
    });
  }
};

exports.conf = {
  aliases: ['lc'],
  cooldown: '5'
  }
  
exports.help = {
  name: 'lockchannel',
  description: "Lockdown a channel text",
  usage: "lockdown <time> (ex. e/lockdown 1h)"
}
