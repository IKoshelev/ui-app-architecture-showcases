export function isLoadingAny(dict: {[key: string]: boolean}) {

    for(const [_,v] of Object.entries(dict)){
        if(v === true) {
            return true;
        }
    }

    return false;
}