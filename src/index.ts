import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z, ZodRawShape } from "zod";
import { Config } from "./humio/types.js";
import { JsonConfigProvider } from "./humio/config/jsonConfigProvider.js";
import { HumioApiClient } from "./humio/request/humioApiClient.js";
import { HumioService } from "./humio/humioService.js";
import { typeToZSchema } from "./utils/schema.js";

const configProvider = new JsonConfigProvider("humio-query-config.json");
const humioClient = new HumioApiClient();
const humioService = new HumioService(humioClient);

function loadConfigs(): Config[] {
    return configProvider.getAllConfigs();
}

function registerTools(server: McpServer, configs: Config[]) {
    for (const config of configs) {
        const args: ZodRawShape = {};

        if ('variables' in config) {
            config.variables.forEach(variable => {
                const schema = typeToZSchema(variable.type)
                    .describe(variable.description);
                if (variable.required) {
                    args[variable.name] = schema;
                } else {
                    args[variable.name] = schema.optional();
                }
            });
        }

        server.tool(
            config.name,
            {
                region: z.enum(["eu", "us", "au"]).default("eu"),
                relativeTime: z.object({
                    count: z.number().int().positive().default(12).describe("The number of time units to query"),
                    unit: z.enum(["h", "d"]).default("h").describe("The time unit to query")
                }).describe("The time range to query").default({ count: 12, unit: "h" }),
                ...args
            },
            async ({ region, relativeTime }: { region: string, relativeTime: { count: number, unit: string } }) => {
                try {
                    let result: string = await humioService.runQuery(region, config, relativeTime);
                    return {
                        content: [{ type: "text", text: result }]
                    };
                } catch (error: any) {
                    console.error(`Error in ${config.name}:`, error);
                    return {
                        content: [{ type: "text", text: `Error: ${error.message || 'Unknown error occurred'}` }]
                    };
                }
            }
        );
    }
}

async function main() {
    // Load configs
    const configs = loadConfigs();

    // Create an MCP server
    const server = new McpServer({
        name: "Humio logs",
        version: "1.0.0",
        description: "A server for querying Humio logs"
    });

    // Register tools
    registerTools(server, configs);

    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch(err => {
    console.error("Fatal error in main():", err);
    process.exit(1);
});
