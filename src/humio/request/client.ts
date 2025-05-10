export interface HumioClient {
    query(repo: string, query: string, start: string): Promise<any>;
}
