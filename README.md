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

### Inspection

After building, you can inspect the server using the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
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
        "HUMIO_API_TOKEN": "<HUMIO_API_TOKEN>",
        "HUMIO_REQUEST_TIMEOUT_MS": 3000
    }
}
```

## Configuration File Format

The `humio-query-config.json` file defines the available queries for the server. Each entry in the array should follow the structure below:

| Field           | Type                       | Required | Description                                                                                 |
|-----------------|----------------------------|----------|---------------------------------------------------------------------------------------------|
| name            | string                     | Yes      | Unique name for the query configuration.                                                    |
| description     | string                     | Yes      | Human-readable description of what the query does.                                          |
| query           | string                     | Yes      | The Humio query string, can include template variables (e.g., `{{variableName}}`).          |
| fields          | string[]                   | Yes      | List of fields to extract from the query results.                                           |
| variables       | Variable[]                 | No       | List of variables required by the query. See below for the `Variable` format.               |
| outputTemplate  | string                     | Yes      | Template for formatting each result. Uses `{{fieldName}}` for interpolation.                |
| joinString      | string                     | Yes      | String used to join multiple formatted results.                                             |

### Variable Format

Each item in the `variables` array can be one of the following:

#### Scalar Variable
| Field       | Type                | Required | Description                                 |
|-------------|---------------------|----------|---------------------------------------------|
| name        | string              | Yes      | Name of the variable.                       |
| description | string              | Yes      | Description of the variable.                |
| type        | 'string'\|'number'\|'boolean' | Yes      | Type of the variable.                       |
| required    | boolean             | Yes      | Whether the variable is required.           |

#### Enum Variable
| Field       | Type                | Required | Description                                 |
|-------------|---------------------|----------|---------------------------------------------|
| name        | string              | Yes      | Name of the variable.                       |
| description | string              | Yes      | Description of the variable.                |
| type        | 'enum'              | Yes      | Type of the variable (must be 'enum').      |
| required    | boolean             | Yes      | Whether the variable is required.           |
| enumOptions | string[]            | Yes      | Allowed values for the enum variable.       |

#### Example

```json
[
  {
    "name": "criticalErrors",
    "description": "Finds critical errors for the banana team grouped by message and stack trace.",
    "query": "k8s.labels.team = banana | (severity = crit ) | groupBy([message, stack_trace])",
    "fields": ["message", "stack_trace", "_count"],
    "outputTemplate": "Error \"{{message}}\" occurred in total: {{_count}} times. The Stack trace is \n---{{stack_trace}}\n---\n\n",
    "joinString": "\n"
  },
  {
    "name": "projectOperationsByState",
    "description": "Groups operations by state for a given project in the banana team.",
    "query": "k8s.labels.team = banana | projectKey=\"{{projectKey}}\" | groupBy([fields.state])",
    "fields": ["fields.state", "_count"],
    "variables": [
      {
        "name": "projectKey",
        "description": "The project key to filter by.",
        "type": "string",
        "required": true
      }
    ],
    "outputTemplate": "state: {{fields.state}} - {{_count}} operations",
    "joinString": "\n"
  }
]
```

## ⚠️ Danger: Sensitive Information

**Do NOT include any sensitive information in the `fields` field of your configuration.**

The contents of the `fields` field are returned to the client and may be passed to a Large Language Model (LLM). Any sensitive data (such as API keys, passwords, personal information, or confidential business data) included here could be exposed.

Ensure that only non-sensitive, safe-to-share information is specified in the `fields` field of your config files.

## ⚠️ Warning: Timeout and Partial Results

If the configured timeout (`HUMIO_REQUEST_TIMEOUT_MS`) is reached during a query, the server will return the events collected up to that point. This means the results may be incomplete and might not capture all relevant events.

To reduce the risk of missing data, consider adjusting the timeout value according to your expected query size and network conditions.

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
