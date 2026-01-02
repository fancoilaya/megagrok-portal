import Phaser from 'phaser'

export default class ArenaScene extends Phaser.Scene {
  constructor(onGameOver) {
    super('ArenaScene')
    this.onGameOver = onGameOver
  }

  create() {
    // ---------------- STATE ----------------
    this.wave = 1
    this.score = 0
    this.playerHp = 100

    this.inCountdown = true
    this.countdown = 3
    this.countdownTimer = 0

    this.attackCooldown = 350
    this.canAttack = true

    // ---------------- PLAYER ----------------
    this.player = this.add.circle(400, 250, 14, 0xff7a00)
    this.physics.add.existing(this.player)
    this.player.body.setCollideWorldBounds(true)

    // ---------------- ENEMIES ----------------
    this.enemies = this.physics.add.group()

    // ---------------- CONTROLS (PC) ----------------
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // ---------------- UI ----------------
    this.uiText = this.add.text(10, 10, '', {
      fontSize: 14,
      color: '#ffffff'
    })

    this.countdownText = this.add.text(400, 250, '', {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5)

    // ---------------- MOBILE JOYSTICK ----------------
    this.joyBase = this.add.circle(90, 410, 35, 0x000000, 0.35).setScrollFactor(0)
    this.joyThumb = this.add.circle(90, 410, 18, 0xffffff, 0.6).setScrollFactor(0)
    this.joyVector = { x: 0, y: 0 }
    this.activePointer = null

    // ---------------- ATTACK BUTTON ----------------
    this.attackBtn = this.add.circle(710, 410, 32, 0xff7a00, 0.85)
      .setScrollFactor(0)
      .setInteractive()

    this.add.text(700, 396, '🔥', { fontSize: 26 }).setScrollFactor(0)

    this.attackBtn.on('pointerdown', () => this.tryAttack())

    // ---------------- TOUCH INPUT ----------------
    this.input.on('pointerdown', p => {
      if (p.x < this.scale.width / 2) {
        this.activePointer = p.id
      }
    })

    this.input.on('pointermove', p => {
      if (p.id !== this.activePointer) return

      const dx = p.x - this.joyBase.x
      const dy = p.y - this.joyBase.y
      const dist = Math.min(Math.hypot(dx, dy), 30)
      const angle = Math.atan2(dy, dx)

      this.joyThumb.setPosition(
        this.joyBase.x + Math.cos(angle) * dist,
        this.joyBase.y + Math.sin(angle) * dist
      )

      this.joyVector.x = Math.cos(angle) * (dist / 30)
      this.joyVector.y = Math.sin(angle) * (dist / 30)
    })

    this.input.on('pointerup', () => {
      this.activePointer = null
      this.joyThumb.setPosition(this.joyBase.x, this.joyBase.y)
      this.joyVector.x = 0
      this.joyVector.y = 0
    })

    // ---------------- START ----------------
    this.startCountdown()
  }

  // ---------------- COUNTDOWN ----------------

  startCountdown() {
    this.inCountdown = true
    this.countdown = 3
    this.countdownTimer = 0
    const label = this.wave % 5 === 0 ? 'BOSS WAVE' : `WAVE ${this.wave}`
    this.countdownText.setText(`${label}\n${this.countdown}`)
  }

  updateCountdown(delta) {
    this.countdownTimer += delta
    if (this.countdownTimer >= 1000) {
      this.countdownTimer = 0
      this.countdown--

      if (this.countdown > 0) {
        const label = this.wave % 5 === 0 ? 'BOSS WAVE' : `WAVE ${this.wave}`
        this.countdownText.setText(`${label}\n${this.countdown}`)
      } else {
        this.countdownText.setText('')
        this.inCountdown = false
        this.spawnWave()
      }
    }
  }

  // ---------------- SPAWNING ----------------

  spawnWave() {
    this.enemies.clear(true, true)

    if (this.wave % 5 === 0) {
      this.spawnBoss()
      return
    }

    const count = Math.min(3 + this.wave, 10)
    for (let i = 0; i < count; i++) {
      this.spawnEnemy(false)
    }
  }

  spawnBoss() {
    const e = this.add.circle(400, 120, 26, 0x8b0000)
    this.physics.add.existing(e)
    e.body.setCollideWorldBounds(true)

    e.hp = 400 + this.wave * 50
    e.maxHp = e.hp
    e.speed = 40
    e.isBoss = true

    e.hpBar = this.add.rectangle(e.x, e.y - 36, 50, 6, 0xff0000).setOrigin(0.5)
    this.enemies.add(e)
  }

  spawnEnemy() {
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
    e.isBoss = false

    e.hpBar = this.add.rectangle(e.x, e.y - 18, 20, 4, 0xff0000).setOrigin(0.5)
    this.enemies.add(e)
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
    const list = this.enemies.getChildren()
    if (!list.length) return

    let closest = null
    let minDist = Infinity

    list.forEach(e => {
      const d = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        e.x,
        e.y
      )
      if (d < minDist) {
        minDist = d
        closest = e
      }
    })

    if (!closest || minDist > 150) return

    const dmg = Phaser.Math.Between(10, 14)
    closest.hp -= dmg

    // Slash visual
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
      this.score += closest.isBoss ? 1000 : 100
    }
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
    let vx = this.joyVector.x * speed
    let vy = this.joyVector.y * speed

    if (this.cursors.left.isDown || this.keys.A.isDown) vx -= speed
    if (this.cursors.right.isDown || this.keys.D.isDown) vx += speed
    if (this.cursors.up.isDown || this.keys.W.isDown) vy -= speed
    if (this.cursors.down.isDown || this.keys.S.isDown) vy += speed

    this.player.body.setVelocity(vx, vy)

    if (this.keys.SPACE.isDown) this.tryAttack()

    // Enemies
    this.enemies.getChildren().forEach(e => {
      this.physics.moveToObject(e, this.player, e.speed)

      const barWidth = e.isBoss ? 50 : 20
      const yOffset = e.isBoss ? 36 : 18
      e.hpBar.setPosition(e.x, e.y - yOffset)
      e.hpBar.width = (e.hp / e.maxHp) * barWidth

      if (
        Phaser.Math.Distance.Between(
          e.x,
          e.y,
          this.player.x,
          this.player.y
        ) < 18
      ) {
        this.playerHp -= (e.isBoss ? 0.08 : 0.05) * delta
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
