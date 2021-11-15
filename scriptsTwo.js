let slots = ["up", "right", "down", "left", "up", "right"];
let rooms = [];

class Room {
  constructor(pos, fromSlot) {
    this.pos = pos;
    this.up;
    this.right;
    this.down;
    this.left;
    this.freeSlots = ["up", "right", "down", "left"];
  }
}

//calculates a key to generate rooms
function calculateKey(k1, k2, k3, k4) {
  let codedKey = Math.sqrt(k1 * (k2 + k3 + k4));
  return Math.floor((codedKey % 1) * 10);
}

let startRoom = new Room();

function roomsGenerator(k1, k2, k3, k4, sourceRoom) {
  if (k1 === 0) return;

  let key = calculateKey(k1, k2, k3, k4);
  let roomsAmount = Math.round((3 / 9) * key);
  if (roomsAmount === 0) roomsAmount = 1;
  let newRooms = [];

  for (let i = 0; i < roomsAmount; i++) {
    let room = new Room();
    let sourceDirection = sourceRoom.freeSlots.splice(0, 1)[0]; //locks the first slot
    sourceRoom[sourceDirection] = room; //room as an argument, direrction as the key

    let direction = slots[slots.indexOf(sourceDirection) + 2]; //gets the opposite slot
    room.freeSlots.splice(room.freeSlots.indexOf(direction), 1); //lock the oppocite slot in the new room
    room[direction] = sourceRoom; //sourceRoom as an argument, direrction as the key

    newRooms.push(room);
    rooms.push(room);
  }

  newRooms.forEach((e) => {
    roomsGenerator(k1 - 1, k2, k3, k4, e);
  });
}

roomsGenerator(5, 3, 4, 9, startRoom);
console.log(rooms);

//навколишні кімнати
