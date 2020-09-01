const Discord = require("discord.js");
const client = new Discord.Client();
const Canvas = require("canvas");
const moment = require("moment");
const zalgo = require("zalgolize");
const math = require("math-expression-evaluator");
const figlet = require("figlet");
const fs = require("fs");
const ms = require("ms");
const prefix = ".";

client.on("ready", () => {
client.user.setActivity(`.help`,  { type: "Playing" });
client.user.setStatus("online");
});



 

//......
let anti = JSON.parse(fs.readFileSync("./antigreff.json", "UTF8"));
let config = JSON.parse(fs.readFileSync("./server.json", "UTF8"));
client.on("message", message => {
  if (!message.channel.guild) return;
  let user = anti[message.guild.id + message.author.id];
  let num = message.content
    .split(" ")
    .slice(2)
    .join(" ");
  if (!anti[message.guild.id + message.author.id])
    anti[message.guild.id + message.author.id] = {
      actions: 0
    };
  if (!config[message.guild.id])
    config[message.guild.id] = {
      banLimit: 3,
      chaDelLimit: 3,
      roleDelLimit: 3,
      kickLimits: 3,
      roleCrLimits: 3,
      time: 30
    };
  if (message.content.startsWith(prefix + "anti")) {
    if (message.author.id !== message.guild.owner.user.id)
      return message.channel.send(`**You can not do that**`);
    if (message.content.startsWith(prefix + "anti ban")) {
      if (!num) return message.channel.send("**👉 | How much do you know? ! **");
      if (isNaN(num)) return message.channel.send("**⇏ | This is the number ! **");
      config[message.guild.id].banLimit = num;
      message.channel.send(
        `**⇏ | They are forgiven : ${config[message.guild.id].banLimit} **`
      );
    }
    if (message.content.startsWith(prefix + "anti kick")) {
      if (!num) return message.channel.send("**👉 | How much do you know? ! **");
      if (isNaN(num)) return message.channel.send("**⇏ | This is the number ! **");
      config[message.guild.id].kickLimits = num;
      message.channel.send(
        `**⇏ | They are forgiven : ${config[message.guild.id].kickLimits}**`
      );
    }
    if (message.content.startsWith(prefix + "anti rolesD")) {
      if (!num) return message.channel.send("**👉 | How much do you know? ! **");
      if (isNaN(num)) return message.channel.send("**⇏ | This is the number ! **");
      config[message.guild.id].roleDelLimit = num;
      message.channel.send(
        `**⇏ | You will be a band tied to that role: ${config[message.guild.id].roleDelLimit}**`
      );
    }
    if (message.content.startsWith(prefix + "anti rolesC")) {
      if (!num) return message.channel.send("**👉 | How much do you know? ! **");
      if (isNaN(num)) return message.channel.send("**⇏ | This is the number ! **");
      config[message.guild.id].roleCrLimits = num;
      message.channel.send(
        `**⇏ | You will be a band tied to that role: ${config[message.guild.id].roleCrLimits}**`
      );
    }
    if (message.content.startsWith(prefix + "anti channelD")) {
      if (!num) return message.channel.send("**👉 | How much do you know? ! **");
      if (isNaN(num)) return message.channel.send("**⇏ | This is the number ! **");
      config[message.guild.id].chaDelLimit = num;
      message.channel.send(
        `**⇏ | You will be banded with so many channels : ${config[message.guild.id].chaDelLimit}**`
      );
    }
    if (message.content.startsWith(prefix + "settings limitstime")) {
      if (!num) return message.channel.send("**👉 | A few points ! **");
      if (isNaN(num)) return message.channel.send("**👉 | This is the number ! **");
      config[message.guild.id].time = num;
      message.channel.send(
        `**⇏ | So fast : ${config[message.guild.id].time}**`
      );
    }
    fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
      if (e) throw e;
    });
    fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
      e
    ) {
      if (e) throw e;
    });
  }
});
client.on("channelDelete", async channel => {
  const entry1 = await channel.guild
    .fetchAuditLogs({
      type: "CHANNEL_DELETE"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;
  if (!config[channel.guild.id])
    config[channel.guild.id] = {
      banLimit: 3,
      chaDelLimit: 3,
      roleDelLimit: 3,
      kickLimits: 3,
      roleCrLimits: 3
    };
  if (!anti[channel.guild.id + entry.id]) {
    anti[channel.guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
  } else {
    anti[channel.guild.id + entry.id].actions = Math.floor(
      anti[channel.guild.id + entry.id].actions + 1
    );
    console.log("TETS");
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
    if (
      anti[channel.guild.id + entry.id].actions >=
      config[channel.guild.id].chaDelLimit
    ) {
      channel.guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          channel.guild.owner.send(
            `**⇏ | ${entry.username}  That’s your role**`
          )
        );
      anti[channel.guild.id + entry.id].actions = "0";
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

client.on("roleDelete", async channel => {
  const entry1 = await channel.guild
    .fetchAuditLogs({
      type: "ROLE_DELETE"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;
  if (!config[channel.guild.id])
    config[channel.guild.id] = {
      banLimit: 3,
      chaDelLimit: 3,
      roleDelLimit: 3,
      kickLimits: 3,
      roleCrLimits: 3
    };
  if (!anti[channel.guild.id + entry.id]) {
    anti[channel.guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
  } else {
    anti[channel.guild.id + entry.id].actions = Math.floor(
      anti[channel.guild.id + entry.id].actions + 1
    );
    console.log("TETS");
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
    if (
      anti[channel.guild.id + entry.id].actions >=
      config[channel.guild.id].roleDelLimit
    ) {
      channel.guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          channel.guild.owner.send(
            `**⇏ | ${entry.username} That’s your role **`
          )
        );
      anti[channel.guild.id + entry.id].actions = "0";
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

client.on("roleCreate", async channel => {
  const entry1 = await channel.guild
    .fetchAuditLogs({
      type: "ROLE_CREATE"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;
  if (!config[channel.guild.id])
    config[channel.guild.id] = {
      banLimit: 3,
      chaDelLimit: 3,
      roleDelLimit: 3,
      kickLimits: 3,
      roleCrLimits: 3
    };
  if (!anti[channel.guild.id + entry.id]) {
    anti[channel.guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
  } else {
    anti[channel.guild.id + entry.id].actions = Math.floor(
      anti[channel.guild.id + entry.id].actions + 1
    );
    console.log("TETS");
    setTimeout(() => {
      anti[channel.guild.id + entry.id].actions = "0";
    }, config[channel.guild.id].time * 1000);
    if (
      anti[channel.guild.id + entry.id].actions >=
      config[channel.guild.id].roleCrLimits
    ) {
      channel.guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          channel.guild.owner.send(
            `**⇏ | ${entry.username} This created a role**`
          )
        );
      anti[channel.guild.id + entry.id].actions = "0";
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

client.on("guildBanAdd", async (guild, user) => {
  const entry1 = await guild
    .fetchAuditLogs({
      type: "MEMBER_BAN_ADD"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;
  if (!config[guild.id])
    config[guild.id] = {
      banLimit: 3,
      chaDelLimit: 3,
      roleDelLimit: 3,
      kickLimits: 3,
      roleCrLimits: 3
    };
  if (!anti[guild.id + entry.id]) {
    anti[guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[guild.id + entry.id].actions = "0";
    }, config[guild.id].time * 1000);
  } else {
    anti[guild.id + entry.id].actions = Math.floor(
      anti[guild.id + entry.id].actions + 1
    );
    console.log("TETS");
    setTimeout(() => {
      anti[guild.id + entry.id].actions = "0";
    }, config[guild.id].time * 1000);
    if (anti[guild.id + entry.id].actions >= config[guild.id].banLimit) {
      guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          guild.owner.send(`**⇏ | ${entry.username} I banned this member **`)
        );
      anti[guild.id + entry.id].actions = "0";
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

client.on("guildKickAdd", async (guild, user) => {
  const entry1 = await guild
    .fetchAuditLogs({
      type: "MEMBER_KICK"
    })
    .then(audit => audit.entries.first());
  console.log(entry1.executor.username);
  const entry = entry1.executor;
  if (!config[guild.id])
    config[guild.id] = {
      banLimit: 3,
      chaDelLimit: 3,
      roleDelLimit: 3,
      kickLimits: 3,
      roleCrLimits: 3
    };
  if (!anti[guild.id + entry.id]) {
    anti[guild.id + entry.id] = {
      actions: 1
    };
    setTimeout(() => {
      anti[guild.id + entry.id].actions = "0";
    }, config[guild.id].time * 1000);
  } else {
    anti[guild.id + entry.id].actions = Math.floor(
      anti[guild.id + entry.id].actions + 1
    );
    console.log("TETS");
    setTimeout(() => {
      anti[guild.id + entry.id].actions = "0";
    }, config[guild.id].time * 1000);
    if (anti[guild.id + entry.id].actions >= config[guild.id].banLimit) {
      guild.members
        .get(entry.id)
        .ban()
        .catch(e =>
          guild.owner.send(
            `**⇏ | ${entry.username}  The member was expelled from the surf **`
          )
        );
      anti[guild.id + entry.id].actions = "0";
      fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
      fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(
        e
      ) {
        if (e) throw e;
      });
    }
  }

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), function(e) {
    if (e) throw e;
  });
  fs.writeFile("./antigreff.json", JSON.stringify(anti, null, 2), function(e) {
    if (e) throw e;
  });
});

client.on("guildMemberRemove", async member => {
  const entry1 = await member.guild
    .fetchAuditLogs()
    .then(audit => audit.entries.first());
  if (entry1.action === "MEMBER_KICK") {
    const entry2 = await member.guild
      .fetchAuditLogs({
        type: "MEMBER_KICK"
      })
      .then(audit => audit.entries.first());
    const entry = entry2.executor;
    if (!config[member.id])
      config[member.id] = {
        banLimit: 3,
        chaDelLimit: 3,
        roleDelLimit: 3,
        kickLimits: 3,
        roleCrLimits: 3
      };
    if (!anti[member.guild.id + entry.id]) {
      anti[member.guild.id + entry.id] = {
        actions: 1
      };
      setTimeout(() => {
        anti[member.guild.id + entry.id].actions = "0";
      }, config[member.guild.id].time * 1000);
    } else {
      anti[member.guild.id + entry.id].actions = Math.floor(
        anti[member.guild.id + entry.id].actions + 1
      );
      console.log("TETS");
      setTimeout(() => {
        anti[member.guild.id + entry.id].actions = "0";
      }, config[member.guild.id].time * 1000);
      if (
        anti[member.guild.id + entry.id].actions >=
        config[member.guild.id].kickLimits
      ) {
        member.guild.members
          .get(entry.id)
          .ban()
          .catch(e =>
            member.owner.send(
              `**⇏ | ${entry.username} tried to ban all memebers **`
            )
          );
        anti[member.guild.id + entry.id].actions = "0";
        fs.writeFile("./config.json", JSON.stringify(config), function(e) {
          if (e) throw e;
        });
        fs.writeFile("./antigreff.json", JSON.stringify(anti), function(e) {
          if (e) throw e;
        });
      }
    }

    fs.writeFile("./config.json", JSON.stringify(config), function(e) {
      if (e) throw e;
    });
    fs.writeFile("./antigreff.json", JSON.stringify(anti), function(e) {
      if (e) throw e;
    });
  }
});

var Enmap = require("enmap");
client.antibots = new Enmap({ name: "chat" });
var antibots = client.antibots;
var julian = client;
julian.on("message", codes => {
  if (codes.content.startsWith(prefix + "antibot on")) {
    if (
      codes.author.bot ||
      !codes.channel.guild ||
      codes.author.id != codes.guild.ownerID
    )
      return;
    antibots.set(`${codes.guild.id}`, {
      onoff: "On"
    });

    codes.channel.send("**You have ``enabled`` the anti bot**");
  }
  if (codes.content.startsWith(prefix + "antibot off")) {
    if (
      codes.author.bot ||
      !codes.channel.guild ||
      codes.author.id != codes.guild.ownerID
    )
      return;
    antibots.set(`${codes.guild.id}`, {
      onoff: "Off"
    });
    codes.channel.send("**You have ``disabled`` the anti bot**");
  }
});

julian.on("guildMemberAdd", member => {
  if (!antibots.get(`${member.guild.id}`)) {
    antibots.set(`${member.guild.id}`, {
      onoff: "Off"
    });
  }
  if (antibots.get(`${member.guild.id}`).onoff == "Off") return;
  if (member.user.bot) return member.kick();
});
//.....



client.on("guildCreate", guild => {
  var embed = new Discord.RichEmbed()
    .setColor("#3BA9FF")
    .setDescription(
      `**Very thank you for this bot in my server first comand  you stroke it (%settings limitstime 0.1) To this bot work to fast**`
    );
  guild.owner.send(embed);
});

//
console.log("DrBOYKA ONLINE !");

client.on("BOT IS ONLINE", () => {
  client.user.setStatus("online");
});
//....




//........naqeb
client.on("message", async message => {
  if (message.content.startsWith(prefix + "support")) {
    let invite = new Discord.RichEmbed()
      .setColor("#3BA9FF")
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setThumbnail(message.author.avatarURL)
      .setTitle(
        "Link Support Bot ::blue_heart:"
      )
      .setURL(
        " https://discord.gg/wEVN7WC"
      );
    message.channel.sendEmbed(invite);
  }
});

client.on("message", async message => {
  if (message.content.startsWith(prefix + "invite")) {
    let invite = new Discord.RichEmbed()
      .setColor("#3BA9FF")
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setThumbnail(message.author.avatarURL)
      .setTitle(
        "Link invite Bot ::blue_heart:"
      )
      .setURL(
        "https://discord.com/oauth2/authorize?client_id=722920272377675882&scope=bot&permissions=2146958847"
      );
    message.channel.sendEmbed(invite);
  }
});


////// member info server 
client.on("message", message => {
  if (!message.channel.guild) return;
  if (message.content == ".member")
    var IzRo = new Discord.RichEmbed()
      .setThumbnail(message.author.avatarURL)
      .setColor('#3BA9FF')
    .setFooter(message.author.username, message.author.avatarURL)
      .setTitle(":tulip:| Members info")
      .addBlankField(true)

      .addField(
        ":green_book:|  online",
        `${
          message.guild.members.filter(m => m.presence.status == "online").size
        }`
      )
      .addField(
        ":closed_book:| Do Not Disturb",
        `${message.guild.members.filter(m => m.presence.status == "dnd").size}`
      )
      .addField(
        ":orange_book:|ldie ",
        `${message.guild.members.filter(m => m.presence.status == "idle").size}`
      )
      .addField(
        ":notebook:| Ofline ",
        `${
          message.guild.members.filter(m => m.presence.status == "offline").size
        }`
      )
      .setFooter(message.author.username, message.author.avatarURL)
    .addField("all member", `${message.guild.memberCount}`);
  message.channel.send(IzRo);
});


/////


 client.on('message', msg => {
  if (msg.content === '.vote') {
    msg.channel.send(' \`Vote Link\` https://top.gg/bot/722920272377675882/vote');
  }
});




//// https://top.gg/bot/722920272377675882/vote


client.on('message', message => {
var prefix = "." ;
if (message.content.startsWith(prefix + "help")) 
 
    
{
  var SUPPORT = "https://discord.gg/RPERJQZ";
  var Link = "https://discord.com/oauth2/authorize?client_id=722920272377675882&scope=bot&permissions=2146958847";
  var Web = "https://discord.gg/Ra8dJ4t";
let embed = new Discord.RichEmbed()


.setThumbnail(message.author.avatarURL)
.setTitle('Command Help Menu' )
.setDescription(`** **[ Support](${SUPPORT})** - **[ Invite](${Link})** - **[ Website](${Web})**
 Security
\`.anti ban\` - \`.anti kick\`- \`.anti rolesC\` - \`.anti rolesD\`  
 \`.anti channelD\` - \`.antibot on\` - \`.antibot off\`
Generall
\`.server\` - \`.infobot\` - \`.youtube\` - \`.google\` - \`.invite\` - \`.vote\` - \`.support\` - \`.member\` - \`.roles\` - \`.emoji\` - \`.myrole\` - \`.server\`
Moderation
\`.lock\` - \`.unlock\` - \`.en cv\` - \`.ku cv\` - \`.setnick\` - \`.clear\`
**`)
 
 
.setColor('#3BA9FF')
      .setTimestamp()
  .setFooter(message.author.username, message.author.avatarURL)
 .setAuthor(`${message.author.username}`, `${message.author.avatarURL}`);
message.channel.sendEmbed(embed);
    }
});
/////////


client.on("message", message => {
let prefix = ".";
let args = message.content.split(' ');
  if(args[0].toLowerCase() === (prefix + "server")) {
        let embed = new Discord.RichEmbed()

     
    
        .addField(`:id: Server ID:`, `${message.guild.id}`, true)
        .addField(`:calendar: Created on:`, `${moment(message.guild.createdAt).format(`D/M/YYYY h:mm`)} \n ${moment(message.guild.createdAt).locale("EN-eg").fromNow()}`,true)
         .addField("**:crown: Owned by**", `**${message.guild.owner}**`, true)
        .addField(`:busts_in_silhouette: Members [${message.guild.members.size}]`, `**${message.guild.members.filter(c => c.presence.status !== "offline").size}** Online`, true)
      
        .addField( "**🤖The number of bots**",
        `** [${message.guild.members.filter(m => m.user.bot).size}] **`,true)
      
        
        .setColor("#3BA9FF")
     .setFooter(message.author.username, message.author.avatarURL)
        .addField(`:speech_balloon: Channels [${message.guild.channels.size}]`,`**${message.guild.channels.filter(f => f.type === "text").size}** Text | **${message.guild.channels.filter(f => f.type === "voice").size}** Voice`,true)
        .addField(`:earth_africa: Others`, `**Region:** ${message.guild.region} `, true)  
        .addField(`:closed_lock_with_key: Roles [${message.guild.roles.size}]`, `To see the whole list with all roles use **${prefix}roles**`, true)
         .addField(`😊 emojis [${message.guild.emojis.size}]`, `To see the whole list with all emojis use **${prefix}emojis**`, true)
        .setThumbnail(`${message.guild.iconURL}`)
        
        .setTimestamp()
        .setAuthor(`${message.guild.name}`, `${message.guild.iconURL}`);
        
    message.channel.sendEmbed(embed);
    }
 
});



//////


client.on("message", message => {
  let args = message.content.split(" ");
 if (args[0].toLowerCase() === `${prefix}avatar`) {
  let member = message.mentions.users.first();
  if(args[0] && !args[1]) {
    const emb = new Discord.RichEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL)
    .setColor("#FFFF00")
    .setTitle("Avatar Link")
    .setURL(`${message.author.avatarURL}`)
    .setImage(`${message.author.avatarURL}`)
.setFooter("Requested by" + message.author.tag, message.author.avatarURL)
     message.channel.sendEmbed(emb);
  }
  if(member) {
      const embed = new Discord.RichEmbed()
      .setAuthor(member.tag, member.avatarURL)
      .setColor("#3BA9FF")
      .setTitle("Avatar Link")
      .setURL(`${member.avatarURL}`)
      .setImage(`${member.avatarURL}`)
      .setFooter("Requested by" + message.author.tag, message.author.avatarURL);
     message.channel.sendEmbed(embed);
     }else if(args[1] && !member) {
          client.fetchUser(args[1]).then(user => {
    const embed = new Discord.RichEmbed()
      .setAuthor(user.tag, user.avatarURL)
      .setColor("#3BA9FF")
      .setTitle("Avatar Link")
      .setURL(`${user.avatarURL}`)
      .setImage(`${user.avatarURL}`)
      .setFooter("Requested by" + message.author.tag, message.author.avatarURL);
     message.channel.sendEmbed(embed);
  })
    }
  }
});

//////


client.on("message", function(message) {
  if (!message.channel.guild) return;
  if (message.author.bot) return;
  if (message.author.id === client.user.id) return;
  if (message.author.equals(client.user)) return;
  if (!message.content.startsWith(prefix)) return;

  var args = message.content.substring(prefix.length).split(" ");
  switch (args[0].toLocaleLowerCase()) {
    case "clear":
      message.delete();
      if (!message.channel.guild) return;
      if (message.member.hasPermission(0x2000)) {
        if (!args[1]) {
          message.channel.fetchMessages().then(messages => {
            message.channel.bulkDelete(messages);
            var messagesDeleted = messages.array().length;
            message.channel
              .sendMessage(
                " " +
                  "**```fix\n" +
                  messagesDeleted +
                  " " +
                  ": message has been deleted" +
                  "```**"
              )
              .then(m => m.delete(5000));
          });
        } else {
          let messagecount = parseInt(args[1]);
          message.channel
            .fetchMessages({ limit: messagecount })
            .then(messages => message.channel.bulkDelete(messages));
          message.channel
            .sendMessage(
              " " +
                "**```fix\n" +
                args[1] +
                " " +
                ": message has been deleted" +
                "```**"
            )
            .then(m => m.delete(100));
          message.delete(100);
        }
      } else {
        var manage = new Discord.RichEmbed()
          .setDescription("You Do Not Have Permission MANAGE_MESSAGES ")
          .setColor("#3BA9FF");
        message.channel.sendEmbed(manage);
        return;
      }
  }
});
////
client.on("message", message => {
  if (message.content.startsWith(prefix + "setnick")) {
    if (
      message.author.bot ||
      message.channel.type == "dm" ||
      !message.member.hasPermission("MANAGE_NICKNAMES") ||
      !message.guild.member(client.user).hasPermission("MANAGE_NICKNAMES")
    )
      return;
    var user = message.mentions.members.first();
    var args = message.content.split(" ").slice(2);
    var nick = args.join(" ");
    if (!user || !args)
      return message.channel.send(
        `**• | Usage:** ${prefix}setnick \`\`@Name\`\` nickname`
      );
    message.guild.member(user.user).setNickname(`${nick}`);
    message.channel.send(
      `**Successfully changed **${user}** nickname to **${nick}**`
    );
  }
});

////\
client.on('message', msg => {
 if(!msg.channel.guild) return;
        let user = msg.guild.member (msg.mentions.members.first() || msg.author);
 if (msg.content.startsWith(prefix + 'myrole')) {
    const DrBOYKA = new Discord.RichEmbed()
.setThumbnail(msg.author.avatarURL)
.setColor("#3BA9FF")
.setTitle ('`User Roles information`')
.addField ("Roles: ", user.roles.filter (r => r.name !== "@everyone").map (m =>"<@&" +m.id+">").join("\n"), true)
  .setFooter(msg.author.tag, msg.author.avatarURL)
    msg.channel.send(DrBOYKA)
  }
});




//////////
 client.on('message', message => {
    if (message.content == prefix + "infobot") {
    message.channel.send({
        embed: new Discord.RichEmbed()
            .setFooter(message.author.tag, message.author.avatarURL)
            .setAuthor(client.user.username,client.user.avatarURL)
            .setThumbnail(client.user.avatarURL)
            .setColor('#3BA9FF')
            .setTitle('`About to BestBot `')
            .addField(' **`Guilds` :**', `  ${client.guilds.size} `, true)
            .addField(' **`Channels` :**' , `   ${client.channels.size}  ` , true)
            .addField(' **`Users` :**' ,`  ${client.users.size} ` , true)
            .addField(' **`Bot Name` :**' , `   ${client.user.tag}  ` , true)
			      .addField(' **`Bot Prefix` :**' , `  . ` , true)
           .addField(' **`Created By :`**' , `MONTY & DrBOYKA   ` , true)
         
            

        
            
    })
    
}
});

///////
client.on('message', message => {
    if (message.content.startsWith(prefix + 'roles')) {
 
        const Rank = message.guild.roles.map(e => e.toString()).join(" ");

     
        const RankList = new Discord.RichEmbed()
            .setTitle('>  __**Get a list of server roles **__ ')
            .setAuthor(message.guild.name, message.guild.iconURL)
             
         .setColor("#3BA9FF")
            .setDescription(Rank)
            .setFooter(message.guild.name)
        .addField(
        "**:closed_lock_with_key:  Roles**",
        `** __${message.guild.roles.size}__ **`,
        true
      )
         .setFooter(message.author.tag, message.author.avatarURL)
        message.channel.send(RankList)
    }
});


/////


client.on("message", message => {
  let PREFIX = ".";
  if (message.content.startsWith(PREFIX + "emoji")) {
    const List = message.guild.emojis.map(e => e.toString()).join(" ");

    const EmojiList = new Discord.RichEmbed()
      .setTitle("**__Emoji List__**")
     .addField(`😊 emoji [${message.guild.emojis.size}]`, `Size`, true)
    .setAuthor(message.guild.name, message.guild.iconURL)
       .setColor("#3BA9FF")
      .setDescription(List)
         .setFooter(message.author.tag, message.author.avatarURL)
   
    message.channel.send(EmojiList);
  }
});


/////


/////


client.on('message', message => {
 
    if (message.content === prefix + "lock") {
      message.react("emoji_8:703038634894557294");
                        if(!message.channel.guild) return  message.channel.send(' This is only for servers !!');
 
if(!message.member.hasPermission('MANAGE_MESSAGES')) return  message.channel.send('');
           message.channel.overwritePermissions(message.guild.id, {
         SEND_MESSAGES: false
 
           }).then(() => {
                message.channel.send(`<a:618269170915737656:741414389898543144> | <#${message.channel.id}> Has Been Locked`)
           });
             }
if (message.content === prefix + "unlock") {
  message.react("emoji_8:703038634894557294");
    if(!message.channel.guild) return  message.channel.send(' This is only for servers !!');
 
if(!message.member.hasPermission('MANAGE_MESSAGES')) return  message.channel.send('');
           message.channel.overwritePermissions(message.guild.id, {
         SEND_MESSAGES: true
 
           }).then(() => {
               message.channel.send(`<a:618269170915737656:741414421959802961> | <#${message.channel.id}> Has Been Unlocked`)
           });
             }
 
 
});
/////// cv is best



client.on("message",async DrBOYKA => {

if(DrBOYKA.content === '.ku cv'){
    let title = '';
      let fillter = m => m.author.id === DrBOYKA.author.id
      
     

      await DrBOYKA.channel.send("**تایتڵی سەرەوەی سیڤی بنوسە**").then(e => {
           DrBOYKA.channel.awaitMessages(fillter, { time: 60000, max: 1                                    
})
     .then(co => {
       title = co.first().content;
        co.first().delete();
     
let desc = '';
        
e.edit("**تەواوی سیڤیەکە بنوسە**").then(e => {
  DrBOYKA.channel.awaitMessages(fillter, { time: 60000, max: 1 })

     .then(co => {
       desc = co.first().content;
        co.first().delete();
    
   let url = '';
    e.edit("لینکێک بنێرە بۆ دانانی لەگەڵ تایتڵی سیڤی..واتا تایتڵەکە شین بێت ").then(e=>{
     DrBOYKA.channel.awaitMessages(fillter, {time:60000,max:1})
      .then(co=>{
        url= co.first().content;
        co.first().delete();
    
        
        let thmb='';
        e.edit("لینکی وێنە بچوک کراوەکەی سەرەوە بنێرە").then(e=>{
         DrBOYKA.channel.awaitMessages(fillter,{time:60000,max:1})
          .then(co=>{
            thmb=co.first().content;
            co.first().delete();
            
            
            let img ='';
            e.edit("لینکی وێنە گەورەکە ناو سیڤی بنێرە").then(e=>{
              DrBOYKA.channel.awaitMessages(fillter,{time:60000,max:1})
              .then(co=>{
                img=co.first().content;
                co.first().delete();
    
   let fotr ='';
                e.edit("ناو یان تێکستێک بنێرە بۆ دانانی لە کۆتای سیڤیەکە بە بچوک کراوەیی").then(e=>{
                  DrBOYKA.channel.awaitMessages(fillter,{time:60000,max:1})
                .then(co=>{
                    fotr=co.first().content;
                    co.first().delete();
       let fotr2 = '';
        
e.edit("**لینکی وێنەیەک بنێرە بۆ دانانی لە کۆتایی سیڤیەکە بە بچوک کراوەیی**").then(e => {
  DrBOYKA.channel.awaitMessages(fillter, { time: 60000, max: 1 })

     .then(co => {
       fotr2 = co.first().content;
        co.first().delete();         
                    
                    
e.edit("Done").then(e => {
  

    let embed = new Discord.RichEmbed()
      .setTitle(title)
   
    .setURL(url)
      .setDescription(desc)
      .setImage(img)
      .setThumbnail(thmb)
      .setColor('RANDOM')
      .setFooter(fotr,fotr2)
      .setTimestamp(); 
  
  
  DrBOYKA.channel.send(embed)
  })
})
    })})
  })})})
})})})
  })})})
           })})
      
}
});

//////////////////////
client.on("message",async DrBOYKA => {

if(DrBOYKA.content === '.en cv'){
    let title = '';
      let fillter = m => m.author.id === DrBOYKA.author.id
      
      await DrBOYKA.channel.send("** Write Title....  **").then(e => {
           DrBOYKA.channel.awaitMessages(fillter, { time: 60000, max: 1                                    
})
     .then(co => {
       title = co.first().content;
        co.first().delete();
     
let desc = '';
        
e.edit("**Write alls title**").then(e => {
  DrBOYKA.channel.awaitMessages(fillter, { time: 60000, max: 1 })

     .then(co => {
       desc = co.first().content;
        co.first().delete();
    
   let url = '';
    e.edit("**send url & link for title**").then(e=>{
     DrBOYKA.channel.awaitMessages(fillter, {time:60000,max:1})
      .then(co=>{
        url= co.first().content;
        co.first().delete();
    
        
        let thmb='';
        e.edit("**send Thumbanil (small top right)**").then(e=>{
         DrBOYKA.channel.awaitMessages(fillter,{time:60000,max:1})
          .then(co=>{
            thmb=co.first().content;
            co.first().delete();
            
            
            let img ='';
            e.edit("**Image url (big at the bottom)**").then(e=>{
              DrBOYKA.channel.awaitMessages(fillter,{time:60000,max:1})
              .then(co=>{
                img=co.first().content;
                co.first().delete();
    
   let fotr ='';
                e.edit("**Name Footer?**").then(e=>{
                  DrBOYKA.channel.awaitMessages(fillter,{time:60000,max:1})
                .then(co=>{
                    fotr=co.first().content;
                    co.first().delete();
       let fotr2 = '';
        
e.edit("**Footer icon**").then(e => {
  DrBOYKA.channel.awaitMessages(fillter, { time: 60000, max: 1 })

     .then(co => {
       fotr2 = co.first().content;
        co.first().delete();         
                    
                    
e.edit("Done").then(e => {
  

    let embed = new Discord.RichEmbed()
      .setTitle(title)
   
    .setURL(url)
      .setDescription(desc)
      .setImage(img)
      .setThumbnail(thmb)
      .setColor('RANDOM')
      .setFooter(fotr,fotr2)
      .setTimestamp(); 
  
  
  DrBOYKA.channel.send(embed)
  })
})
    })})
  })})})
})})})
  })})})
           })})
      
}
});
////



 
client.on('message' , message => {
if(message.content.startsWith(prefix + 'youtube')) {
const query = message.content.split(" ").slice(1);
const url = `https://www.youtube.com/results?search_query=${query}`;
if(!query) return message.channel.send(`**:x: | Error , Please Type Command True Ex : \`${prefix}youtube [Anything]\`**`)
let querry = new Discord.RichEmbed()
.setAuthor("Youtube","https://cdn.discordapp.com/attachments/599152027628732429/599229170517540874/1GNwojhBBCCCGEEEIIIYQQQgghhBBCCCGEEELI7APi4BZVCOUmf4AAAAASUVORK5CYII.png")
.setColor('#3BA9FF')
.setTitle(`Results : \`${query.join(" ")}\``)
.setDescription(`${url}`)
.setFooter(message.author.username,message.author.avatarURL)
message.channel.send(querry)
}
})


 
client.login("NzIyOTIwMjcyMzc3Njc1ODgy.XuqF-A.k__MPSScox-bKBRWHiU4_-ZCw2M")
