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

    this.enemies = []
    this.projectiles = []

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // Joystick
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
    this.countdownText = this.add.text(400, 250, '', {
      fontSize: '48px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5)

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
        this.countdownText.setText('')
        this.inCountdown = false
        this.spawnWave()
      }
    }
  }

  // ---------------- SPAWN ----------------

  spawnWave() {
    this.enemies.forEach(e => this.destroyEnemy(e))
    this.projectiles.forEach(p => p.destroy())
    this.enemies = []
    this.projectiles = []

    const count = Math.min(3 + this.wave, 10)

    for (let i = 0; i < count; i++) {
      const type = this.wave >= 3 && Math.random() < 0.35 ? 'ranged' : 'normal'
      this.spawnEnemy(type)
    }
  }

  spawnEnemy(type) {
    const e = this.add.circle(
      Phaser.Math.Between(120, 680),
      Phaser.Math.Between(120, 380),
      12,
      type === 'ranged' ? 0x3399ff : 0xff4444
    )
    this.physics.add.existing(e)
    e.body.setCollideWorldBounds(true)

    e.type = type
    e.hp = 40 + this.wave * this.wave * 4
    e.maxHp = e.hp
    e.speed = type === 'ranged' ? 40 : 80
    e.lastShot = 0

    e.hpBar = this.add.rectangle(e.x, e.y - 18, 20, 4, 0xff0000).setOrigin(0.5)
    this.enemies.push(e)
  }

  // ---------------- ATTACK ----------------

  tryAttack() {
    if (!this.canAttack || this.inCountdown) return
    this.canAttack = false
    this.attack()
    this.time.delayedCall(this.attackCooldown, () => (this.canAttack = true))
  }

  attack() {
    let closest = null
    let minDist = Infinity

    this.enemies.forEach(e => {
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
      this.destroyEnemy(closest)
      this.score += 100
    }
  }

  destroyEnemy(e) {
    e.hpBar.destroy()
    e.destroy()
    this.enemies = this.enemies.filter(x => x !== e)
  }

  // ---------------- UPDATE ----------------

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

    const now = this.time.now

    // Enemies
    this.enemies.forEach(e => {
      let dx, dy, mag

      if (e.type === 'ranged') {
        dx = e.body.x - this.player.body.x
        dy = e.body.y - this.player.body.y
        mag = Math.hypot(dx, dy)

        if (mag > 0.001 && mag < 180) {
          e.body.setVelocity(
            (dx / mag) * e.speed,
            (dy / mag) * e.speed
          )
        } else {
          e.body.setVelocity(0, 0)
        }

        if (now - e.lastShot > 1200) {
          e.lastShot = now
          this.fireProjectile(e)
        }
      } else {
        dx = this.player.body.x - e.body.x
        dy = this.player.body.y - e.body.y
        mag = Math.hypot(dx, dy)

        if (mag > 0.001) {
          e.body.setVelocity(
            (dx / mag) * e.speed,
            (dy / mag) * e.speed
          )
        } else {
          e.body.setVelocity(0, 0)
        }
      }

      // Sync visuals
      e.x = e.body.x
      e.y = e.body.y
      e.hpBar.setPosition(e.x, e.y - 18)
      e.hpBar.width = (e.hp / e.maxHp) * 20
    })

    // Projectiles
    this.projectiles.forEach(p => {
      p.x = p.body.x
      p.y = p.body.y

      if (Phaser.Math.Distance.Between(p.x, p.y, this.player.x, this.player.y) < 14) {
        this.hp -= 8
        p.destroy()
      }
    })

    this.projectiles = this.projectiles.filter(p => p.active)

    if (this.enemies.length === 0) {
      this.wave++
      this.startCountdown()
    }

    this.ui.setText(`❤️ ${Math.floor(this.hp)}   🌊 Wave ${this.wave}   🏆 ${this.score}`)
  }

  fireProjectile(e) {
    const p = this.add.circle(e.x, e.y, 4, 0x66ccff)
    this.physics.add.existing(p)

    const dx = this.player.body.x - e.body.x
    const dy = this.player.body.y - e.body.y
    const mag = Math.hypot(dx, dy)

    if (mag > 0.001) {
      p.body.setVelocity((dx / mag) * 260, (dy / mag) * 260)
    }

    this.projectiles.push(p)
    this.time.delayedCall(3000, () => p.destroy())
  }
}
