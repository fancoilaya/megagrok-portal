// game/visuals/visualFactory.js

export function createPlayerVisual(scene, x, y) {
  const core = scene.add.circle(x, y, 14, 0xff7a00)
  const glow = scene.add.circle(x, y, 20, 0xffaa55, 0.2)

  core.setDepth(50)
  glow.setDepth(49)

  return { core, glow }
}

export function createMobVisual(scene, mob) {
  let visual

  switch (mob.type) {
    case 'runner':
      visual = scene.add.circle(mob.x, mob.y, mob.size, 0xff8888)
      break

    case 'tank':
      visual = scene.add.circle(mob.x, mob.y, mob.size + 4, 0x881111)
      visual.setStrokeStyle(3, 0x440000)
      break

    default: // grunt
      visual = scene.add.circle(mob.x, mob.y, mob.size, 0xcc3333)
      visual.setStrokeStyle(2, 0x660000)
  }

  visual.setDepth(40)
  return visual
}
