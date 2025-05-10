type StructuredConfig = {
    type: 'structured';
    name: string;
    description: string;
    query: string;
    fields: string[];
    outputTemplate: string;
    joinString: string;
};

type RawConfig = {
    type: 'raw';
    name: string;
    description: string;
    variables: Array<{
        name: string;
        description: string;
        type: 'string' | 'number' | 'boolean' | 'union';
        required: boolean;
    }>;
    outputTemplate?: string;
};

export type Config = RawConfig | StructuredConfig




