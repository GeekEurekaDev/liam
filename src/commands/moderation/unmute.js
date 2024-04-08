const Discord = require('discord.js');

module.exports = async (client, interaction, args) => {
    const perms = await client.checkPerms({
        flags: [Discord.PermissionsBitField.Flags.ModerateMembers],
        perms: [Discord.PermissionsBitField.Flags.ModerateMembers]
    }, interaction);

    if (perms == false) return;

    const user = await interaction.guild.members.fetch(interaction.options.getUser('user').id);

    let mutedRole = interaction.guild.roles.cache.find(role => role.name === "Muted");
    if (mutedRole) {
        await user.roles.remove(mutedRole);
    }
    if(user.roles.cache.has(mutedRole.id)) {
        return client.errNormal({
            error: `${user} is not muted!`,
            type: 'editreply'
        }, interaction);
    }

    client.succNormal({
            text: `${user} successfully unmuted!`,
            type: 'editreply'
    }, interaction)
   
   
}

 