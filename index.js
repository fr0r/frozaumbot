const Discord = require ("discord.js"); 
const YTDL = require("ytdl-core");

const PREFIX = "flor-"

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var fortunes = [
    "Sim",
    "Não",
    "Provalvemente",
    "seu cu"
];

var bot = new Discord.Client();

var servers = {};

bot.on("message", function(message) {
    console.log("Em funcionamento");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
        message.channel.sendMessage("Pong!");
        break;
        case "info":
        message.channel.sendMessage("Versão beta 1.0 // Esse bot foi feito para testar funções legais do Discord // Criador: @frozaum");
        break;
        case "8ball":
        if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
        else message.channel.sendMessage("Não entendi o que você digitou, poderia repetir?");
        break;
        case "play":
        if (!args[1]) {
            message.channel.sendMessage("Por favor coloque o link junto com o comando okay ;)");
            return;
        }

        if (!message.member.voiceChannel) {
            message.channel.sendMessage("Você tem que estar num  canal de voz :(");
            return;
        }

        if(!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        };
        
        var server = servers[message.guild.id];

        server.queue.push(args[1]);

        if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
            play(connection, message);
        }); 
        break;
    case "skip":
    var server = servers[message.guild.id];

    if (server.dispatcher) server.dispatcher.end();
    break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        default:
        message.channel.sendMessage("Comando inválido :(")
    }
});

client.login(process.env.BOT_TOKEN);
