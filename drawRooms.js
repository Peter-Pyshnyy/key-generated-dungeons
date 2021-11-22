import { rooms } from "./scripts.js";
const dungeon = document.getElementById("dungeon");
const directionsMap = new Map();
const contentMap = new Map();

directionsMap.set("up", ["10px", "-10px"]);
directionsMap.set("right", ["30px", "10px"]);
directionsMap.set("down", ["10px", "30px"]);
directionsMap.set("left", ["-10px", "10px"]);

contentMap.set("start", "red");
contentMap.set("enemy", "black");
contentMap.set("chest", "brown");
contentMap.set("hallway", "grey");
contentMap.set("puzzle", "purple");
contentMap.set("shop", "yellow");
contentMap.set("boss", "green");

console.log(rooms);

function drawRoom(room) {
  if (room.pos[2] != 0) return;
  let roomSquare = document.createElement("div");
  roomSquare.classList.add("square");
  dungeon.append(roomSquare);

  roomSquare.style.left = 500 + room.pos[0] * 50 + "px";
  roomSquare.style.bottom = 250 + room.pos[1] * 50 + "px";
  roomSquare.style.background = contentMap.get(room.content);

  roomSquare.innerHTML = room.pos;

  room.takenSlots.forEach((e) => {
    let connection = document.createElement("div");
    connection.classList.add("connection");
    console.log(directionsMap.get(e)[0]);
    connection.style.left = directionsMap.get(e)[0];
    connection.style.top = directionsMap.get(e)[1];
    roomSquare.append(connection);
  });
}

rooms.forEach((e) => {
  drawRoom(e);
});
