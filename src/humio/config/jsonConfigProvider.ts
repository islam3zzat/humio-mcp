import fs from "fs";
import path from "path";
import { Config } from "../types.js";
import { HumioConfigProvider } from "./provider.js";

export class JsonConfigProvider implements HumioConfigProvider<Config> {
    private configs: Config[];

    constructor(configFileName: string) {
        const fileName = path.dirname(new URL(import.meta.url).pathname)
        const jsonPath = path.join(fileName, "..", "..", "..", configFileName)

        this.configs = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    }

    getAllConfigs() {
        return this.configs;
    }
    getConfigByName(name: string) {
        return this.configs.find(cfg => cfg.name === name);
    }
}
