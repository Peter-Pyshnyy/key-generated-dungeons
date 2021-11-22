let slotsWheel = ["up", "right", "down", "left", "up", "right"];
let rooms = [];
let coordinates = [];
let contents = ["hallway", "chest", "chest", "enemy", "enemy"];

class Room {
  constructor() {
    this.pos;
    this.up;
    this.right;
    this.down;
    this.left;
    this.freeSlots = ["up", "right", "down", "left"];
    this.takenSlots = [];
    this.content;
  }

  //changes the coordinates of the room
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
  let sum = k1 * (k2 + k3 * 2 + k4 * 3);
  let codedKey = Math.sqrt(k1 * sum, 1 / 4);
  let key = Math.floor((codedKey % 1) * 10);
  if (key === 0) calculateKey(k1, k2 + 1, k3, k4);
  key = 9; //може поміняти
  return key;
}

//generates a map
function dungeonGenerator(k1, k2, k3, k4, sourceRoom) {
  if (k1 === 0 || rooms.length > 15) {
    //end of the recursion + some predefined room-contents
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

    return;
  }

  let key = calculateKey(k1, k2, k3, k4);
  let newRooms = roomsGenerator(key, sourceRoom);

  //recursion for every new room (tree-like)
  newRooms.forEach((e) => {
    dungeonGenerator(k1 - 1, k2, k3, k4, e);
  });
}

//creates new room(s) around of the sourceRoom
function roomsGenerator(key, sourceRoom) {
  let newRoomsAmount = Math.floor((sourceRoom.freeSlots.length / 9) * key); //determines the amount of new rooms
  console.log(key);
  if (newRoomsAmount === 0) newRoomsAmount = 1;
  let newRooms = [];

  for (let i = 0; i < newRoomsAmount; i++) {
    let room = new Room();
    let directionNum = Math.ceil(((newRoomsAmount - i) / 9) * key) - 1; //at which side will be the exit as a num
    let sourceDirection = sourceRoom.freeSlots.splice(directionNum, 1)[0];
    sourceRoom.takenSlots.push(sourceDirection);
    sourceRoom[sourceDirection] = room; //new room becomes an argument, direction as key

    let oppositeDirection = slotsWheel[slotsWheel.indexOf(sourceDirection) + 2]; //determines the opposite direction to that of the sourceRoom
    let newDirection = room.freeSlots.splice(room.freeSlots.indexOf(oppositeDirection), 1);
    room.takenSlots.push(newDirection[0]);
    room[oppositeDirection] = sourceRoom; //sourceRoom becomes an argument, direction as key
    room.newPos(oppositeDirection, sourceRoom.pos);
    if (coordinates.includes(room.pos.join())) room.pos[2] += 1; //if there already is a room in that place -> +1 floor

    contentGenerator(room, key);
    coordinates.push(room.pos.join());
    rooms.push(room);
    newRooms.push(room);
  }

  return newRooms;
}

function contentGenerator(room, key) {
  let typeNumber = Math.round(((contents.length - 1) / 9) * key); //a content type is picked based on the key
  try {
    room.content = contents[typeNumber];
  } catch (error) {
    console.log(room);
    console.log(error);
  }
}

//the first room
let startRoom = new Room();
startRoom.pos = [0, 0, 0];
rooms.push(startRoom);
coordinates.push(startRoom.pos.join());

dungeonGenerator(25, 6, 9, 4, startRoom);

export { rooms };
