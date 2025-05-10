import { z } from "zod"

export const typeToZSchema = (type: string) => {
    switch (type) {
        case "string":
            return z.string()
        case "number":
            return z.number()
        case "boolean":
            return z.boolean()
        default:
            throw new Error(`Unsupported type: ${type}`)
    }
}
