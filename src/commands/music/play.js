const ytdl = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const Discord = require('discord.js')
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY // 
const youtube = new YouTube("GOOGLE_API_KEY");
const queue = new Discord.Collection();
  
exports.run = async (bot, msg, args) => {
  //args = args.slice(0)
  const searchString = args.join(' ');
	const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = bot.queue.get(msg.guild.id);
  
  	const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return 
    let embed = new Discord.RichEmbed()
		     .setColor("RANDOM")
         .setTitle(`✅ **${playlist.title}** has been added to queue`)
         .setFooter(`Music Added by : ${msg.author.tag}`);
      msg.channel.send(embed);
      
    } else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('No or invalid value entered, cancelling video selection.');
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
  async function handleVideo(video, message, voiceChannel, playlist = false) {
	var serverQueue = bot.queue.get(message.guild.id);
	console.log(video);
	var song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`,
    loop:false
	};
	if (!serverQueue) {
		var queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		bot.queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			bot.queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return 
   const embed = new Discord.RichEmbed()
           .setColor("RANDOM")
           .setTitle(`✅ **${song.tittle}** has been added to queue`)
           .setFooter(`Song Added By : ${message.author.tag}`);
     msg.channel.send(embed)

	}
	return undefined;
}
  function play(guild, song) {
	var serverQueue = bot.queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		bot.queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
      msg.channel.send('``The queue of song is end.``');
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}
}

exports.conf = {
   aliases: ['p'],
   cooldown: '10'
   }
  
exports.help = {
    name: "play",
    description: "Play your music.",
    usage: "play <title or url> (ex. e/play Erickolim)"

}
