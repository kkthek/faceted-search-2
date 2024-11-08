class Tools {

    static findFirst<T>(arr: T[], getKey: (e: T) => string, key: string): T {
        for(let i = 0; i < arr.length;i++) {
            if (getKey(arr[i]) === key) {
                return arr[i];
            }
        }
        return null;
    }

    static removeFirst<T>(arr: T[], getKey: (e: T) => string, key: string): T {
        let index = -1;
        let found;
        for(let i = 0; i < arr.length;i++) {
            if (getKey(arr[i]) === key) {
                index = i;
                found = arr[i];
                break;
            }
        }

        if (index > -1) {
            arr.splice(index, 1);
            return found;
        }
        return null;
    }

    static removeAll<T>(arr: T[], getKey: (e: T) => string, key: string): void {
        while (this.removeFirst(arr, getKey, key) !== null);
    }

}

export default Tools;