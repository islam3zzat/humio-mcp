export interface HumioConfigProvider<T = unknown> {
    getAllConfigs(): T[];
    getConfigByName(name: string): T | undefined;
}
