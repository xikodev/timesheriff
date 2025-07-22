# TimeSheriff

**TimeSheriff** is a lightweight, privacy-conscious Discord bot that helps users manage and view timezones — perfect for global communities, study groups, and gaming guilds.

> ⚠️ All user data is private. No analytics, no tracking. Users can remove their data at any time using `/deleteinfo`.

---

## 🛠 Features

- `/settimezone [timezone]` – Set your own timezone with autocomplete
- `/gettime [user]` – View the local time of any user who has set their timezone
- `/timezones [region]` – Browse available timezones (filterable by region: Europe, Asia, etc.)
- `/deleteinfo` – Permanently delete your stored timezone
- `/about` – Learn more about the bot
- `/help` – Get a list of all commands

---

## 🚀 Getting Started

To add TimeSheriff to your server, [invite the bot](https://discord.com/oauth2/authorize?client_id=1396929073107832933) with appropriate permissions (use `applications.commands` and `bot` scopes).

---

## 🔐 Privacy & Terms

- [Privacy Policy](./PRIVACY.md)
- [Terms of Service](./TERMS.md)
- License: **All Rights Reserved** – You may not copy, modify, or redistribute any part of this software. See [LICENSE](./LICENSE).

---

## 📦 Tech Stack

- [discord.js](https://discord.js.org/) for bot interactions
- [MongoDB](https://www.mongodb.com/) + Mongoose for secure data storage
- [moment-timezone](https://momentjs.com/timezone/) for timezone logic
