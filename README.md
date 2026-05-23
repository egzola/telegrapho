# Telegrapho

> Private self-hosted realtime text bridge between your devices.

Write or paste text on one device. Instantly receive it across your devices.

No accounts. No cloud dependency. No third-party clipboard services.

**Your text. Your server. Your control.**

## How it works !

<img width="1435" height="710" alt="telegrapho_screen" src="https://github.com/user-attachments/assets/063c1b7f-3864-4e8c-99bf-7a9ca7a25a37" />



## Screen Shot

<img width="1951" height="1229" alt="telegrapho2" src="https://github.com/user-attachments/assets/c1ca310f-bd8b-4269-a6d1-aa0854682df4" />



## What is Telegrapho?

Telegrapho is a minimal self-hosted realtime text sharing tool.

Create your own private channel and instantly share text across devices using your own server.

Useful for:

- sending text from mobile → desktop
- temporary note sharing
- transferring snippets across devices
- sending URLs, commands or code snippets
- avoiding third-party clipboard sharing services

---

## Features

- ⚡ Realtime synchronization using Socket.IO
- 🔒 Private channel-based sharing
- 🖥️ Self-hosted
- 📱 Mobile friendly UI
- 🧠 No accounts or authentication
- 💾 No database required
- 🪶 Lightweight and fast
- 📷 QR code generation
- ⚡ Lightning donation support

---

## Security Model

Telegrapho is private in the sense that:

- you control the server
- there are no public indexed channels
- no database is used
- channels are not discoverable by default

However:

- channel names act as shared secrets
- weak channel names can be guessed
- this is not end-to-end encrypted
- the server can technically access channel contents
- HTTPS is strongly recommended

---

## Quick Start

### Clone the repository

```bash
git clone https://github.com/egzola/telegrapho.git
cd telegrapho
```

### Install dependencies

```bash
npm install
```

### Run the server

```bash
node server.js
```

Open in your browser:

```text
http://localhost:3712
```

---

## URL Channels

You can directly open a specific channel using:

```text
https://your-server.com/?channel=my-secret-channel
```

This makes sharing across devices extremely fast.

---

## Tech Stack

- Node.js
- Express
- Socket.IO
- Vanilla JavaScript
- SweetAlert2

---

## Philosophy

Telegrapho exists because not every text transfer should require:

- accounts
- cloud lock-in
- telemetry
- external clipboard services
- platform ecosystems

Sometimes you just want a lightweight sovereign bridge across your own devices.

---

## License

MIT

---

## Author

Developed by egzola.
