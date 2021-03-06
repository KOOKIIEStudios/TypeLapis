import { 
    Discord,
    Command,
    CommandMessage,
    Description
 } from "@typeit/discord";
import { Client } from "@typeit/discord";
import { MessageEmbed } from "discord.js";
import config = require("../config.json");
import jobs = require("../jobs.json");
import { getOnlinePlayersAmount, getCharacterByName } from "../database"


function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

@Discord(config.commandPrefix)
@Description("All User commands handlers.")
export abstract class UserCommands {

    @Command("help")
    private handleHelp(message: CommandMessage) {
        let commands = Client.getCommands();
        let commandString = "";
        const messageEmbed = new MessageEmbed()
        .setTitle("Commands")
        .setColor(0x0000ff)
        .setThumbnail(config.serverImg)
        .setDescription(`All bot commands for ${config.serverName}`);

        for(let index in commands) {
            let commandInfo = commands[index];
            let description = commandInfo["commandName"];

            commandString += description + "\n";
        }

        messageEmbed.addField("Bot Commands", commandString, false);

        message.channel.send(messageEmbed);
    }

    @Command("info")
    private handleInfo(message: CommandMessage) {
        const serverInfo = {
            'Exp': '1x',
            'Item': '1x',
            'Meso': '1x',
            'Server State': 'N/A',
            'Server Location': 'N/A',
            'Release Date': 'N/A',
        };

        const messageEmbed = new MessageEmbed()
        .setColor(0x0000ff)
        .setTitle(config.serverName)
        .setDescription("KMS v316")
        .setThumbnail(config.serverImg);

        for (let key in serverInfo) {
            let value = serverInfo[key];
            messageEmbed.addField(key, value, true);
        }

        messageEmbed.setFooter(config.serverName);

        message.channel.send(messageEmbed);
    }

    @Command("online")
    private handleOnline(message: CommandMessage) {
        var promise = getOnlinePlayersAmount().then((value) => {

            let isPlural = (value > 1) ? "players" : "player";
        
            const messageEmbed = new MessageEmbed()
            .setTitle("Players Online")
            .setDescription(`${value} ${isPlural} online.`)
            .setColor(0x000FF00)
            .setThumbnail(config.serverImg)
            .setFooter(config.serverName);
    
            message.channel.send(messageEmbed);
        });
    }

    @Command("character")
    private handleCharacter(message: CommandMessage) {
        let args = message.content.split(" ");
        if(args.length < 2) {
            message.channel.send("Please provide a character name! !character <name>");
            return;
        }
        
        let name = args[1];

        var promise = getCharacterByName(name).then((character) => {
            if(character == null) {
                message.channel.send("Character does not exist.")
                return;
            }
            
            const messageEmbed = new MessageEmbed()
            .setTitle("Character Info")
            .setColor(0x00FF00)
            .setDescription(`${character.name}'s Info/Stats`)
            .setThumbnail(config.serverImg)
            .setFooter(config.serverName);

            messageEmbed.addField("IGN", character.name, true);
            messageEmbed.addField("Fame", character.fame, true);
            messageEmbed.addField("Level", character.level, true);
            messageEmbed.addField("Mesos", numberWithCommas(character.meso), true);
            messageEmbed.addField("Job", jobs[character.job], true);

            message.channel.send(messageEmbed);

        });
    }
}