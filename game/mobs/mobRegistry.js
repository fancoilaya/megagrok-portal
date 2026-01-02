// game/mobs/mobRegistry.js

export const MOB_TYPES = {
  grunt: {
    id: 'grunt',
    name: 'Grok Grunt',
    hp: 40,
    speed: 80,
    damage: 1,
    size: 12,
    color: 0xff4444,
    behavior: 'melee'
  },

  runner: {
    id: 'runner',
    name: 'Swift Grok',
    hp: 25,
    speed: 130,
    damage: 0.8,
    size: 10,
    color: 0xffaa00,
    behavior: 'melee'
  },

  tank: {
    id: 'tank',
    name: 'Iron Grok',
    hp: 120,
    speed: 40,
    damage: 2,
    size: 18,
    color: 0x884444,
    behavior: 'melee'
  }
}
