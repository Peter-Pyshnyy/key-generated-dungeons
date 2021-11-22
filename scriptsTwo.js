let slots = ["up", "right", "down", "left", "up", "right"];
let rooms = [];
let coordinates = [];
let contents = ["hallway", "chest", "chest", "enemy", "enemy"];

class Room {
  constructor(pos) {
    this.pos = pos;
    this.up;
    this.right;
    this.down;
    this.left;
    this.freeSlots = ["up", "right", "down", "left"];
    this.takenSlots = [];
    this.content;
  }

  newPos(dir, prevRoomPos) {
    switch (String(dir)) {
      case "up":
        this.pos = [prevRoomPos[0], prevRoomPos[1] - 1, prevRoomPos[2]];
        break;
      case "right":
        this.pos = [prevRoomPos[0] - 1, prevRoomPos[1], prevRoomPos[2]];
        break;
      case "down":
        this.pos = [prevRoomPos[0], prevRoomPos[1] + 1, prevRoomPos[2]];
        break;

      default:
        this.pos = [prevRoomPos[0] + 1, prevRoomPos[1], prevRoomPos[2]];
        break;
    }
  }
}

//calculates a key to generate rooms
function calculateKey(k1, k2, k3, k4) {
  let sum = k1 * (k2 + k3 + k4);
  let codedKey = Math.sqrt(k1 * sum, 1 / 4);
  return Math.floor((codedKey % 1) * 10);
}

let startRoom = new Room([0, 0, 0]);
rooms.push(startRoom);
coordinates.push(startRoom.pos.join());

function roomsGenerator(k1, k2, k3, k4, sourceRoom) {
  if (k1 === 0) return;
  if (rooms.length > 15) return;

  let key = calculateKey(k1, k2, k3, k4);
  let roomsAmount = Math.floor((sourceRoom.freeSlots.length / 9) * key);
  if (roomsAmount === 0) roomsAmount = 1;
  let newRooms = [];

  for (let i = 0; i < roomsAmount; i++) {
    let room = new Room();
    let dirNum = Math.ceil(((roomsAmount - i) / 9) * key) - 1;
    let sourceDirection = sourceRoom.freeSlots.splice(dirNum, 1)[0]; //locks the slot in the source room
    sourceRoom.takenSlots.push(sourceDirection);
    sourceRoom[sourceDirection] = room; //direrction as the key, new room as argument

    let direction = slots[slots.indexOf(sourceDirection) + 2]; //gets the opposite slot
    let newDirection = room.freeSlots.splice(room.freeSlots.indexOf(direction), 1); //lock the oppocite slot in the new room
    room.takenSlots.push(newDirection[0]);
    room[direction] = sourceRoom; //sourceRoom as an argument, direrction as the key
    room.newPos(direction, sourceRoom.pos);
    if (coordinates.includes(room.pos.join())) room.pos[2] += 1;

    contentGenerator(room, key);
    coordinates.push(room.pos.join());
    newRooms.push(room);
    rooms.push(room);
  }

  newRooms.forEach((e) => {
    roomsGenerator(k1 - 1, k2, k3, k4, e);
  });

  rooms[0].content = "start";
  rooms[1].content = "hallway";
  rooms[2].content = "enemy";
  rooms[rooms.length - 1].content = "boss";
  rooms[rooms.length - 2].content = "chest";
  rooms[rooms.length - 3].content = "hallway";
  rooms[Math.round(rooms.length * (3 / 4))].content = "shop";
  rooms[Math.round(rooms.length * (1 / 3))].content = "shop";
  rooms[Math.round(rooms.length * (1 / 2))].content = "puzzle";
  rooms[Math.round(rooms.length * (1 / 2)) - 1].content = "enemy";
}

function contentGenerator(room, key) {
  let roomType = Math.round(((contents.length - 1) / 9) * key);
  console.log(roomType);
  try {
    room.content = contents[roomType];
  } catch (error) {
    console.log(room);
    console.log(error);
  }
}

roomsGenerator(80, 33, 11, 33, startRoom);

contentGenerator();

export { rooms };

//навколишні кімнати
//розбити генератор на функції
//random + story
