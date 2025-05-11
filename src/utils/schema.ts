import { z } from "zod"
import { Variable } from "../humio/types"

export const variableToZSchema = (variable: Variable) => {
    let schema: z.ZodSchema<any>
    switch (variable.type) {
        case "string":
            schema = z.string()
            break
        case "number":
            schema = z.number()
            break
        case "boolean":
            schema = z.boolean()
            break
        case "enum":
            // Hack to work around the required enumOptions field
            const options = variable.enumOptions as [string, ...string[]]
            schema = z.enum(options)
            break
        default:
            const _exhaustiveCheck: never = variable
            throw new Error(`Unsupported type: ${_exhaustiveCheck}`)
    }

    if (variable.required) {
        return schema.describe(variable.description)
    }

    return schema.optional().describe(variable.description)
}
