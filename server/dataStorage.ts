// dataStorage.ts

// List of all users
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

// List of all rooms
export let rooms: {
  roomId: string;
  round: number;
  players: number;
}[] = [];

// Helper function to find a user by their session ID (sid)
export const getUserBySid = (sid: string) => {
  return users.find((user) => user.sid === sid);
};

// Helper function to find a room by room ID
export const getRoomById = (roomId: string) => {
  return rooms.find((room) => room.roomId === roomId);
};

// Helper function to add a user
export const addUser = (sid: string, username: string, avatar: string, roomId: string, instrument: string) => {
  const newUser = {
    sid,
    username,
    avatar,
    roomId,
    instrument,
    score: 0,
    ready: false,
    P1: false,
  };
  users.push(newUser);
};

// Helper function to remove a user by their session ID (sid)
export const removeUser = (sid: string) => {
  const index = users.findIndex((user) => user.sid === sid);
  if (index !== -1) {
    users.splice(index, 1);
  }
};

// Helper function to add a room
export const addRoom = (roomId: string) => {
  const newRoom = {
    roomId,
    round: 0,
    players: 0,
  };
  rooms.push(newRoom);
};

// Helper function to remove a room by room ID
export const removeRoom = (roomId: string) => {
  const index = rooms.findIndex((room) => room.roomId === roomId);
  if (index !== -1) {
    rooms.splice(index, 1);
  }
};

// Helper function to increase the player count for a room
export const incrementPlayerCountInRoom = (roomId: string) => {
  const room = getRoomById(roomId);
  if (room) {
    room.players += 1;
  }
};

// Helper function to reset the room state
export const resetRoomState = (roomId: string) => {
  const room = getRoomById(roomId);
  if (room) {
    room.round = 0;
    room.players = 0;
  }
};

