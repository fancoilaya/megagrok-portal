import Phaser from 'phaser'

export default class ArenaScene extends Phaser.Scene {
  constructor(onGameOver) {
    super('ArenaScene')
    this.onGameOver = onGameOver
  }

  create() {
    this.wave = 1
    this.score = 0
    this.hp = 100

    this.inCountdown = true
    this.countdownValue = 3
    this.countdownTimer = 0

    this.canAttack = true
    this.attackCooldown = 350

    // Player
    this.player = this.add.circle(400, 250, 14, 0xff7a00)
    this.physics.add.existing(this.player)
    this.player.body.setCollideWorldBounds(true)

    // Enemies group (Arcade Physics group)
    this.enemies = this.physics.add.group()

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // Mobile joystick
    this.joystickBase = this.add.circle(90, 410, 35, 0x000000, 0.35).setScrollFactor(0)
    this.joystickThumb = this.add.circle(90, 410, 18, 0xffffff, 0.6).setScrollFactor(0)
    this.joystickVector = { x: 0, y: 0 }
    this.activePointerId = null

    // Attack button
    this.attackButton = this.add.circle(710, 410, 32, 0xff7a00, 0.8)
      .setScrollFactor(0)
      .setInteractive()
    this.attackIcon = this.add.text(702, 398, '🔥', { fontSize: 24 }).setScrollFactor(0)
    this.attackButton.on('pointerdown', () => this.tryAttack())

    // Touch input
    this.input.on('pointerdown', p => {
      if (!this.inCountdown && p.x < this.scale.width / 2) {
        this.activePointerId = p.id
      }
    })

    this.input.on('pointermove', p => {
      if (p.id !== this.activePointerId) return

      const dx = p.x - this.joystickBase.x
      const dy = p.y - this.joystickBase.y
      const dist = Math.min(Math.hypot(dx, dy), 30)
      const ang = Math.atan2(dy, dx)

      this.joystickThumb.setPosition(
        this.joystickBase.x + Math.cos(ang) * dist,
        this.joystickBase.y + Math.sin(ang) * dist
      )

      this.joystickVector.x = Math.cos(ang) * (dist / 30)
      this.joystickVector.y = Math.sin(ang) * (dist / 30)
    })

    this.input.on('pointerup', () => {
      this.activePointerId = null
      this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y)
      this.joystickVector.x = 0
      this.joystickVector.y = 0
    })

    // UI
    this.ui = this.add.text(10, 10, '', { fontSize: 14, color: '#fff' })
    this.countdownText = this.add.text(
      400, 250, '', { fontSize: '48px', color: '#fff', fontStyle: 'bold' }
    ).setOrigin(0.5)

    this.startCountdown()
  }

  // ---------- COUNTDOWN ----------

  startCountdown() {
    this.inCountdown = true
    this.countdownValue = 3
    this.countdownTimer = 0
    this.countdownText.setText(`WAVE ${this.wave}\n${this.countdownValue}`)
  }

  updateCountdown(delta) {
    this.countdownTimer += delta
    if (this.countdownTimer >= 1000) {
      this.countdownTimer = 0
      this.countdownValue--
      if (this.countdownValue > 0) {
        this.countdownText.setText(`WAVE ${this.wave}\n${this.countdownValue}`)
      } else {
        this.countdownText.setText('')
        this.inCountdown = false
        this.spawnWave()
      }
    }
  }

  // ---------- SPAWN ----------

  spawnWave() {
    this.enemies.clear(true, true)

    const count = Math.min(3 + this.wave, 10)

    for (let i = 0; i < count; i++) {
      const e = this.add.circle(
        Phaser.Math.Between(120, 680),
        Phaser.Math.Between(120, 380),
        12,
        0xff4444
      )
      this.physics.add.existing(e)
      e.body.setCollideWorldBounds(true)

      e.hp = 40 + this.wave * this.wave * 4
      e.maxHp = e.hp
      e.speed = 80

      e.hpBar = this.add.rectangle(e.x, e.y - 18, 20, 4, 0xff0000)
        .setOrigin(0.5)

      this.enemies.add(e)
    }
  }

  // ---------- ATTACK ----------

  tryAttack() {
    if (!this.canAttack || this.inCountdown) return
    this.canAttack = false
    this.attack()
    this.time.delayedCall(this.attackCooldown, () => (this.canAttack = true))
  }

  attack() {
    const enemies = this.enemies.getChildren()
    if (!enemies.length) return

    let closest = null
    let minDist = Infinity

    enemies.forEach(e => {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y)
      if (d < minDist) {
        minDist = d
        closest = e
      }
    })

    if (!closest || minDist > 150) return

    closest.hp -= Phaser.Math.Between(10, 14)

    const line = this.add.graphics()
    line.lineStyle(3, 0xffaa00, 1)
    line.beginPath()
    line.moveTo(this.player.x, this.player.y)
    line.lineTo(closest.x, closest.y)
    line.strokePath()
    this.tweens.add({
      targets: line,
      alpha: 0,
      duration: 120,
      onComplete: () => line.destroy()
    })

    if (closest.hp <= 0) {
      closest.hpBar.destroy()
      closest.destroy()
      this.score += 100
    }
  }

  // ---------- UPDATE ----------

  update(_, delta) {
    if (this.inCountdown) {
      this.player.body.setVelocity(0, 0)
      this.updateCountdown(delta)
      return
    }

    // Player movement
    const speed = 180
    let vx = this.joystickVector.x * speed
    let vy = this.joystickVector.y * speed

    if (this.cursors.left.isDown || this.keys.A.isDown) vx -= speed
    if (this.cursors.right.isDown || this.keys.D.isDown) vx += speed
    if (this.cursors.up.isDown || this.keys.W.isDown) vy -= speed
    if (this.cursors.down.isDown || this.keys.S.isDown) vy += speed

    this.player.body.setVelocity(vx, vy)

    if (this.keys.SPACE.isDown) this.tryAttack()

    // Enemy movement (THIS IS THE WORKING PART)
    this.enemies.getChildren().forEach(e => {
      this.physics.moveToObject(e, this.player, e.speed)

      e.hpBar.setPosition(e.x, e.y - 18)
      e.hpBar.width = (e.hp / e.maxHp) * 20

      if (Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y) < 18) {
        this.hp -= 0.05 * delta
      }
    })

    if (this.enemies.countActive() === 0) {
      this.wave++
      this.startCountdown()
    }

    this.ui.setText(`❤️ ${Math.floor(this.hp)}   🌊 Wave ${this.wave}   🏆 ${this.score}`)

    if (this.hp <= 0) {
      this.onGameOver({ score: this.score, wave: this.wave })
      this.scene.stop()
    }
  }
}
