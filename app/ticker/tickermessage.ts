
export class TickerMessage {
    constructor(
        public text: string,
        public priority: number) {}
}

export enum TickerMessagePriority {
    Info = 3,
    Important = 5,
    Teachable = 7
}
