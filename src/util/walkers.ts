import cloneDeep from "lodash.clonedeep";

export function* iterateDeep(
    target: Record<string, any>, 
    path: string[] = [])
    : Generator<[key: string, value: any, parent: Record<string, any>, pathToParent: string[]]> {

    if (typeof target !== 'object') {
        throw new Error();
    }

    for (const [key, value] of Object.entries(target)) {
        if (typeof value === 'object') {
            yield* iterateDeep(value, [...path, key]);
        }
        yield [key, value, target, path];
    }
}

export function transform(
    target: Record<string, any>, 
    visit: (key: string, parent: Record<string, any>, pathToParent: string[]) => boolean,
    path: string[] = []){

    if (typeof target !== 'object') {
        throw new Error();
    }

    for (const key of Object.keys(target)) {
        const visitInto = visit(key, target, path);
        if (!visitInto) {
            continue;
        }
        const value = (target as any)[key];
        if (typeof value === 'object') {
            transform(value, visit, [...path, key]);
        }
    }
}

export function removeSymbols<T>(target: any) {

    if (typeof target !== 'object') {
        return;
    }

    for(const sym of Object.getOwnPropertySymbols(target)) {
        delete target[sym];
    }

    for (const key of Object.keys(target)) {
        removeSymbols(target[key]);
    }
}

// does not handle circular references
export function cloneWithoutSymbols<T>(val: T): T{

    let clone: any;
    if (Array.isArray(val)) {
        clone = [];
    } else if (val === null) {
        return null as any;
    } else if (typeof val === "object"
        && Object.getPrototypeOf(val) === Object.prototype) {
        clone = {};
    } else {
        return val;
    }

    for (const key of Object.keys(val)) {
        clone[key] = cloneWithoutSymbols((val as any)[key]);
    }

    return clone;
}