// game/mobs/mobFactory.js

import { MOB_TYPES } from './mobRegistry'

export function spawnMob(scene, typeKey, x, y) {
  const def = MOB_TYPES[typeKey]

  const mob = scene.add.circle(
    x,
    y,
    def.size,
    def.color
  )

  scene.physics.add.existing(mob)
  mob.body.setCollideWorldBounds(true)

  mob.type = def.id
  mob.behavior = def.behavior
  mob.hp = def.hp
  mob.maxHp = def.hp
  mob.speed = def.speed
  mob.damage = def.damage

  mob.hpBar = scene.add.rectangle(
    mob.x,
    mob.y - (def.size + 6),
    def.size * 1.5,
    4,
    0xff0000
  ).setOrigin(0.5)

  scene.enemies.add(mob)
  return mob
}
