const Discord = require("discord.js") 

exports.run = async (bot, message, args) => {
  
 const WxArtzEmbedBiarSyantik = require('discord.js').RichEmbed;

	let number = bot.guilds.array().sort().map((x,i) => `\`${i+1}\` - ${x.name}`)//.join('\n')
	number = chunk(number, 10);

	let index = 0;
  const ge = new WxArtzEmbedBiarSyantik()
  .setColor("RANDOM")
  .setAuthor(`🌍 | Guild List [${bot.guilds.size}]`, message.author.displayAvatarURL)
  .setDescription(number[index].join('\n'))
  .setFooter(`Page ${index+1} of ${number.length}`)
	const m = await message.channel.send(ge);
	await m.react('⬅');
  await m.react('🔴');
	await m.react('➡');
	async function awaitReaction(){
    const filter =(rect, usr) => ['⬅', '🔴','➡' ].includes(rect.emoji.name) && usr.id === message.author.id
		const response = await m.awaitReactions(filter, {
			max: 1,
			time: 30000
		});
		if(!response.size){
			return undefined;
		}
		const emoji = response.first().emoji.name;
		if(emoji === '⬅') index--;
    if(emoji === '🔴')  m.delete();
		if(emoji === '➡') index++;
    
		index = ((index % number.length) + number.length) % number.length;
		ge.setDescription(number[index].join('\n'))
    ge.setFooter(`Page ${index+1} of ${number.length}`)
		await m.edit(ge);
		return awaitReaction();
	}
	return awaitReaction();

}
function chunk(array, chunkSize) {
    const temp = [];
    for(let i = 0; i < array.length; i+= chunkSize){
      temp.push(array.slice(i, i+chunkSize));
    }
    return temp;
  }
  
exports.conf = {
  aliases: ['gl'],
  cooldown: '5'
  }
  
exports.help = {
  name: "guildlist"
  description: "Show guild list",
  usage: "guildlist"
}
