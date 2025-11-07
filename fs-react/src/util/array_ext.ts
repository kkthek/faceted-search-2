declare global {
    interface Array<T> {
        createUniqueArray(getKey: (e: T) => string): Array<T>;
        findFirst<T>(predicate: (e: T) => boolean): T;
        removeFirst<T>(predicate: (e: T) => boolean): T;
        replaceFirst<T>(predicate: (e: T) => boolean, replacement: T): T;
        removeAll<T>(predicate: (e: T) => boolean): void;
        containsOrEmpty(value: T): boolean;
        splitArray2NTuples<T>(size: number): T[][];
        reorder(order: number[]) : T[];
        intersect(getKey: (e: T) => string, keyArrayToIntersect: string[]): T[]
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

Array.prototype.containsOrEmpty = function<T>(value: T): boolean {
    return this.length === 0 || this.includes(value);
}

Array.prototype.splitArray2NTuples = function<T>(size: number): T[][] {
    let results: T[][] = [];
    let length = Math.trunc(this.length / size);
    length += this.length % size === 0 ? 0 : 1;
    for(let i = 0; i < length; i++) {
        let row: T[] = [];
        for(let j = 0; j < size; j++) {
            if (this[i*size+j]) {
                row.push(this[i*size+j]);
            }
        }
        results.push(row);
    }
    return results;
}

Array.prototype.reorder = function<T>(order: number[]): T[] {
    let results: T[] = [];
    for(let i = 0; i < this.length; i++) {
        results[i] = order[i] !== undefined ? this[order[i]] : undefined;
    }
    return results;
}

Array.prototype.intersect = function<T>(getKey: (e: T) => string, keyArrayToIntersect: string[]) {
    return this.filter((v: T) => {
        const value = getKey(v);
        return keyArrayToIntersect.includes(value);
    });
}

export default Array;



