const ytdl = require("ytdl-core");
const YouTube = require("simple-youtube-api");
const Discord = require('discord.js')
const botconfig = require('.../config.json')
let red = botconfig.red
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('.../config.json'); 
const youtube = new YouTube("AIzaSyCY3Cuwh6UxLKNCJwf-6Yd7F5g3w3cQ2YQ");
const { Client, Util, RichEmbed, Message } = require('discord.js');
const queue = new Discord.Collection();
  
module.exports.run = async (bot, msg, args) => {
  
  
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);



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
    
  exports.conf = {
      aliases: ['p'],
      cooldown: '5'
   }
   
   exports.help = {
       name: "play",
       description: "Play a music",
       usage: "play <title | url>"
       
   }
