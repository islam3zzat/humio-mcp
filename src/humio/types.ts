type ScalarVariable = {
    name: string;
    description: string;
    type: 'string' | 'number' | 'boolean'
    required: boolean;
};
type UnionVariable = {
    name: string;
    description: string;
    type: 'union';
    required: boolean;
    options: string[];
};

type Variable = ScalarVariable | UnionVariable;

export type Config = {
    name: string;
    description: string;
    query: string;
    fields: string[];
    variables: Array<Variable>;
    outputTemplate: string;
    joinString: string;
};




