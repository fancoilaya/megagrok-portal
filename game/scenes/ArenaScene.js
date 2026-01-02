import Phaser from 'phaser'
import { PLAYER } from '../assets/placeholderSprites'
import {
  createMobVisual,
  updateMobVisual,
  destroyMobVisual
} from '../mobs/mobVisuals'
import { spawnMob } from '../mobs/mobFactory'
import { updateMob } from '../mobs/mobBehaviors'

export default class ArenaScene extends Phaser.Scene {
  constructor(onGameOver) {
    super('ArenaScene')
    this.onGameOver = onGameOver
  }

  create() {
    // ===============================
    // SCENE SETUP
    // ===============================
    this.cameras.main.setBackgroundColor('#0b0b0b')
    this.physics.world.setBounds(0, 0, 800, 500)

    this.wave = 1
    this.score = 0
    this.playerHp = 100

    this.attackCooldown = 350
    this.canAttack = true

    // ===============================
    // PLAYER (LOGIC)
    // ===============================
    this.player = this.physics.add.circle(400, 250, PLAYER.radius)
    this.player.setCollideWorldBounds(true)

    // ===============================
    // PLAYER (VISUAL)
    // ===============================
    this.playerRing = this.add.circle(
      400, 250,
      PLAYER.radius + 10,
      PLAYER.ringColor,
      0.25
    ).setDepth(9)

    this.playerCore = this.add.circle(
      400, 250,
      PLAYER.radius,
      PLAYER.coreColor
    ).setDepth(10)

    // ===============================
    // ENEMIES
    // ===============================
    this.enemies = this.physics.add.group()

    // ===============================
    // INPUT
    // ===============================
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // ===============================
    // UI
    // ===============================
    this.uiText = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#ffffff'
    }).setDepth(100)

    // ===============================
    // SPAWN FIRST WAVE IMMEDIATELY
    // ===============================
    this.spawnWave()
  }

  spawnWave() {
    this.enemies.clear(true, true)

    const count = 3 + this.wave

    for (let i = 0; i < count; i++) {
      const mob = spawnMob(
        this,
        'grunt',
        Phaser.Math.Between(80, 720),
        Phaser.Math.Between(80, 420)
      )

      createMobVisual(this, mob)
    }
  }

  tryAttack() {
    if (!this.canAttack) return
    this.canAttack = false
    this.attack()
    this.time.delayedCall(this.attackCooldown, () => {
      this.canAttack = true
    })
  }

  attack() {
    const mobs = this.enemies.getChildren()
    if (!mobs.length) return

    let closest = null
    let minDist = Infinity

    mobs.forEach(m => {
      const d = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, m.x, m.y
      )
      if (d < minDist) {
        minDist = d
        closest = m
      }
    })

    if (!closest || minDist > 150) return

    const dmg = Phaser.Math.Between(10, 14)
    closest.hp -= dmg

    // DAMAGE NUMBER
    const txt = this.add.text(
      closest.x,
      closest.y - 20,
      `-${dmg}`,
      {
        fontSize: '16px',
        color: '#ff4444',
        stroke: '#000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setDepth(200)

    this.tweens.add({
      targets: txt,
      y: txt.y - 25,
      alpha: 0,
      duration: 600,
      onComplete: () => txt.destroy()
    })

    if (closest.hp <= 0) {
      destroyMobVisual(closest)
      closest.destroy()
      this.score += 100
    }
  }

  update() {
    // ===============================
    // MOVEMENT
    // ===============================
    const speed = 180
    let vx = 0
    let vy = 0

    if (this.keys.A.isDown || this.cursors.left.isDown) vx -= speed
    if (this.keys.D.isDown || this.cursors.right.isDown) vx += speed
    if (this.keys.W.isDown || this.cursors.up.isDown) vy -= speed
    if (this.keys.S.isDown || this.cursors.down.isDown) vy += speed

    this.player.setVelocity(vx, vy)

    if (this.keys.SPACE.isDown) {
      this.tryAttack()
    }

    // ===============================
    // SYNC PLAYER VISUAL
    // ===============================
    this.playerCore.setPosition(this.player.x, this.player.y)
    this.playerRing.setPosition(this.player.x, this.player.y)

    // ===============================
    // ENEMIES
    // ===============================
    this.enemies.getChildren().forEach(mob => {
      updateMob(this, mob, this.player)
      updateMobVisual(mob)

      const dist = Phaser.Math.Distance.Between(
        mob.x, mob.y,
        this.player.x, this.player.y
      )

      if (dist < mob.attackRange) {
        this.playerHp -= mob.damage * 0.02
      }
    })

    if (this.enemies.countActive() === 0) {
      this.wave++
      this.spawnWave()
    }

    this.uiText.setText(
      `❤️ ${Math.floor(this.playerHp)}   🌊 Wave ${this.wave}   🏆 ${this.score}`
    )

    if (this.playerHp <= 0) {
      this.onGameOver({ score: this.score, wave: this.wave })
      this.scene.stop()
    }
  }
}
