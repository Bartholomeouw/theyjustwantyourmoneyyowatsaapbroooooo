exports.run = async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`**${message.author.username}**, Sorry, you cant use this command !`).then(msg=>msg.delete(5000));
    if (!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) return message.channel.send(`**${message.author.username}**, Sorry, i am not have permissions \`MANAGE_MESSAGES\` to clear message.`).then(msg=>msg.delete(5000));

    if (args[0] > 100) return message.channel.send(`**${message.author.username}**, You can only delete up to **100** message`)
    let count = parseInt(args[0]) || 1;
    await message.delete();

    message.channel.fetchMessages({ limit: Math.min(count, 100) })
    .then(messages => {
        message.channel.bulkDelete(messages);
        message.channel.send(`Successfully delete messages. Total messages deleted ${count}`).then(msg=>msg.delete(5000));
    }).catch(err => {
        console.log(err);
    });
}

exports.conf = {
    aliases: ['c'],
    cooldown: '5'
    }

exports.help = {
    name: "clear",
    description: "Clear message",
    usage: "clear (total message)"
}
