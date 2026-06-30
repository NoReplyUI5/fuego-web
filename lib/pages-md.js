// Hand-written markdown versions of each page (Markdown for Agents).
// Shared by api/md.js (Vercel, ESM import) and server.js (local dev, CJS require).

module.exports = {
  home: `# Mesuic — Free Discord Music Bot

Free high-quality Discord music bot. Supports Spotify, YouTube, SoundCloud, Apple Music, direct links and more. Filters, autoplay, and 24/7 mode — all included. No premium required, free forever.

## Supported platforms

- Spotify
- YouTube
- SoundCloud
- Apple Music
- Direct links

## Features

- High-quality, lag-free playback
- Audio filters
- Autoplay
- 24/7 mode
- Free forever, no premium tier

## Live stats

Mesuic by the numbers — live data, updated every 5 minutes. Machine-readable JSON is available at \`/api/stats\`; a human dashboard is at \`/status\`. Tracked metrics: Servers, Users, Songs Played, Commands Used, Average Ping.

## Links

- Add to Discord: https://mesuic.qzz.io/invite
- Support server: https://mesuic.qzz.io/support
- Live status: https://mesuic.qzz.io/status
- Top.gg: https://top.gg/bot/1157589891287367730/vote
- Terms of Service: https://mesuic.qzz.io/terms
- Privacy Policy: https://mesuic.qzz.io/privacy

_© 2025 Mesuic · Not affiliated with Discord Inc._
`,

  status: `# Mesuic — Live Status

Real-time metrics for the Mesuic Discord music bot, updated every 5 minutes. Machine-readable data is served at \`/api/stats\` (JSON).

## Aggregate metrics

- Servers (total guilds across all shards)
- Users
- Songs Played (all-time total)
- Commands Used (all-time total)
- Active Players (currently playing)
- Average Ping

## Per-shard details

Each shard reports: shard ID, guilds, users, ping, uptime, heap memory used/total, CPU usage, and players (playing / total).

## Lavalink node

The audio node reports: name, uptime, RAM usage (used / allocated), Lavalink load, system load, node players (playing / total), and CPU cores.

## API

\`GET /api/stats\` returns the full stats payload as JSON. See the API catalog at \`/.well-known/api-catalog\`.

## Links

- Home: https://mesuic.qzz.io/
- Add to Discord: https://mesuic.qzz.io/invite
- Support server: https://mesuic.qzz.io/support

_© 2025 Mesuic · Not affiliated with Discord Inc._
`,

  terms: `# Mesuic — Terms of Service

_Last updated: 6 August 2025_

Please read these terms carefully before using Mesuic.

## Introduction

Welcome to Mesuic Bot! By using the bot, you agree to these terms. If you disagree, please refrain from using the bot.

## User Responsibilities

As a user of Mesuic Bot, you agree to:

- Use the bot for legal and authorized purposes only.
- Not use the bot for malicious activities or harassment.
- Respect the privacy of others while using the bot.
- Not overload or disrupt the bot's services.

## Limitations of Liability

Mesuic Bot is provided "as is," and we make no promises or guarantees about its functionality. We are not liable for any damages or issues arising from the use of the bot.

## Modifications to Terms

We may update these terms at any time. Any changes will be posted on this page, and your continued use of the bot after such changes will indicate your acceptance of the modified terms.

## Termination

We reserve the right to suspend or terminate your access to the bot at any time for violations of these terms.

## Governing Law

These terms are governed by the laws of your jurisdiction. Any disputes will be handled in the appropriate legal venue.

_© 2025 Mesuic · Not affiliated with Discord Inc._
`,

  privacy: `# Mesuic — Privacy Policy

_Last updated: 25 October 2025_

How Mesuic handles your data.

## Introduction

At Mesuic Bot, we value your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and safeguard your data when using the bot. As a third-party application, Mesuic Bot also adheres to the [Discord Terms of Service](https://discord.com/terms) and [Discord Privacy Policy](https://discord.com/privacy).

## Data Collection

Mesuic Bot collects only the information necessary to perform its functions. We do not collect personal information such as names, addresses, or emails. The data we collect includes:

- Music play history
- Server settings (such as the 247 and prefix)
- Command usage and interaction logs

## How We Use Your Data

The data we collect is used solely for improving the functionality of the bot and providing the best user experience. We do not share or sell your data with third parties for any reason.

## Data Retention

Mesuic Bot does not retain user data for long periods. Your interaction data is stored temporarily and deleted after the session ends or after a reasonable period of inactivity.

## Data Security

We take appropriate technical and organizational measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet is 100% secure.

## Changes to This Privacy Policy

We reserve the right to update this policy at any time. Any changes will be posted on this page, and your continued use of the bot will indicate your acceptance of the updated policy.

## Contact Us

If you have any questions about this privacy policy, feel free to contact us through our [official support channels](https://mesuic.qzz.io/support).

_© 2025 Mesuic · Not affiliated with Discord Inc._
`,
};
