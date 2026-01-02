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

    // Attack control
    this.canAttack = true
    this.attackCooldown = 150 // ms

    // Player
    this.player = this.add.circle(400, 250, 14, 0xff7a00)
    this.physics.add.existing(this.player)
    this.player.body.setCollideWorldBounds(true)

    // Enemies
    this.enemies = this.physics.add.group()

    // PC controls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // Mobile joystick
    this.joystickBase = this.add.circle(90, 410, 35, 0x000000, 0.35).setScrollFactor(0)
    this.joystickThumb = this.add.circle(90, 410, 18, 0xffffff, 0.6).setScrollFactor(0)
    this.joystickVector = { x: 0, y: 0 }
    this.activePointerId = null

    // Attack button
    this.attackButton = this.add
      .circle(710, 410, 32, 0xff7a00, 0.8)
      .setScrollFactor(0)
      .setInteractive()

    this.attackIcon = this.add.text(702, 398, '🔥', { fontSize: 24 }).setScrollFactor(0)

    this.attackButton.on('pointerdown', () => {
      this.tryAttack()
    })

    // Pointer handling
    this.input.on('pointerdown', (pointer) => {
      if (this.inCountdown) return
      if (pointer.x < this.scale.width / 2) this.activePointerId = pointer.id
    })

    this.input.on('pointermove', (pointer) => {
      if (pointer.id !== this.activePointerId) return

      const dx = pointer.x - this.joystickBase.x
      const dy = pointer.y - this.joystickBase.y
      const dist = Math.min(Math.hypot(dx, dy), 30)
      const angle = Math.atan2(dy, dx)

      this.joystickThumb.setPosition(
        this.joystickBase.x + Math.cos(angle) * dist,
        this.joystickBase.y + Math.sin(angle) * dist
      )

      this.joystickVector.x = Math.cos(angle) * (dist / 30)
      this.joystickVector.y = Math.sin(angle) * (dist / 30)
    })

    this.input.on('pointerup', () => {
      this.activePointerId = null
      this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y)
      this.joystickVector.x = 0
      this.joystickVector.y = 0
    })

    // UI
    this.ui = this.add.text(10, 10, '', { fontSize: 14, color: '#fff' }).setScrollFactor(0)

    this.countdownText = this.add.text(
      400, 250, '', { fontSize: '48px', color: '#fff', fontStyle: 'bold', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0)

    this.startCountdown()
  }

  // ---------------- COUNTDOWN ----------------

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
        this.countdownText.setText(`WAVE ${this.wave}`)
        this.time.delayedCall(500, () => {
          this.countdownText.setText('')
          this.inCountdown = false
          this.spawnWave()
        })
      }
    }
  }

  // ---------------- WAVE ----------------

  spawnWave() {
    this.enemies.clear(true, true)

    const count = Math.min(3 + this.wave, 10)

    for (let i = 0; i < count; i++) {
      const e = this.add.circle(
        Phaser.Math.Between(60, 740),
        Phaser.Math.Between(60, 440),
        12,
        0xff4444
      )
      this.physics.add.existing(e)

      e.maxHp = 30 + this.wave * 6
      e.hp = e.maxHp
      e.speed = 40 + this.wave * 6

      e.hpBarBg = this.add.rectangle(e.x, e.y - 18, 20, 4, 0x000000).setDepth(5)
      e.hpBar = this.add.rectangle(e.x - 10, e.y - 18, 20, 4, 0xff0000)
        .setOrigin(0, 0.5)
        .setDepth(6)

      this.enemies.add(e)
    }
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

    if (!closest || minDist > 140) return

    const dmg = Phaser.Math.Between(10, 14)
    closest.hp -= dmg

    closest.setFillStyle(0xffaaaa)
    this.tweens.add({ targets: closest, scale: 1.15, yoyo: true, duration: 80 })
    this.time.delayedCall(80, () => closest.setFillStyle(0xff4444))

    const txt = this.add.text(
      closest.x, closest.y - 10, `-${dmg}`,
      { fontSize: '16px', color: '#ffffff' }
    ).setOrigin(0.5).setDepth(10)

    this.tweens.add({
      targets: txt,
      y: txt.y - 25,
      alpha: 0,
      duration: 700,
      onComplete: () => txt.destroy()
    })

    if (closest.hp <= 0) {
      closest.hpBar.destroy()
      closest.hpBarBg.destroy()
      closest.destroy()
      this.score += 100
    }
  }

  // ---------------- UPDATE ----------------

  update(_, delta) {
    if (this.inCountdown) {
      this.player.body.setVelocity(0, 0)
      this.updateCountdown(delta)
      return
    }

    const speed = 180
    let vx = 0
    let vy = 0

    if (this.cursors.left.isDown || this.keys.A.isDown) vx -= speed
    if (this.cursors.right.isDown || this.keys.D.isDown) vx += speed
    if (this.cursors.up.isDown || this.keys.W.isDown) vy -= speed
    if (this.cursors.down.isDown || this.keys.S.isDown) vy += speed

    vx += this.joystickVector.x * speed
    vy += this.joystickVector.y * speed

    this.player.body.setVelocity(vx, vy)

    if (this.keys.SPACE.isDown) this.tryAttack()

    this.enemies.getChildren().forEach(e => {
      this.physics.moveToObject(e, this.player, e.speed)

      e.hpBarBg.setPosition(e.x, e.y - 18)
      e.hpBar.setPosition(e.x - 10, e.y - 18)
      e.hpBar.width = (e.hp / e.maxHp) * 20

      if (Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y) < 20) {
        this.hp -= 0.03 * delta
      }
    })

    if (this.enemies.countActive() === 0) {
      this.wave++
      this.startCountdown()
    }

    this.ui.setText(
      `❤️ ${Math.floor(this.hp)}   🌊 Wave ${this.wave}   🏆 ${this.score}`
    )

    if (this.hp <= 0) {
      this.onGameOver({ score: this.score, wave: this.wave })
      this.scene.stop()
    }
  }
}
