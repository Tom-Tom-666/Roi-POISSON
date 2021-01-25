const Discord = require("discord.js");
const token = require("./token.json");
const bdd = require("./bdd.json");
const fs = require("fs");
const { match } = require("assert");
const { executionAsyncResource } = require("async_hooks");
const Canvas = require('canvas');
const moment = require('moment');
//const { fstat } = require("fs");


const bot = new Discord.Client();

bot.on("ready", async () => {
    console.log("Le bot est allumé");
    bot.user.setStatus("dnd");
    setTimeout(() => {
        bot.user.setActivity("Nolan t'es beau", { type: "STREAMING" });
    }, 100)
});

bot.on("guildMemberAdd", member => {
    if (bdd["message-bienvenue"]) {
        bot.channels.cache.get('787484359313326122').send(bdd["message-bienvenue"]);
    }                            // Modif chanelle
    else {
        bot.channels.cache.get('787484359313326122').send("Bienvenue sur le serveur");
    }                             // Modif chanelle 
    member.roles.add('787486229963735041');
    //modife role
})


bot.on("guildMemberAdd", async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./689183.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	// Add an exclamation point here and below
	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    bot.channels.cache.get('787484359313326122').send(attachment);

});






bot.on("message", message => {

    if (message.content.startsWith("$clear")) {
        message.delete();
        if (message.member.hasPermission('MANAGE_MESSAGES')) {

            let args = message.content.trim().split(/ +/g);

            if (args[1]) {
                if (!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99) {

                    message.channel.bulkDelete(args[1])
                    message.channel.send(`Vous avez supprimé ${args[1]} message(s)`)
                    message.channel.bulkDelete(1)

                }
                else {
                    message.channel.send(`Vous devez indiquer une valeur entre 1 et 99`)
                }
            }
            else {
                message.channel.send(`Vous devez indiquer un nombre de messages a supprimer !`)
            }
        }
        else {
            message.channel.send(`Vous devez avoir la permission de gérer les messages pour éxécuter cette commande !`)
        }
    }

    if (message.content.startsWith("$mb")) {
        message.delete()
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            if (message.content.length > 5) {
                message_bienvenue = message.content.slice(4)
                console.log(message_bienvenue)
                bdd["message-bienvenue"] = message_bienvenue
                savebdd()


            }
        }
    }

    if (message.content.startsWith("$warn")) {
        if (message.member.hasPermission('BAN_MEMBERS')) {

            if (!message.mentions.users.first()) return;
            utilisateur = message.mentions.users.first().id

            if (bdd["warn"][utilisateur] == 99) {

            }
            else {
                if (!bdd["warn"][utilisateur]) {
                    bdd["warn"][utilisateur] = 1
                    savebdd();
                    message.channel.send("Cheh tu as " + bdd["warn"][utilisateur] + " avertissement(s)");
                }
                else {
                    bdd["warn"][utilisateur]++
                    savebdd();
                    message.channel.send("Cheh tu as " + bdd["warn"][utilisateur] + " avertissements");

                }
            }
        }
    }

    //Statistique
    if (message.content.startsWith("$stats")) {
        let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalmembers = message.guild.members.cache.size;
        let totalservers = bot.guilds.cache.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
        let totalrole = message.guild.roles.cache.get('787486229963735041').members.map(member => member.user.tag).length;
        // Mofif roles

        const monembed = new Discord.MessageEmbed()
            .setColor('#ff3030')
            .setTitle('Statistique')
            .setURL('https://discord.js.org/')
            .setAuthor('Create by Tom', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('Voici les Statistique du serveur')
            .setThumbnail('https://media.gerbeaud.net/2019/11/640/amphiprion-ocellaris-poisson-clown-pacifique.jpg')
            .addFields(
                { name: 'Nombre de membres total', value: totalmembers, inline: true },
                { name: 'Nombre connéctés : ', value: onlines, inline: true },
                { name: 'Nombre de serveurs auquel le bot appartient : ', value: totalservers, inline: true },
                { name: 'Nombre de bots sur le serveur : ', value: totalbots, inline: true },
                { name: 'Nombre d\'arrivants : ', value: totalrole, inline: true },
            )
            .setImage('https://subaquatique.ca/wp-content/uploads/2018/08/Harlequin-Tusk.jpg')
            .setTimestamp()
            .setFooter('Nolan le plus beau', 'https://i.imgur.com/wSTFkRM.png');

        message.channel.send(monembed);

    }


    if (message.content.startsWith("$Test")) { // PAS FINI

        const monembed = new Discord.MessageEmbed()
            .setColor('#ff3030')
            .setTitle('Bienvenue sur le serveur de Nolan')
            .setURL('https://discord.gg/m5n5vSRmCc')
            .setAuthor('Create by Tom')
            .setDescription('Le serveur a étais crée le 12 décembre 2020.')
            .setThumbnail('https://media.gerbeaud.net/2019/11/640/amphiprion-ocellaris-poisson-clown-pacifique.jpg')
            .addFields(
                { name: 'Voici le reglement :' }, { name: 'La règle c’est qu’il n’y a pas de règle vous faites ce que vous voulez du moment que vous vous respectez les uns les autres aimez vous aimons nous :heart:' },
                )
            .setImage('https://subaquatique.ca/wp-content/uploads/2018/08/Harlequin-Tusk.jpg')
            .setTimestamp()
            .setFooter('Nolan le plus beau', 'https://i.imgur.com/wSTFkRM.png');

        message.channel.send(monembed); // PAS FINI

    }






    if (message.content.startsWith('$lvl')) {
        if (bdd["statut-level"] == true) {
            bdd["statut-level"] = false
            Savebdd();
            return message.channel.send('Vous venez d\'arreter le système de level !');
        }
        else {
            bdd["statut-level"] = true;
            Savebdd();
            return message.channel.send('Vous venez d\'alumer le système de level !');

        }

    }
    if (bdd["statut-level"] == true) {
        if (message.content.startsWith('$level')) {
            if (!bdd["coins-utilisateurs"][message.member.id]) {
                return message.channel.send(`Nous n'avez pas encore posté de message !`)
            } else {
                return message.channel.send(`Vous avez ${bdd["coins-utilisateurs"][message.member.id]} points !\nEt vous êtes au level n°${bdd["level-utilisateurs"][message.member.id]}`)
            }
        }
        else {
            addRandomInt(message.member);
            if (!bdd["coins-utilisateurs"][message.member.id]) {
                bdd["coins-utilisateurs"][message.member.id] = Math.floor(Math.random() * (4 - 1) + 1);
                bdd["level-utilisateurs"][message.member.id] = 0
                Savebdd();
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 100 && bdd["coins-utilisateurs"][message.member.id] < 250) {
                if (bdd["level-utilisateurs"][message.member.id] == 0) {
                    bdd["level-utilisateurs"][message.member.id] = 1;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 1 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 250 && bdd["coins-utilisateurs"][message.member.id] < 500) {
                if (bdd["level-utilisateurs"][message.member.id] == 1) {
                    bdd["level-utilisateurs"][message.member.id] = 2;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 2 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 500 && bdd["coins-utilisateurs"][message.member.id] < 1000) {
                if (bdd["level-utilisateurs"][message.member.id] == 2) {
                    bdd["level-utilisateurs"][message.member.id] = 3;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 3 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 1000 && bdd["coins-utilisateurs"][message.member.id] < 1250) {
                if (bdd["level-utilisateurs"][message.member.id] == 3) {
                    bdd["level-utilisateurs"][message.member.id] = 4;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 4 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 1250 && bdd["coins-utilisateurs"][message.member.id] < 1500) {
                if (bdd["level-utilisateurs"][message.member.id] == 4) {
                    bdd["level-utilisateurs"][message.member.id] = 5;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 5 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 1500 && bdd["coins-utilisateurs"][message.member.id] < 2000) {
                if (bdd["level-utilisateurs"][message.member.id] == 5) {
                    bdd["level-utilisateurs"][message.member.id] = 6;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 6 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 2000 && bdd["coins-utilisateurs"][message.member.id] < 2500) {
                if (bdd["level-utilisateurs"][message.member.id] == 6) {
                    bdd["level-utilisateurs"][message.member.id] = 7;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 7 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 2650 && bdd["coins-utilisateurs"][message.member.id] < 3000) {
                if (bdd["level-utilisateurs"][message.member.id] == 7) {
                    bdd["level-utilisateurs"][message.member.id] = 8;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 8 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 3250 && bdd["coins-utilisateurs"][message.member.id] < 3500) {
                if (bdd["level-utilisateurs"][message.member.id] == 8) {
                    bdd["level-utilisateurs"][message.member.id] = 9;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 9 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 3500 && bdd["coins-utilisateurs"][message.member.id] < 4000) {
                if (bdd["level-utilisateurs"][message.member.id] == 9) {
                    bdd["level-utilisateurs"][message.member.id] = 10;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 10 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 4000 && bdd["coins-utilisateurs"][message.member.id] < 4500) {
                if (bdd["level-utilisateurs"][message.member.id] == 10) {
                    bdd["level-utilisateurs"][message.member.id] = 11;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 11 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 4500 && bdd["coins-utilisateurs"][message.member.id] < 5000) {
                if (bdd["level-utilisateurs"][message.member.id] == 11) {
                    bdd["level-utilisateurs"][message.member.id] = 12;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 12 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 5000 && bdd["coins-utilisateurs"][message.member.id] < 5500) {
                if (bdd["level-utilisateurs"][message.member.id] == 12) {
                    bdd["level-utilisateurs"][message.member.id] = 13;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 13 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 5500 && bdd["coins-utilisateurs"][message.member.id] < 6000) {
                if (bdd["level-utilisateurs"][message.member.id] == 13) {
                    bdd["level-utilisateurs"][message.member.id] = 14;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 14 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 6000 && bdd["coins-utilisateurs"][message.member.id] < 7000) {
                if (bdd["level-utilisateurs"][message.member.id] == 14) {
                    bdd["level-utilisateurs"][message.member.id] = 15;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 15 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 7000 && bdd["coins-utilisateurs"][message.member.id] < 8500) {
                if (bdd["level-utilisateurs"][message.member.id] == 15) {
                    bdd["level-utilisateurs"][message.member.id] = 16;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 16 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 8500 && bdd["coins-utilisateurs"][message.member.id] < 9000) {
                if (bdd["level-utilisateurs"][message.member.id] == 16) {
                    bdd["level-utilisateurs"][message.member.id] = 17;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 17 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 9000 && bdd["coins-utilisateurs"][message.member.id] < 10000) {
                if (bdd["level-utilisateurs"][message.member.id] == 17) {
                    bdd["level-utilisateurs"][message.member.id] = 18;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 18 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 10500 && bdd["coins-utilisateurs"][message.member.id] < 11000) {
                if (bdd["level-utilisateurs"][message.member.id] == 18) {
                    bdd["level-utilisateurs"][message.member.id] = 19;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 19 !`);
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 11000) {
                if (bdd["level-utilisateurs"][message.member.id] == 19) {
                    bdd["level-utilisateurs"][message.member.id] = 20;
                    Savebdd();
                    return message.channel.send(`Bravo ${message.author} tu es passé niveau 20 !`);
                }
            }

        }

    }

    if (message.content.startsWith('$love')) {
        if(!message.mentions.members.first()) return message.channel.send(`Veuillez mentionner quelqu'un pour calculer le pourcentage d'amour`).then(message.react('❌'));
        let person = message.mentions.members.first(message);
        Savebdd();
        const love = Math.round(Math.random() * 100);
        const loveIndex = Math.floor(love / 10);
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);
        Savebdd();
        let loveEmbed = new Discord.MessageEmbed()
        .setTitle("Love percentage")
        .setDescription(`${message.author} loves ${person} this much: ${love}%\n\n${loveLevel}`)
        message.channel.send(loveEmbed)
        Savebdd();
    }




})


function addRandomInt(member) {
        bdd["coins-utilisateurs"][member.id] = bdd["coins-utilisateurs"][member.id] + Math.floor(Math.random() * (4 - 1) + 1);
        Savebdd();
    }

function Savebdd() {
        fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
            if (err) message.channel.send("Une erreur est survenue.")
        });
    }

bot.login(token.token);

//savebdd();

 //else if (bdd["coins-utilisateurs"][message.member.id] > 1000 && bdd["coins-utilisateurs"][message.member.id] < 1250) {
    //if (bdd["level-utilisateurs"][message.member.id] == 3) {
        //bdd["level-utilisateurs"][message.member.id] = 4;
        //savebdd();
       // return message.channel.send(`Bravo ${message.author} tu es passé niveau 20 !`);
   // }
 //}