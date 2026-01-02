import Phaser from 'phaser'

export default class ArenaScene extends Phaser.Scene {
  constructor(onGameOver) {
    super('ArenaScene')
    this.onGameOver = onGameOver
  }

  preload() {
    // bullet texture (sprite-based, reliable)
    const g = this.add.graphics()
    g.fillStyle(0x66ccff, 1)
    g.fillCircle(4, 4, 4)
    g.generateTexture('bullet', 8, 8)
    g.destroy()
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

    // Groups
    this.enemies = this.physics.add.group()
    this.projectiles = this.physics.add.group()

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // UI
    this.ui = this.add.text(10, 10, '', { fontSize: 14, color: '#fff' })
    this.countdownText = this.add.text(
      400,
      250,
      '',
      { fontSize: '48px', color: '#fff', fontStyle: 'bold' }
    ).setOrigin(0.5)

    // Projectile → Player
    this.physics.add.overlap(this.player, this.projectiles, (_, p) => {
      p.destroy()
      this.hp -= 8
    })

    this.startCountdown()
  }

  // ---------------- COUNTDOWN ----------------

  startCountdown() {
    this.inCountdown = true
    this.countdownValue = 3
    this.countdownTimer = 0
    const label = this.wave % 5 === 0 ? 'BOSS WAVE' : `WAVE ${this.wave}`
    this.countdownText.setText(`${label}\n${this.countdownValue}`)
  }

  updateCountdown(delta) {
    this.countdownTimer += delta
    if (this.countdownTimer >= 1000) {
      this.countdownTimer = 0
      this.countdownValue--
      if (this.countdownValue > 0) {
        const label = this.wave % 5 === 0 ? 'BOSS WAVE' : `WAVE ${this.wave}`
        this.countdownText.setText(`${label}\n${this.countdownValue}`)
      } else {
        this.countdownText.setText('')
        this.inCountdown = false
        this.spawnWave()
      }
    }
  }

  // ---------------- SPAWN ----------------

  spawnWave() {
    this.enemies.clear(true, true)
    this.projectiles.clear(true, true)

    if (this.wave % 5 === 0) {
      this.spawnBoss()
      return
    }

    const count = Math.min(3 + this.wave, 10)
    for (let i = 0; i < count; i++) {
      const type = this.wave >= 3 && Math.random() < 0.3 ? 'ranged' : 'normal'
      this.spawnEnemy(type)
    }
  }

  spawnBoss() {
    const e = this.add.circle(400, 120, 26, 0x8b0000)
    this.physics.add.existing(e)
    e.body.setCollideWorldBounds(true)

    e.type = 'boss'
    e.hp = 400 + this.wave * 50
    e.maxHp = e.hp
    e.speed = 40

    e.hpBar = this.add.rectangle(e.x, e.y - 36, 50, 6, 0xff0000).setOrigin(0.5)
    this.enemies.add(e)
  }

  spawnEnemy(type) {
    const isRanged = type === 'ranged'

    const e = this.add.circle(
      Phaser.Math.Between(120, 680),
      Phaser.Math.Between(120, 380),
      12,
      isRanged ? 0x3399ff : 0xff4444
    )
    this.physics.add.existing(e)
    e.body.setCollideWorldBounds(true)

    e.type = type
    e.hp = 40 + this.wave * this.wave * 4
    e.maxHp = e.hp
    e.speed = isRanged ? 55 : 80
    e.lastShot = 0
    e.fireRate = 1400 + Math.random() * 600

    e.hpBar = this.add.rectangle(e.x, e.y - 18, 20, 4, 0xff0000).setOrigin(0.5)
    this.enemies.add(e)
  }

  // ---------------- ATTACK ----------------

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

    const dmg = Phaser.Math.Between(10, 14)
    closest.hp -= dmg

    // visual slash
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
      this.score += closest.type === 'boss' ? 1000 : 100
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
    let vx = 0
    let vy = 0
    if (this.cursors.left.isDown || this.keys.A.isDown) vx -= speed
    if (this.cursors.right.isDown || this.keys.D.isDown) vx += speed
    if (this.cursors.up.isDown || this.keys.W.isDown) vy -= speed
    if (this.cursors.down.isDown || this.keys.S.isDown) vy += speed
    this.player.body.setVelocity(vx, vy)

    if (this.keys.SPACE.isDown) this.tryAttack()

    const now = this.time.now

    this.enemies.getChildren().forEach(e => {
      const dist = Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y)

      if (e.type === 'ranged') {
        if (dist > 260) {
          this.physics.moveToObject(e, this.player, e.speed)
        } else {
          e.body.setVelocity(0, 0)
        }

        if (now - e.lastShot > e.fireRate) {
          e.lastShot = now
          this.fireProjectile(e)
        }
      } else {
        this.physics.moveToObject(e, this.player, e.speed)
      }

      const barWidth = e.type === 'boss' ? 50 : 20
      const yOffset = e.type === 'boss' ? 36 : 18
      e.hpBar.setPosition(e.x, e.y - yOffset)
      e.hpBar.width = (e.hp / e.maxHp) * barWidth

      if (dist < 18 && e.type !== 'ranged') {
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

  // ---------------- PROJECTILE (FIXED) ----------------

  fireProjectile(enemy) {
    const p = this.physics.add.image(enemy.x, enemy.y, 'bullet')

    // 🔒 CRITICAL: explicitly movable
    p.body.allowGravity = false
    p.body.immovable = false

    const angle = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    )

    const speed = 300
    p.body.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    )

    this.projectiles.add(p)

    this.time.delayedCall(5000, () => {
      if (p.active) p.destroy()
    })
  }
}
