// game/mobs/mobBehaviors.js
import Phaser from 'phaser'

export function updateMob(scene, mob, player, delta) {
  scene.physics.moveToObject(mob, player, mob.speed)

  // HP bar follow
  mob.hpBar.setPosition(
    mob.x,
    mob.y - (mob.size + 10)
  )

  const maxWidth = mob.size * 1.6
  mob.hpBar.width = Phaser.Math.Clamp(
    (mob.hp / mob.maxHp) * maxWidth,
    0,
    maxWidth
  )
}
