import { rooms } from "./scriptsTwo.js";
const btn = document.getElementById("btn");
const input = document.getElementById("input");
const content = document.getElementById("content");

class Player {
  constructor(hp, weapon, potions, currentRoom) {
    this.hp = hp;
    this.weapon = weapon;
    this.potions = potions;
    this.currentRoom = currentRoom;
  }

  move(direction) {
    if (this.currentRoom[direction]) {
      this.currentRoom = this.currentRoom[direction];
    }
  }
}

let player = new Player(10, "sword", 5, rooms[0]);
content.innerHTML = `${player.currentRoom.pos} - ${player.currentRoom.content}`;

btn.addEventListener("click", (e) => {
  player.move(input.value);
  content.innerHTML = `${player.currentRoom.pos} - ${player.currentRoom.content}`;
});

//Peter
