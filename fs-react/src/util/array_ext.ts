declare global {
    interface Array<T> {
        createUniqueArray(getKey: (e: T) => string): Array<T>;
        findFirst<T>(predicate: (e: T) => boolean): T;
        removeFirst<T>(predicate: (e: T) => boolean): T;
        replaceFirst<T>(predicate: (e: T) => boolean, replacement: T): T;
        removeAll<T>(predicate: (e: T) => boolean): void;
    }
}

Array.prototype.createUniqueArray = function <T>(getKey: (e: T) => string): T[] {
    let mapObj = new Map()
    let result: T[]  = [];
    this.forEach((v: T) => {
        let prevValue = mapObj.get(getKey(v))
        if(!prevValue){
            mapObj.set(getKey(v), v);
            result.push(v);
        }
    })
    return result;
}

Array.prototype.findFirst = function<T>(predicate: (e: T) => boolean): T {
    const arr = this.filter((el: T) => predicate(el));
    return (arr.length > 0) ? arr[0] : null;
}

Array.prototype.removeFirst = function<T>(predicate: (e: T) => boolean): T {
    let index = -1;
    let found;
    for(let i = 0; i < this.length;i++) {
        if (predicate(this[i])) {
            index = i;
            found = this[i];
            break;
        }
    }

    if (index > -1) {
        this.splice(index, 1);
        return found;
    }
    return null;
}

Array.prototype.replaceFirst = function<T>(predicate: (e: T) => boolean, replacement: T): T {
    let index = -1;
    let found;
    for(let i = 0; i < this.length;i++) {
        if (predicate(this[i])) {
            index = i;
            found = this[i];
            break;
        }
    }

    if (index > -1) {
        this.splice(index, 1, replacement);
        return found;
    }
    return null;
}

Array.prototype.removeAll = function<T>(predicate: (e: T) => boolean): void {
    // noinspection StatementWithEmptyBodyJS
    while (this.removeFirst(predicate) !== null);
}

export default Array;



