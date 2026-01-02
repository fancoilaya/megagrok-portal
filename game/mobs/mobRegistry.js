// game/mobs/mobRegistry.js

export const MOB_TYPES = {
  grunt: {
    id: 'grunt',
    hp: 35,
    speed: 80,
    damage: 6,
    size: 10,
    color: 0xff4444,
    attackRange: 18
  },

  runner: {
    id: 'runner',
    hp: 22,
    speed: 120,
    damage: 5,
    size: 9,
    color: 0xff7777,
    attackRange: 15
  },

  tank: {
    id: 'tank',
    hp: 260,              // ⬆ boss HP
    speed: 38,
    damage: 18,           // ⬆ boss damage
    size: 18,
    color: 0xaa2222,
    attackRange: 26       // ⬆ boss reach
  }
}
