

type T = {
    A: string,
    B: {
        C: number,
        D: {
            E: []
        }
    }
}
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type KeyofFlatten<T> = Expand<{
    [K in keyof T]: T[K] extends [] ? K :
                    T[K] extends Date ? K :
                    T[K] extends object ? (K | KeyofFlatten<T[K]>) :
                    K 
}[keyof T]>;



type x = KeyofFlatten<T>; // "A" | "B" | "C" | "D" | "E"