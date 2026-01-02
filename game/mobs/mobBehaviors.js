// game/mobs/mobBehaviors.js
import Phaser from 'phaser'

export function updateMob(scene, mob, player) {
  const dist = Phaser.Math.Distance.Between(
    mob.x, mob.y,
    player.x, player.y
  )

  if (dist > mob.attackRange) {
    scene.physics.moveToObject(mob, player, mob.speed)
  } else {
    mob.body.setVelocity(0, 0)
  }

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
