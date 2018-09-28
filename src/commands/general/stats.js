const Discord = require("discord.js");
const shard = require("discord.js");
const moment = require("moment");
const momentDurationFormat = require("moment-duration-format");
const momentTimezone = require("moment-timezone");
const os = require('os');
const arch = os.arch()

exports.run = async (bot, message, args) => {
    
  let bicon = bot.user.displayAvatarURL;
  let totalSeconds = (bot.uptime / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    let helpmember = new Discord.RichEmbed()
      .setColor('RANDOM')
      .addField("Bot Name", `${bot.user.tag}`)
      .addField("👑 Creator", "<@!327586923252285440> | undefined#7017")
      .addField("🗓️ Created At", `${moment(bot.user.createdAt).utcOffset('+0700').format("dddd, MMMM Do YYYY, HH:mm:ss")}`)
      .addField(`🎀 Playing With`, `**- ${bot.guilds.size} guilds.**\n**- ${bot.users.size} users.**`)
      .addField('🔬 Node', `${process.version}`)
      .addField('📡 Library', 'discord.js')
      .addField('💻 Operating System', `${os.platform} ${arch}`)
      .addField('📊 System Stats', `• Memory  ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB \n• Uptime ${uptime}`) // pake apa anjir
      .addField("📑 **Usefull link**", "[Invite me](https://discordapp.com/oauth2/authorize?client_id=483224327735476225&scope=bot&permissions=112327680) | [Vote me](https://discordbots.org/bot/483224327735476225/vote) | [Support Server](https://discord.gg/v9mc5hz)") 
      .setThumbnail(bicon)
      .setFooter(`Requested by: ${message.author.tag}`)
    message.channel.send(helpmember);
    
  /*if(`${args[0]}` == `gl`){
      
      if (message.author.id !== '327586923252285440') return message.channel.send("Sorry, you cant use this command !")
  
  var guildlist = bot.guilds.map(x => `⏩ ${x.name} (${x.id})`).join('\n')
  let index = 0;
  let kuy = (`**{++index} -**`)
        let pages = [`
${guildlist})
`]
        
        let page = 1;

       const embed = new Discord.RichEmbed()
       .setDescription(pages[page-1])
       .setColor('RANDOM')
       .setFooter(`Page ${page} Of ${pages.length}`)

    message.channel.send(embed).then(msg => {
      msg.react(`⏪`).then( r => {
        msg.react(`⏩`)
        const backwardsFilter = (reaction, user) => reaction.emoji.name === `⏪` && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === `⏩` && user.id === message.author.id;
        const backwards = msg.createReactionCollector(backwardsFilter, { time:600000 });
        const forwards = msg.createReactionCollector(forwardsFilter, { time:600000 });
        backwards.on('collect', r => {
          if (page === 1) return;
          page--;
          embed.setDescription(pages[page-1]);
          embed.setTimestamp()
          embed.setFooter(`Page ${page} Of ${pages.length}`);
          msg.edit(embed)
        })
        forwards.on('collect', r => {
          if (page === pages.length) return;
          page++;
          embed.setDescription(pages[page-1]);
          embed.setTimestamp()
          embed.setFooter(`Page ${page} Of ${pages.length}`);
          msg.edit(embed)
        })
    
      })
   
    })
        
        }*/
  
}

exports.conf = {
    aliases: ['st'],
    cooldown: '5'
}

exports.help = {
   name: "stats",
   description: "Show stats bot", 
   usage: "stats"
}
