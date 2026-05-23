# Telegrapho

> Private self-hosted realtime text bridge between your devices.

Write or paste text on one device. Receive it on another instantly.

No accounts. No cloud dependency. No third-party clipboard services.

**Your text. Your server. Your control.**


<img width="1951" height="1229" alt="telegrapho2" src="https://github.com/user-attachments/assets/c1ca310f-bd8b-4269-a6d1-aa0854682df4" />


---

## What is Telegrapho?

Telegrapho is a minimal self-hosted realtime text sharing tool.

Create your own private channel and instantly share text between devices using your own server.

Useful for:

* sending text from mobile → desktop
* temporary note sharing
* transferring snippets between devices
* sending URLs, commands or code snippets
* avoiding third-party clipboard sharing services

---

## Features

* ⚡ Realtime synchronization using Socket.IO
* 🔒 Private channel-based sharing
* 🖥️ Self-hosted
* 📱 Mobile friendly UI
* 🧠 No accounts or authentication
* 💾 No database required
* 🪶 Lightweight and fast
* 📷 QR code generation
* ⚡ Lightning donation support

---

## Security Model

Telegrapho is private in the sense that:

* you control the server
* there are no public indexed channels
* no database is used
* channels are not discoverable by default

However:

* channel names act as shared secrets
* weak channel names can be guessed
* this is not end-to-end encrypted
* the server can technically access channel contents
* HTTPS is strongly recommended

---

## Quick Start

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/telegrapho.git
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

This makes sharing between devices extremely fast.

---

## Tech Stack

* Node.js
* Express
* Socket.IO
* Vanilla JavaScript
* SweetAlert2

---

## Philosophy

Telegrapho exists because not every text transfer should require:

* accounts
* cloud lock-in
* telemetry
* external clipboard services
* platform ecosystems

Sometimes you just want a lightweight sovereign bridge between your own devices.

---

## License

AGPL-3.0

---

## Author

Developed by egzola.
