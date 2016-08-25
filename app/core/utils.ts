
export function randomChoice<T>(arr:Array<T>) : T {
    console.assert(arr.length > 0);
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

export function formatPct(num: number, decimalPlaces=0) : string {
    return (num*100).toFixed(decimalPlaces) + '%';
}
