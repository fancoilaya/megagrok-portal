import Phaser from 'phaser'
import { spawnMob } from '../mobs/mobFactory'
import { updateMob } from '../mobs/mobBehaviors'

export default class ArenaScene extends Phaser.Scene {
  constructor(onGameOver) {
    super('ArenaScene')
    this.onGameOver = onGameOver
  }

  create() {
    this.input.addPointer(2)

    // ---- GAME STATE ----
    this.wave = 1
    this.score = 0
    this.playerHp = 100
    this.inCountdown = true
    this.countdown = 3
    this.countdownTimer = 0

    this.attackCooldown = 350
    this.canAttack = true

    // ---- PLAYER ----
    this.player = this.add.circle(400, 250, 14, 0xff7a00).setDepth(10)
    this.physics.add.existing(this.player)
    this.player.body.setCollideWorldBounds(true)

    // ---- ENEMIES ----
    this.enemies = this.physics.add.group()

    // ---- PC CONTROLS ----
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // ---- UI ----
    this.uiText = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#ffffff'
    }).setDepth(100)

    this.countdownText = this.add.text(
      400,
      250,
      '',
      { fontSize: '48px', fontStyle: 'bold', color: '#ffffff' }
    ).setOrigin(0.5).setDepth(100)

    // ---- MOBILE JOYSTICK ----
    this.joyBase = this.add.circle(110, 390, 55, 0x000000, 0.35)
      .setScrollFactor(0)
      .setDepth(100)

    this.joyThumb = this.add.circle(110, 390, 28, 0xffffff, 0.6)
      .setScrollFactor(0)
      .setDepth(101)

    this.joyVector = { x: 0, y: 0 }
    this.joyPointerId = null

    // ---- ATTACK BUTTON ----
    this.attackBtn = this.add.circle(690, 390, 48, 0xff7a00, 0.9)
      .setScrollFactor(0)
      .setDepth(100)
      .setInteractive({ useHandCursor: true })

    this.add.text(676, 372, '🔥', {
      fontSize: '34px'
    }).setScrollFactor(0).setDepth(101)

    this.attackBtn.on('pointerdown', () => this.tryAttack())

    // ---- TOUCH INPUT ----
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

  // ---- WAVES ----
  getWaveConfig(wave) {
    if (wave % 5 === 0) {
      return {
        mobs: [{ type: 'tank', count: 1 }]
      }
    }
    return {
      mobs: [{ type: 'grunt', count: Math.min(3 + wave, 7) }]
    }
  }

  startCountdown() {
    this.inCountdown = true
    this.countdown = 3
    this.countdownTimer = 0
    this.countdownText.setText(`WAVE ${this.wave}\n${this.countdown}`)
  }

  spawnWave() {
    this.enemies.clear(true, true)
    const cfg = this.getWaveConfig(this.wave)

    cfg.mobs.forEach(g => {
      for (let i = 0; i < g.count; i++) {
        spawnMob(
          this,
          g.type,
          Phaser.Math.Between(120, 680),
          Phaser.Math.Between(120, 380)
        )
      }
    })
  }

  // ---- ATTACK ----
  tryAttack() {
    if (!this.canAttack || this.inCountdown) return
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
      closest.y - closest.size - 16,
      `-${dmg}`,
      {
        fontSize: '16px',
        color: '#ff4444',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setDepth(200)

    this.tweens.add({
      targets: txt,
      y: txt.y - 24,
      alpha: 0,
      duration: 700,
      ease: 'Cubic.easeOut',
      onComplete: () => txt.destroy()
    })

    // SLASH LINE
    const g = this.add.graphics().setDepth(150)
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

  // ---- UPDATE LOOP ----
  update(_, delta) {
    if (this.inCountdown) {
      this.player.body.setVelocity(0, 0)
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
      return
    }

    // Movement
    const speed = 180
    let vx = this.joyVector.x * speed
    let vy = this.joyVector.y * speed

    if (this.keys.A.isDown || this.cursors.left.isDown) vx -= speed
    if (this.keys.D.isDown || this.cursors.right.isDown) vx += speed
    if (this.keys.W.isDown || this.cursors.up.isDown) vy -= speed
    if (this.keys.S.isDown || this.cursors.down.isDown) vy += speed

    this.player.body.setVelocity(vx, vy)

    if (this.keys.SPACE.isDown) this.tryAttack()

    // Enemies
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
