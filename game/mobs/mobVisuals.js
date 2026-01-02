// game/mobs/mobVisuals.js
import { MOBS, PROJECTILE } from '../assets/placeholderSprites'

export function createMobVisual(scene, mob) {
  const cfg = MOBS[mob.type]

  const body = scene.add.circle(
    mob.x,
    mob.y,
    cfg.radius,
    cfg.color
  ).setDepth(40)

  body.setStrokeStyle(3, cfg.stroke)

  mob.visual = body
}

export function updateMobVisual(mob) {
  if (!mob.visual) return
  mob.visual.setPosition(mob.x, mob.y)
}

export function destroyMobVisual(mob) {
  if (mob.visual) mob.visual.destroy()
}

export function createProjectileVisual(scene, projectile) {
  projectile.visual = scene.add.circle(
    projectile.x,
    projectile.y,
    PROJECTILE.radius,
    PROJECTILE.color
  ).setDepth(60)
}

export function updateProjectileVisual(projectile) {
  if (projectile.visual) {
    projectile.visual.setPosition(projectile.x, projectile.y)
  }
}

export function destroyProjectileVisual(projectile) {
  if (projectile.visual) projectile.visual.destroy()
}
