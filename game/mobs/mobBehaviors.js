// game/mobs/mobBehaviors.js

import Phaser from 'phaser'

export function updateMob(scene, mob, player, delta) {
  const dist = Phaser.Math.Distance.Between(
    mob.x,
    mob.y,
    player.x,
    player.y
  )

  switch (mob.behavior) {
    case 'melee':
      scene.physics.moveToObject(mob, player, mob.speed)
      break
  }

  // HP bar sync
  mob.hpBar.setPosition(
    mob.x,
    mob.y - (mob.body.radius + 6)
  )

  const barWidth = mob.body.radius * 2
  mob.hpBar.width = (mob.hp / mob.maxHp) * barWidth
}
