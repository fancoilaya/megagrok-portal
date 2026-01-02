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

    // ---------------- STATE ----------------
    this.wave = 1
    this.score = 0
    this.playerHp = 100

    this.inCountdown = true
    this.countdown = 3
    this.countdownTimer = 0

    this.attackCooldown = 350
    this.canAttack = true

    // ---------------- PLAYER (LOGIC) ----------------
    this.player = this.add.circle(400, 250, 14, 0x000000, 0)
    this.physics.add.existing(this.player)
    this.player.body.setCollideWorldBounds(true)

    // ---------------- PLAYER (VISUALS) ----------------
    this.playerCore = this.add.circle(400, 250, 14, 0xff7a00).setDepth(50)
    this.playerGlow = this.add.circle(400, 250, 22, 0xffaa55, 0.25).setDepth(49)

    // ---------------- ENEMIES ----------------
    this.enemies = this.physics.add.group()

    // ---------------- CONTROLS (PC) ----------------
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // ---------------- UI ----------------
    this.uiText = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#ffffff'
    }).setDepth(200)

    this.countdownText = this.add.text(
      400,
      250,
      '',
      { fontSize: '48px', fontStyle: 'bold', color: '#ffffff' }
    ).setOrigin(0.5).setDepth(200)

    // ---------------- MOBILE JOYSTICK ----------------
    this.joyBase = this.add.circle(110, 390, 55, 0x000000, 0.35).setScrollFactor(0)
    this.joyThumb = this.add.circle(110, 390, 28, 0xffffff, 0.6).setScrollFactor(0)
    this.joyVector = { x: 0, y: 0 }
    this.joyPointerId = null

    // ---------------- ATTACK BUTTON ----------------
    this.attackBtn = this.add.circle(690, 390, 48, 0xff7a00, 0.9)
      .setScrollFactor(0)
      .setInteractive()

    this.add.text(676, 372, '🔥', { fontSize: 34 }).setScrollFactor(0)

    this.attackBtn.on('pointerdown', () => this.tryAttack())

    // ---------------- TOUCH INPUT ----------------
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

  // ---------------- WAVES ----------------

  getWaveConfig(wave) {
    if (wave % 5 === 0) {
      return [
        { type: 'tank', count: 1 },
        { type: 'runner', count: Math.min(2 + Math.floor(wave / 5), 4) }
      ]
    }

    if (wave >= 3) {
      return [
        { type: 'grunt', count: 3 + wave },
        { type: 'runner', count: 1 }
      ]
    }

    return [{ type: 'grunt', count: 3 + wave }]
  }

  startCountdown() {
    this.inCountdown = true
    this.countdown = 3
    this.countdownTimer = 0
    this.countdownText.setText(`WAVE ${this.wave}\n${this.countdown}`)
  }

  spawnWave() {
    this.enemies.clear(true, true)

    this.getWaveConfig(this.wave).forEach(group => {
      for (let i = 0; i < group.count; i++) {
        const mob = spawnMob(
          this,
          group.type,
          Phaser.Math.Between(120, 680),
          Phaser.Math.Between(120, 380)
        )

        // --- MOB VISUAL (PASS 0.5) ---
        let visual
        if (mob.type === 'runner') {
          visual = this.add.circle(mob.x, mob.y, mob.size, 0xff9999)
        } else if (mob.type === 'tank') {
          visual = this.add.circle(mob.x, mob.y, mob.size + 4, 0x661111)
          visual.setStrokeStyle(3, 0x330000)
        } else {
          visual = this.add.circle(mob.x, mob.y, mob.size, 0xcc3333)
          visual.setStrokeStyle(2, 0x660000)
        }

        visual.setDepth(40)
        mob.visual = visual
      }
    })
  }

  // ---------------- ATTACK ----------------

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

    // Slash visual
    const g = this.add.graphics().setDepth(120)
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

    // Damage number
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
    ).setOrigin(0.5).setDepth(150)

    this.tweens.add({
      targets: txt,
      y: txt.y - 24,
      alpha: 0,
      duration: 700,
      onComplete: () => txt.destroy()
    })

    if (closest.hp <= 0) {
      closest.hpBar.destroy()
      if (closest.visual) closest.visual.destroy()
      closest.destroy()
      this.score += 100
    }
  }

  // ---------------- UPDATE ----------------

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

    // Sync player visuals
    this.playerCore.setPosition(this.player.x, this.player.y)
    this.playerGlow.setPosition(this.player.x, this.player.y)

    // Enemies
    this.enemies.getChildren().forEach(e => {
      updateMob(this, e, this.player)

      if (e.visual) {
        e.visual.setPosition(e.x, e.y)
      }

      const dist = Phaser.Math.Distance.Between(
        e.x, e.y,
        this.player.x, this.player.y
      )

      if (dist <= e.attackRange) {
        const now = this.time.now
        if (now - e.lastAttack > 700) {
          e.lastAttack = now
          this.playerHp -= e.damage

          // Player hit flash
          this.tweens.add({
            targets: this.playerCore,
            alpha: 0.3,
            duration: 80,
            yoyo: true
          })
        }
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
