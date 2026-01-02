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
  mob.setDepth(10) // mobs

  scene.physics.add.existing(mob)
  mob.body.setCollideWorldBounds(true)

  mob.type = def.id
  mob.behavior = def.behavior
  mob.hp = def.hp
  mob.maxHp = def.hp
  mob.speed = def.speed
  mob.damage = def.damage
  mob.size = def.size

  // HP BAR (ALWAYS ABOVE MOB)
  mob.hpBar = scene.add.rectangle(
    mob.x,
    mob.y - (def.size + 10),
    def.size * 1.6,
    4,
    0xff0000
  )
  mob.hpBar.setOrigin(0.5)
  mob.hpBar.setDepth(20) // above mob

  scene.enemies.add(mob)
  return mob
}
