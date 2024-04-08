const Discord = require('discord.js');

const MutedSchema = require("../../database/models/muted");


module.exports = async (client, interaction, args) => {
    const perms = await client.checkPerms({
        flags: [Discord.PermissionsBitField.Flags.ModerateMembers],
        perms: [Discord.PermissionsBitField.Flags.ModerateMembers]
    }, interaction);

    if (perms == false) return;

    const user = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
    const time = interaction.options.getNumber('time');
    const reason = interaction.options.getString('reason');

    if (user.isCommunicationDisabled()) return client.errNormal({
        error: `${user} has already timed out!`,
        type: 'editreply'
    }, interaction);


    let mutedRole = interaction.guild.roles.cache.find(role => role.name === "Muted");
    if (!mutedRole) {
        mutedRole = await interaction.guild.roles.create({
            name: 'Muted',
            color: '#514f48',
            permissions: []
        }),
        interaction.guild.channels.cache.forEach(async (channel) => {
            await channel.permissionOverwrites.create(mutedRole, {
                SendMessages: false,
                AddReactions: false,
                Speak: false,
                ServerMute: true,
            }).catch(console.error);
            await voiceChannel.updateOverwrite(mutedRole, {
                Speak: false,
                Muted: true,
                ServerMute: true,
            });
        });
    }

    // Add the 'muted' role to the user
    await user.roles.add(mutedRole);

    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + parseInt(interaction.options.getNumber('time')))

    // check if the user is already exists in the database, if not, create a new one, else update the existing one
    const data = await MutedSchema.findOne({ userId: interaction.options.getUser('user').id });
    if (data) {
        await MutedSchema.findOneAndUpdate({ userId: interaction.options.getUser('user').id }, { expires });
    } else {
    await new MutedSchema({
        guildId: interaction.guild.id,
        userId: interaction.options.getUser('user').id,
        expires,
      }).save();
    }

    client.succNormal({
            text: `${user} successfully muted **${time} minutes**`,
            fields: [
                {
                    name: `💬┆Reason`,
                    value: `${reason}`
                }
            ],
            type: 'editreply'
    }, interaction)
   
   
}

 