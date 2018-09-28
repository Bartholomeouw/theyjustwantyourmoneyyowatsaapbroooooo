  const queue = new Discord.Collection();
  
module.exports.run = async (bot, msg, args) => {
  
  
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
  
  message.channel.send("Please Toogle Loop On Or Off ! (ex. e/loop on)")
  
  if(`${args[0]}` == `on`){
	if (!msg.member.voiceChannel) return msg.channel.send('You must join voice channel first');
	if(serverQueue.voiceChannel.id !== msg.member.voiceChannel.id) return msg.channel.send(`You must be in **${serverQueue.voiceChannel.name}** to loop the queue`);
	if(!serverQueue) return msg.channel.send('Are you sure? nothing to loop because queue is empty');
	try{
		serverQueue.loop = true;
		if (serverQueue.loop) return msg.channel.send(':repeat_one:loop is on');
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
  }
  
  if(`${args[0]}` == `off`){
	if (!msg.member.voiceChannel) return msg.channel.send('You must join voice channel first');
	if(serverQueue.voiceChannel.id !== msg.member.voiceChannel.id) return msg.channel.send(`You must be in **${serverQueue.voiceChannel.name}** to loop the queue`);
	if(!serverQueue) return msg.channel.send('Are you sure? nothing to loop because queue is empty');
	try{
		serverQueue.loop = false;
		if (serverQueue.loop) return msg.channel.send(':repeat_one:loop is on');
	}catch(e){
		return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
	}
  }
  
  exports.conf = {
     aliases: ['ql'],
     cooldown: '5'
     }
   exports.help = {
      name: "loop",
      description: "Loop your queue",
      usage: "loop on or off"
      }
