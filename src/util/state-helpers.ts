export function getArrayWithUpdatedItems<T>(
    arr: T[],
    predicate: (item: T) => boolean,
    update: Partial<T>): T[] {

    // this code will fire even if there is no active item, just swallowing the update without error
    return arr.map(item => {

        if (!predicate(item)) {
            return item;
        }

        return {
            ...item,
            ...update
        }
    });

    // I can't see a situation, in which which we are given an update, 
    // can't find item to apply it to, and that is not an error.
    // So, if we go this route, i'd do somethings like this:
    // const itemIndex = arr.findIndex(predicate);
    // if (itemIndex === -1) {
    //     throw new Error(`Item for update not found`);
    // }

    // const newArr = [...arr];
    // newArr[itemIndex] = {
    //     ...newArr[itemIndex],
    //     ...update
    // }
    // return newArr;
}

export type ReadonlyDeep<TType> =
    TType extends readonly (infer TElem)[] ? readonly ReadonlyDeep<TElem>[] :
    {
        readonly [key in keyof TType]:
        TType[key] extends readonly (infer TElem)[] ? readonly ReadonlyDeep<TElem>[] :
        TType[key] extends object ? readonly ReadonlyDeep<TType[key]>[] :
        TType[key];
    }