# test-2026.5.21remotiontest

> **MEMO (2026.05.21)**: This project runs via the official **Claude Code** client with API keys configured in `.env`.
> Simply run `./startup.sh` to start.

## 🚀 Quick Start

```bash
./startup.sh   # Initialize project + launch Claude Code
./ending.sh    # Commit, push, and finalize session
```

## 🤖 How it Works

`startup.sh` → reads `project_initial.md` → launches Claude Code CLI.

## 📁 Project Structure

```
.
├── startup.sh         # Session start: reads project goals + launches Claude Code CLI
├── ending.sh          # Session end: update logs + commit + push
├── .env               # API keys (gitignored)
├── log.md          # Development log
└── user/dialog.md     # Auto-reconstructed conversation history
```

## 🛠 Prerequisites

- `npx` / Node.js — for Claude Code CLI
- `ANTHROPIC_API_KEY` set in `.env`
