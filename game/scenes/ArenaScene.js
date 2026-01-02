import Phaser from 'phaser'
import { spawnMob } from '../mobs/mobFactory'
import { updateMob } from '../mobs/mobBehaviors'

export default class ArenaScene extends Phaser.Scene {
  constructor(onGameOver) {
    super('ArenaScene')
    this.onGameOver = onGameOver
  }

  create() {
    // Enable multitouch
    this.input.addPointer(2)

    this.wave = 1
    this.score = 0
    this.playerHp = 100

    this.inCountdown = true
    this.countdown = 3
    this.countdownTimer = 0

    this.attackCooldown = 350
    this.canAttack = true

    // Player
    this.player = this.add.circle(400, 250, 14, 0xff7a00)
    this.physics.add.existing(this.player)
    this.player.body.setCollideWorldBounds(true)

    // Enemies
    this.enemies = this.physics.add.group()

    // Controls (PC)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // UI
    this.uiText = this.add.text(10, 10, '', { fontSize: 14, color: '#fff' })
    this.countdownText = this.add.text(
      400, 250, '',
      { fontSize: '48px', fontStyle: 'bold', color: '#fff' }
    ).setOrigin(0.5)

    // Mobile joystick
    this.joyBase = this.add.circle(110, 390, 55, 0x000000, 0.35).setScrollFactor(0)
    this.joyThumb = this.add.circle(110, 390, 28, 0xffffff, 0.6).setScrollFactor(0)
    this.joyVector = { x: 0, y: 0 }
    this.joyPointerId = null

    // Attack button
    this.attackBtn = this.add.circle(690, 390, 48, 0xff7a00, 0.9)
      .setScrollFactor(0)
      .setInteractive()
    this.add.text(676, 372, '🔥', { fontSize: 34 }).setScrollFactor(0)
    this.attackBtn.on('pointerdown', () => this.tryAttack())

    // Touch input
    this.input.on('pointerdown', p => {
      if (p.x < this.scale.width / 2 && this.joyPointerId === null) {
        this.joyPointerId = p.id
      }
    })

    this.input.on('pointermove', p => {
      if (p.id !== this.joyPointerId) return
      const dx = p.x - this.joyBase.x
      const dy = p.y - this.joyBase.y
      const dist = Math.min(Math.hypot(dx, dy), 45)
      const angle = Math.atan2(dy, dx)

      this.joyThumb.setPosition(
        this.joyBase.x + Math.cos(angle) * dist,
        this.joyBase.y + Math.sin(angle) * dist
      )
      this.joyVector.x = Math.cos(angle) * (dist / 45)
      this.joyVector.y = Math.sin(angle) * (dist / 45)
    })

    this.input.on('pointerup', p => {
      if (p.id === this.joyPointerId) {
        this.joyPointerId = null
        this.joyThumb.setPosition(this.joyBase.x, this.joyBase.y)
        this.joyVector.x = 0
        this.joyVector.y = 0
      }
    })

    this.startCountdown()
  }

  startCountdown() {
    this.inCountdown = true
    this.countdown = 3
    this.countdownTimer = 0
    this.countdownText.setText(`WAVE ${this.wave}\n${this.countdown}`)
  }

  updateCountdown(delta) {
    this.countdownTimer += delta
    if (this.countdownTimer >= 1000) {
      this.countdownTimer = 0
      this.countdown--
      if (this.countdown > 0) {
        this.countdownText.setText(`WAVE ${this.wave}\n${this.countdown}`)
      } else {
        this.countdownText.setText('')
        this.inCountdown = false
        this.spawnWave()
      }
    }
  }

  spawnWave() {
    this.enemies.clear(true, true)

    const types = ['grunt', 'runner', 'tank']
    const count = Math.min(3 + this.wave, 10)

    for (let i = 0; i < count; i++) {
      const type = Phaser.Utils.Array.GetRandom(types)
      spawnMob(
        this,
        type,
        Phaser.Math.Between(120, 680),
        Phaser.Math.Between(120, 380)
      )
    }
  }

  tryAttack() {
    if (!this.canAttack || this.inCountdown) return
    this.canAttack = false
    this.attack()
    this.time.delayedCall(this.attackCooldown, () => {
      this.canAttack = true
    })
  }

  attack() {
    const list = this.enemies.getChildren()
    if (!list.length) return

    let closest = null
    let minDist = Infinity

    list.forEach(e => {
      const d = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, e.x, e.y
      )
      if (d < minDist) {
        minDist = d
        closest = e
      }
    })

    if (!closest || minDist > 150) return

    const dmg = Phaser.Math.Between(10, 14)
    closest.hp -= dmg

    const g = this.add.graphics()
    g.lineStyle(3, 0xffaa00, 1)
    g.beginPath()
    g.moveTo(this.player.x, this.player.y)
    g.lineTo(closest.x, closest.y)
    g.strokePath()
    this.tweens.add({
      targets: g,
      alpha: 0,
      duration: 120,
      onComplete: () => g.destroy()
    })

    if (closest.hp <= 0) {
      closest.hpBar.destroy()
      closest.destroy()
      this.score += 100
    }
  }

  update(_, delta) {
    if (this.inCountdown) {
      this.player.body.setVelocity(0, 0)
      this.updateCountdown(delta)
      return
    }

    const speed = 180
    let vx = this.joyVector.x * speed
    let vy = this.joyVector.y * speed

    if (this.cursors.left.isDown || this.keys.A.isDown) vx -= speed
    if (this.cursors.right.isDown || this.keys.D.isDown) vx += speed
    if (this.cursors.up.isDown || this.keys.W.isDown) vy -= speed
    if (this.cursors.down.isDown || this.keys.S.isDown) vy += speed

    this.player.body.setVelocity(vx, vy)
    if (this.keys.SPACE.isDown) this.tryAttack()

    this.enemies.getChildren().forEach(e => {
      updateMob(this, e, this.player, delta)
      if (
        Phaser.Math.Distance.Between(
          e.x, e.y,
          this.player.x, this.player.y
        ) < 18
      ) {
        this.playerHp -= e.damage * delta * 0.05
      }
    })

    if (this.enemies.countActive() === 0) {
      this.wave++
      this.startCountdown()
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
