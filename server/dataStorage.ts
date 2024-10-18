export let users: {
    sid: string, 
    roomId: string, 
    score: number, 
    ready: boolean, 
    P1: boolean
}[] = [];

export let rooms: {
    roomId: string,
    round: number, 
    players: number
}[] = [];