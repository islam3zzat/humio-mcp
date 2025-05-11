import { Config } from "./types.js";
import { HumioClient } from "./request/client.js";

const ALLOWED_REGIONS = ["eu", "us", "au"];
const REPO_MAP: Record<string, string> = {
    eu: "ctp-production-eu-view",
    us: "ctp-production-us-view",
    au: "ctp-production-au-view"
};

export class HumioService {
    constructor(private client: HumioClient) { }

    async runQuery(
        region: string,
        config: Config,
        relativeTime: { count: number, unit: string },
    ): Promise<string> {


        if (!ALLOWED_REGIONS.includes(region)) {
            throw new Error(`Invalid region: ${region}. Allowed: ${ALLOWED_REGIONS.join(", ")}`);
        }
        const repo = REPO_MAP[region];
        const start = `${relativeTime.count}${relativeTime.unit}`;
        const { userQuery, outputTemplate, fields, joinString } = this.getQuery(config)

        const events = await this.client.query(repo, userQuery, start);
        return events.map((ev: any) => {
            let output = outputTemplate || "";
            for (const field of fields) {
                output = output.replace(new RegExp(`{{${field}}}`, "g"), ev[field]);
            }
            return output || JSON.stringify(ev);
        }).join(joinString);
    }

    private getQuery(config: Config) {

        return {
            userQuery: config.query,
            fields: config.fields,
            outputTemplate: config.outputTemplate,
            joinString: config.joinString
        }
    }
}
