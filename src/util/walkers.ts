
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