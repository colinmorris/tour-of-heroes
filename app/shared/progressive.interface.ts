export interface Progress {
    numerator: number;
    denominator: number;
}

export interface Progressive {
    progress(): Progress;
}
