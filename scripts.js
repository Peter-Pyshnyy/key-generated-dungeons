class Room {
  constructor(pos) {
    this.pos = pos; //position on the coordinate plane
    this.freeSlots = ["up", "right", "down", "left"]; //points with no interroom connection
    this.takenSlots = [];
  }

  //closes the slot x
  connectFrom(x) {
    let slot = this.freeSlots.splice(x, 1)[0];
    this.takenSlots.push(slot);
    console.log(slot);
  }

  //updates the coordinates and closes the slot opposite to the one that closed in the previous room
  connectTo(x, prevRoomPos) {
    switch (String(x)) {
      case "up":
        this.pos = [prevRoomPos[0], prevRoomPos[1] + 1];
        this.freeSlots.splice(this.freeSlots.indexOf("down"), 1);
        this.takenSlots.push("down");
        break;
      case "right":
        this.pos = [prevRoomPos[0] + 1, prevRoomPos[1]];
        this.freeSlots.splice(this.freeSlots.indexOf("left"), 1);
        this.takenSlots.push("left");
        break;
      case "down":
        this.pos = [prevRoomPos[0], prevRoomPos[1] - 1];
        this.freeSlots.splice(this.freeSlots.indexOf("up"), 1);
        this.takenSlots.push("up");
        break;

      default:
        this.pos = [prevRoomPos[0] - 1, prevRoomPos[1]];
        this.freeSlots.splice(this.freeSlots.indexOf("right"), 1);
        this.takenSlots.push("right");
        break;
    }
    console.log(this.takenSlots);
  }
}

let rooms = new Map();
let roomsArray = [];

//calculates a key to generate rooms
function calculateKey(amount, k1, k2, k3) {
  let codedKey = Math.sqrt(amount * (k1 + k2 + k3));
  return Math.floor((codedKey % 1) * 10);
}

//generates a room based on the key and on the previous room
function roomsGenerator(amount, k1, k2, k3, prevRoom) {
  if (amount === 0) return;

  let room = new Room();
  let key = calculateKey(amount, k1, k2, k3);

  let connection = Math.round(((prevRoom.freeSlots.length - 1) / 9) * key); //which side will be connected to the next room (which slot closed)
  prevRoom.connectFrom(connection);
  room.connectTo(prevRoom.takenSlots[prevRoom.takenSlots.length - 1], prevRoom.pos); //slots of the previous room are use because of their inconsistencies

  rooms.set(`${room.pos[0]}${room.pos[1]}`, room);
  roomsArray.push(room.pos);

  roomsGenerator(amount - 1, k1, k2, k3, room); //recursion (зробити тута рандомну коробку)
}

//looks for rooms on surrounding coordinates to prevent generating "the same" room twice (добавити кудась у начало генератора коробок)
function checkAround(room) {
  let arr = roomsArray;

  let filteredArr = arr.filter((e) => {
    console.log(e);
    return (
      (e[0] === room.pos[0] && e[1] <= room.pos[1] + 1 && e[1] >= room.pos[1] - 1) || //X axis
      (e[1] === room.pos[1] && e[0] <= room.pos[0] + 1 && e[0] >= room.pos[0] - 1) //Y axis
    );
  });

  filteredArr.forEach((e) => {
    let neighbour = rooms.get(`${e[0]}${e[1]}`);
  });
  // return filteredArr;
}

roomsGenerator(10, 5, 2, 8, new Room([0, 0]));

console.log(rooms);
console.log(roomsArray);

let fArr = checkAround(rooms.get("4-1"));
fArr.forEach((e) => {
  console.log(rooms.get(`${e[0]}${e[1]}`)); //get the surrounding rooms
});
