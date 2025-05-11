type ScalarVariable = {
    name: string;
    description: string;
    type: 'string' | 'number' | 'boolean'
    required: boolean;
};
type EnumVariable = {
    name: string;
    description: string;
    type: 'enum';
    required: boolean;
    enumOptions: string[];
};

export type Variable = ScalarVariable | EnumVariable;

export type Config = {
    name: string;
    description: string;
    query: string;
    fields: string[];
    variables: Array<Variable>;
    outputTemplate: string;
    joinString: string;
};




