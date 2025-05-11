# Humio MCP Server

A Model Context Protocol (MCP) server implementation for Humio, enabling integration with Humio's logging and analytics platform.

## Description

This project implements a server that bridges the Model Context Protocol with Humio's logging capabilities. It allows for seamless integration between applications and Humio's powerful logging and analytics features.

## Prerequisites

- Humio token

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd humio-mcp
```

2. Install dependencies:
```bash
npm install
```
or
```bash
pnpm install
```
or
```bash
yarn install
```


3. Create a `.env` file in the root directory with your Humio configuration (this is only useful for dev/testing as the MCP client will provide the env variables anyway):
```env
HUMIO_API_TOKEN=your_api_token
HUMIO_REQUEST_TIMEOUT_MS=30000
```

4. Create config from the example config file

```sh
cp humio-query-config.example.json humio-query-config.json
```

## Usage

Build the server:
```bash
npm run build
```
or
```bash
pnpm run build
```
or
```bash
yarn run build
```

Connect to the client. Sample config

```json
"humioMCP": {
    "command": "node",
    "args": [
        "<absolute-path-to-server>/humio-mcp/dist/index.js"
    ],
    "type": "stdio",
    "env": {
        "TOKEN": "<HUMIO_API_TOKEN>",
        "HUMIO_REQUEST_TIMEOUT_MS": 3000
    }
}
```

## ⚠️ Danger: Sensitive Information

**Do NOT include any sensitive information in the `fields` field of your configuration.**

The contents of the `fields` field are returned to the client and may be passed to a Large Language Model (LLM). Any sensitive data (such as API keys, passwords, personal information, or confidential business data) included here could be exposed.

Ensure that only non-sensitive, safe-to-share information is specified in the `fields` field of your config files.

## Project Structure

```
humio-mcp/
├── src/
│   ├── humio/                  # Humio-specific implementations
│   ├── utils/                  # Utility functions
│   └── index.ts                # Main server entry point
├── dist/                       # Compiled JavaScript files
├── humio-query-config.json     # Configurations for available quries
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```
