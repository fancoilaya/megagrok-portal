// game/mobs/mobRegistry.js

export const MOB_TYPES = {
  grunt: {
    id: 'grunt',
    hp: 30,
    speed: 80,
    damage: 8,
    size: 10,
    color: 0xff4444,
    attackRange: 18,
    followRange: 9999
  },

  runner: {
    id: 'runner',
    hp: 22,
    speed: 120,
    damage: 6,
    size: 9,
    color: 0xff7777,
    attackRange: 15,
    followRange: 9999
  },

  tank: {
    id: 'tank',
    hp: 120,
    speed: 40,
    damage: 15,
    size: 16,
    color: 0xaa2222,
    attackRange: 20,
    followRange: 9999
  }

  // ranged mobs will be added later cleanly
}
