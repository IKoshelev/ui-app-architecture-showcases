

const numberAtomicValidatorFns = {

    integer:() => (val: number) => {
        if(!Number.isInteger(val)) {
            return `Value ${val} must be an integer`;
        };
    },
    positive:() => (val: number) => {
        if(val < 0) {
            return `Value ${val} must be positive`;
        };
    },
    lessThan:(bound: number) => (val: number) => {
        if(val >= bound) {
            return `Value ${val} must be less than ${bound}`;
        };
    },
    between:(loverBound: number, upperBound: number) => (val: number) => {
        if(loverBound > val || val > upperBound) {
            return `Value ${val} must be between ${loverBound} and ${upperBound}`;
        };
    }
} as const;

export function getNumberAtomicValidatorFunctionFromDefinition(
    def: NumberAtomicValidatorDefinition): (val: any) => undefined | string {
    const validatorName = def[0];
    const args = def.slice(1);
    return (numberAtomicValidatorFns[validatorName] as any).apply(null, args);
}

type NumberAtomicValidatorDefinitionsStorage = {
    [K in keyof typeof numberAtomicValidatorFns]: [K, ...Parameters<typeof numberAtomicValidatorFns[K]>]
}

export type NumberAtomicValidatorDefinition = 
    NumberAtomicValidatorDefinitionsStorage[keyof NumberAtomicValidatorDefinitionsStorage];

export const numberAtomicValidators = 
    Object
        .keys(numberAtomicValidatorFns)
        .reduce((cur, key) => {
            cur[key]= (...args:any[]) => [key, ...args];
            return cur;
        }, {} as any) as {
            [K in keyof typeof numberAtomicValidatorFns]: 
                (...args: Parameters<typeof numberAtomicValidatorFns[K]>) => NumberAtomicValidatorDefinition
        };

export type NumberAtomicValidatorState = {
    definition: NumberAtomicValidatorDefinition,
    isValid: boolean,
    message: string
}