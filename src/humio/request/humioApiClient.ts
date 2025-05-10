import { createQueryJob, fetchQueryJob } from "./index.js";
import { HumioClient } from "./client.js";

export class HumioApiClient implements HumioClient {
    async query(repo: string, queryStr: string, start: string): Promise<any> {
        const id = await createQueryJob(repo, queryStr, start);
        return fetchQueryJob(id);
    }
}
