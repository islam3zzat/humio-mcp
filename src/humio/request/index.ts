import dotenv from "dotenv";
dotenv.config();

const HUMIO_API = "https://cloud.humio.com/api/v1";

export const getHeaders = (contentType = false) => {
    const headers = new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${process.env.HUMIO_API_TOKEN}`
    });
    if (contentType) headers.append("Content-Type", "application/json");
    return headers;
};

export const createQueryJob = async (repo: string, query: string, start: string) => {
    const body = JSON.stringify({
        queryString: query,
        isLive: false,
        showQueryEventDistribution: true,
        allowEventSkipping: false,
        arguments: {},
        languageVersion: "legacy",
        useIngestTime: false,
        timeZone: "Europe/Berlin",
        computeFieldStats: true,
        start,
        end: "now"
    });
    const res = await fetch(
        `${HUMIO_API}/repositories/${repo}/queryjobs`,
        { method: "POST", headers: getHeaders(true), body }
    );
    const data = (await res.json()) as { id: string };

    return data.id;
};

export const fetchQueryJob = async (id: string, triesCount = 0): Promise<any> => {
    const res = await fetch(
        `${HUMIO_API}/queryjobs/${id}`,
        { method: "GET", headers: getHeaders() }
    );
    const data = (await res.json()) as { done: boolean; events: any };
    if (data.done || triesCount >= 5) return data.events;

    await new Promise(res => setTimeout(res, 5_000));

    return fetchQueryJob(id, triesCount + 1);
};

export const query = async (repo: string, query: string, start: string) => {
    const id = await createQueryJob(repo, query, start);
    return fetchQueryJob(id);
};
