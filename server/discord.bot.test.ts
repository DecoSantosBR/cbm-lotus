import { describe, it, expect } from "vitest";
import { Client, GatewayIntentBits } from "discord.js";

describe("Discord Bot Connection", () => {
  it("should validate Discord bot token by connecting to Discord API", async () => {
    const token = process.env.DISCORD_BOT_TOKEN;
    
    if (!token) {
      throw new Error("DISCORD_BOT_TOKEN not configured");
    }

    const client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });

    // Try to login with the token
    await client.login(token);
    
    // Wait for ready event
    await new Promise<void>((resolve) => {
      client.once("ready", () => {
        console.log(`[Test] Bot logged in as ${client.user?.tag}`);
        resolve();
      });
    });

    expect(client.user).toBeDefined();
    expect(client.user?.tag).toBeTruthy();

    // Cleanup
    await client.destroy();
  }, 30000); // 30 seconds timeout
});
