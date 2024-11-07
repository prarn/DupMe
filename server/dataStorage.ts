export let users: {
  sid: string;
  username: string;
  avatar: string;
  roomId: string;
  instrument: string;
  score: number;
  ready: boolean;
  P1: boolean;
}[] = [];

export let rooms: {
  interval: any;
  countdown: number;
  roomId: string;
  round: number;
  players: number;
}[] = [];
