const ytdl = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const Discord = require('discord.js')
const botconfig = require('../botconfig.json')
let red = botconfig.red
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('../botconfig.json'); 
const youtube = new YouTube("AIzaSyCY3Cuwh6UxLKNCJwf-6Yd7F5g3w3cQ2YQ");
const { Client, Util, RichEmbed, Message } = require('discord.js');
const queue = new Discord.Collection();
  
module.exports.run = async (bot, msg, args) => {
  
  
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
  
  if(`${args[0]}` == `queue`){
    
    if (!serverQueue) return msg.channel.send({ embed: { description: 'There is nothing playing.'}});
    let index = 0;
var queueembed = new RichEmbed() 

.setColor('RANDOM') 
.setTitle('Song queue') 
.setDescription(`${serverQueue.songs.map(song => `**${++index}.** ${song.title}`).join('\n')}`) 


return msg.channel.send(queueembed)
  }
  
  if(`${args[0]}` == `loopon`){
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
  
  if(`${args[0]}` == `loopoff`){
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
  
  if(`${args[0]}` == `pause`){
    if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send({ embed: { description: '⏸ Paused the music for you!'}});
		}
		return msg.channel.send({ embed: { description: 'There is nothing playing.'}});
  }
  
  if(`${args[0]}` == `resume`){
    
    if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send({ embed: { description: '▶ Resumed the music for you!'}});
		}
		return msg.channel.send({ embed: { description: 'There is nothing playing.'}});
  return undefined;
}

  if(`${args[0]}` == `play`){
    const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send({ embed: { description: 'I\'m sorry but you need to be in a voice channel to play music!'}});
    if (!args[1]) return msg.channel.send({ embed: { color: 'RANDOM', description: `*Correct usage is*: **${PREFIX}play** ***[Song Name]/[Video URL]/[Playlist URL]***`}});
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send({ embed: { description: 'I cannot connect to your voice channel, make sure I have the proper permissions!'}});
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send({ embed: { description: 'I cannot speak in this voice channel, make sure I have the proper permissions!'}});
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send({ embed: { description: `✅ Playlist: **${playlist.title}** has been added to the queue!`}});
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					
 var selectembed = new RichEmbed()
 .setColor('RANDOM') 
 .setTitle('Song selection')
 .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`) 
 .setFooter('Please provide a value to select one of the search results ranging from 1-10') 
 
let msgtoDelete = await msg.channel.send({ embed: selectembed})
					
					
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 30000,
							errors: ['time']
						});
            msgtoDelete.delete();
					} catch (err) {
						console.error(err);
						const noPick = new RichEmbed()
            .setDescription("No or invalid value entered, cancelling video selection.")
            .setColor('RANDOM')
            msg.channel.send({embed: noPick});
            msgtoDelete.delete()
            return;
					}
          
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
}
  if(`${args[0]}` == `play`){
    const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send({ embed: { description: 'I\'m sorry but you need to be in a voice channel to play music!'}});
    if (!args[2]) return msg.channel.send({ embed: { color: 'RANDOM', description: `*Correct usage is*: **${PREFIX}play** ***[Song Name]/[Video URL]/[Playlist URL]***`}});
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send({ embed: { description: 'I cannot connect to your voice channel, make sure I have the proper permissions!'}});
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send({ embed: { description: 'I cannot speak in this voice channel, make sure I have the proper permissions!'}});
		}
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, msg, voiceChannel, true);
			}

    let info = await ytdl.getInfo(args[2]);
    let title = await ytdl.getTitle(args[2]);
    let connection = await msg.member.voiceChannel.join();
    let dispatcher = await connection.play(ytdl(args[2], {
        filter: 'audioonly'
    }));
    return msg.channel.send({ embed: { description: `✅ Playlist: **${playlist.title}** has been added to the queue!`}});
}
  }
  if(`${args[0]}` == `forceskip`){
    if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'You are not in a voice channel!'}});
		if (!serverQueue) return msg.channel.send({ embed: { description: 'There is nothing playing that I could skip for you.'}});
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
  }
  if(`${args[0]}` == `skip`){
    
		if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'You are not in a voice channel!'}});
		if (!serverQueue) return msg.channel.send({ embed: { description: 'There is nothing playing that I could skip for you.'}});
    let userCount = msg.member.voiceChannel.members.size;
    let required = Math.ceil(userCount/5);
    if (!serverQueue.songs[0].voteSkips) serverQueue.songs[0].voteSkips = [];
    if (!serverQueue.songs[0].voteSkips.includes(msg.member.id)) return msg.reply(`You already vote! ${serverQueue[0].voteSkips.length}/${required} required.`);
    serverQueue.songs[0].voteSkips.push(msg.member.id);
    if (serverQueue.songs[0].voteSkips.length >= required) {
      msg.reply('Successfully skipped song!')
      return;
    }
    msg.reply(`Successfuly vote! ${serverQueue.connection[0].voteSkips.length}/${required} required`)
		if (serverQueue.connection.dispatcher.end) return msg.channel.send('Skip command has been used!');
		return undefined;
  }
  if(`${args[0]}` == `stop`){
 if (!msg.member.roles.find("name", "DJ")) return msg.channel.send, "You need **DJ** role for use this command.", {
        name: 'Tomori Errors',
        icon: 'https://cdn.discordapp.com/avatars/492600047268134912/cfc55222f1e582e3c067aeecb842a2fa.png?size=2048?size=2048'
    }
		if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'You are not in a voice channel!'}});
		if (!serverQueue) return msg.channel.send({ embed: { description: 'There is nothing playing that I could stop for you.'}});
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return msg.channel.send({ embed: { color: 'RANDOM', description: 'The music has stopped and I has left the voice channel!'}});
  }
  if(`${args[0]}` == `volume`){
    if (!msg.member.roles.find("name", "DJ")) return msg.channel.send, "You need **DJ** role for use this command.", {
        name: 'Tomori Errors',
        icon: 'https://cdn.discordapp.com/avatars/492600047268134912/cfc55222f1e582e3c067aeecb842a2fa.png?size=2048?size=2048'
    }
    if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'You are not in a voice channel!'}});
		if (!serverQueue) return msg.channel.send({ embed: { description: 'There is nothing playing.'}});
    var botRoleColorSync = msg.guild.member(bot.user).highestRole.color;
		if (!args[1]) return msg.channel.send({embed: { color: 'RANDOM',  description: `The current volume is: **${serverQueue.volume}**%`}});
		serverQueue.volume = args[1];
    if (args[1] > 100) return msg.channel.send({ embed: { description: `${msg.author} Volume limit is 100%, please do not hurt yourself!`}});
    serverQueue.volume = args[1];
    if (args[1] > 100) return !serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100) +
    msg.channel.send({ embed: { description: `${msg.author} Volume limit is 100%, please do not hurt yourself!`}});
 
    if (args[1] < 101) return serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100) + msg.channel.send({ embed: { description: `I set the volume to: __**${args[1]}**%__`}});
	}
 if(`${args[0]}` == `np`){
   
   if(!serverQueue) return msg.channel.send({ embed: { color: 'RANDOM', description:'There is nothing playing'}});
  const duration = (serverQueue.songs[0].duration.minutes*60000) + ((serverQueue.songs[0].duration.seconds%60000)*1000);
  const persentase = serverQueue.connection.dispatcher.time/duration;
  const curentDurationMinute = Math.floor(serverQueue.connection.dispatcher.time/60000) < 10 ? `0${Math.floor(serverQueue.connection.dispatcher.time/60000)}` : Math.floor(serverQueue.connection.dispatcher.time/60000);
  const currentDurationSeconds = Math.floor((serverQueue.connection.dispatcher.time%60000)/1000) < 10 ? `0${Math.floor((serverQueue.connection.dispatcher.time%60000)/1000)}` : Math.floor((serverQueue.connection.dispatcher.time%60000)/1000);
  const endDurationMinute = serverQueue.songs[0].duration.minutes < 10 ? `0${serverQueue.songs[0].duration.minutes}` : serverQueue.songs[0].duration.minutes;
  const endDurationSeconds = serverQueue.songs[0].duration.seconds < 10 ? `0${serverQueue.songs[0].duration.seconds}` : serverQueue.songs[0].duration.seconds;
  
  const emb = new RichEmbed()
  .setColor('RANDOM')
  .setAuthor(serverQueue.songs[0].author.tag, serverQueue.songs[0].author.avatarURL)
  .setTitle(serverQueue.songs[0].title)
  .setURL(serverQueue.songs[0].url)
  .setThumbnail(serverQueue.songs[0].thumbnail)
  .setDescription(`${progressBar(persentase)} \n\`[${curentDurationMinute}:${currentDurationSeconds} - ${endDurationMinute}:${endDurationSeconds}]\`🔊`);
  
  return msg.channel.send('🎶 **Now playing...**', { embed: emb});
};

function progressBar(percent){
	let num = Math.floor(percent*15);
	if(num === 1){
		return '🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 2){
		return '▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 3){
		return '▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 4){
		return '▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 5){
		return '▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 6){
		return '▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬';
	}else if(num === 7){
		return '▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬';
	}else if(num === 8){
		return '▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬';
	}else if(num === 9){
		return '▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬';
	}else if(num === 10){
		return '▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬';
	}else if(num === 11){
		return '▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬';
	}else if(num === 12){
		return '▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬';
	}else if(num === 13){
		return '▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬';
  }else if (num === 14){
		return '▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬';
  }else{
		return '▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘';
  }

}
  async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	//console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`, 
    durationh: video.duration.hours,
		durationm: video.duration.minutes,
		durations: video.duration.seconds,
    duration: video.duration,   
    mamang: msg.member.voiceChannel.name, 
    meminta: msg.author,
    upload: video.author,
    loop: video.loop,
    author: msg.author};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 100,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send({ embed: { description: `I could not join the voice channel: ${error}`}});
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
  
var adedembed = new RichEmbed() 

  .setColor('RANDOM')
  .setAuthor(`Added to Queue`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  .addField('Title', `__[${song.title}](${song.url})__`, true)
  .addField('Video ID', `${song.id}`, true)
  .addField("Duration", `${song.durationh}hrs ${song.durationm}mins ${song.durations}secs`, true)
  .addField('Requested by', `${song.meminta}`)
  .setTimestamp();
		
 return msg.channel.send(adedembed);
	}
	return undefined;
}

function play(guild, song, msg) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
var pleyembed = new RichEmbed() 

  .setColor('RANDOM')
  .setAuthor(`Start Playing`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  .addField('Title', `__[${song.title}](${song.url})__`, true)
  .addField('Video ID', `${song.id}`, true)
  .addField("Volume", `${serverQueue.volume}%`, true)
  .addField("Duration", `${song.durationh}hrs ${song.durationm}mins ${song.durations}secs`, true)
  .addField('Voice Channel', `**${song.mamang}**`)
  .addField('Requested by', `${song.meminta}`)
  .setFooter("If you can't hear the music, please reconnect. If you still can't hear maybe the bot is restarting!")
  .setTimestamp();

	serverQueue.textChannel.send(pleyembed);
  
}
}
  
exports.help = {
    name: "m",
    description: "Play u song",
    usage: " play (link or title)"
}
