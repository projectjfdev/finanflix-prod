import { DISCORD_CONFIG } from "@/lib/discord/discord"

// Add this function inside your GET handler, after getting the Discord user info
// Add this right after the line: const discordUser = await getDiscordUserInfo(code);
// Make sure the user is added to the guild
const addUserToGuild = async (userId: string, accessToken: string) => {
  try {
    if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.GUILD_ID) {
      console.error("Missing required environment variables for Discord integration")
      return false
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_CONFIG.GUILD_ID}/members/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    })

    return response.status === 201 || response.status === 204
  } catch (error) {
    console.error("Error adding user to guild:", error)
    return false
  }
}
