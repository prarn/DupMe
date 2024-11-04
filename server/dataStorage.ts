//dataStorage.ts
export let users: {
    sid: string, 
    username: string,
    roomId: string, 
    instrument: string,
    score: number, 
    ready: boolean, 
    P1: boolean
}[] = [];

export let rooms: {
    roomId: string,
    round: number, 
    players: number
    turnDirection: "left" | "right";
}[] = [];