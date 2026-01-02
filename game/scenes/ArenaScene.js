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

    // Player
    this.player = this.add.circle(400, 250, 14, 0xff7a00)
    this.physics.add.existing(this.player)
    this.player.body.setCollideWorldBounds(true)

    // Enemies
    this.enemies = this.physics.add.group()

    // Keyboard (PC)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // ===== MOBILE CONTROLS =====
    this.joystickBase = this.add.circle(90, 410, 35, 0x000000, 0.35).setScrollFactor(0)
    this.joystickThumb = this.add.circle(90, 410, 18, 0xffffff, 0.6).setScrollFactor(0)

    this.attackButton = this.add.circle(710, 410, 32, 0xff7a00, 0.8).setScrollFactor(0)
    this.attackIcon = this.add.text(702, 398, '🔥', { fontSize: 24 }).setScrollFactor(0)

    this.joystickVector = { x: 0, y: 0 }
    this.activePointerId = null

    this.input.on('pointerdown', (pointer) => {
      if (pointer.x < this.scale.width / 2) {
        this.activePointerId = pointer.id
      } else {
        this.attack()
      }
    })

    this.input.on('pointermove', (pointer) => {
      if (pointer.id !== this.activePointerId) return

      const dx = pointer.x - this.joystickBase.x
      const dy = pointer.y - this.joystickBase.y
      const dist = Math.min(Math.hypot(dx, dy), 30)

      const angle = Math.atan2(dy, dx)
      this.joystickThumb.x = this.joystickBase.x + Math.cos(angle) * dist
      this.joystickThumb.y = this.joystickBase.y + Math.sin(angle) * dist

      this.joystickVector.x = Math.cos(angle) * (dist / 30)
      this.joystickVector.y = Math.sin(angle) * (dist / 30)
    })

    this.input.on('pointerup', (pointer) => {
      if (pointer.id === this.activePointerId) {
        this.activePointerId = null
        this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y)
        this.joystickVector.x = 0
        this.joystickVector.y = 0
      }
    })

    // UI
    this.ui = this.add.text(10, 10, '', { fontSize: 14, color: '#fff' }).setScrollFactor(0)

    this.spawnWave()
  }

  spawnWave() {
    this.enemies.clear(true, true)

    const count = Math.min(3 + this.wave, 10)

    for (let i = 0; i < count; i++) {
      const e = this.add.circle(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(50, 450),
        12,
        0xff4444
      )
      this.physics.add.existing(e)
      e.hp = 20 + this.wave * 5
      e.speed = 40 + this.wave * 6
      this.enemies.add(e)
    }
  }

  attack() {
    const enemies = this.enemies.getChildren()
    if (!enemies.length) return

    let closest = null
    let minDist = Infinity

    enemies.forEach(e => {
      const d = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, e.x, e.y
      )
      if (d < minDist) {
        minDist = d
        closest = e
      }
    })

    if (closest && minDist < 120) {
      closest.hp -= 12
      if (closest.hp <= 0) {
        closest.destroy()
        this.score += 100
      }
    }
  }

  update(_, delta) {
    const speed = 180
    let vx = 0
    let vy = 0

    // PC movement
    if (this.cursors.left.isDown || this.keys.A.isDown) vx -= speed
    if (this.cursors.right.isDown || this.keys.D.isDown) vx += speed
    if (this.cursors.up.isDown || this.keys.W.isDown) vy -= speed
    if (this.cursors.down.isDown || this.keys.S.isDown) vy += speed

    // Mobile joystick movement
    vx += this.joystickVector.x * speed
    vy += this.joystickVector.y * speed

    this.player.body.setVelocity(vx, vy)

    if (this.keys.SPACE.isDown) {
      this.attack()
    }

    this.enemies.getChildren().forEach(e => {
      this.physics.moveToObject(e, this.player, e.speed)
      if (Phaser.Math.Distance.Between(
        e.x, e.y, this.player.x, this.player.y
      ) < 20) {
        this.hp -= 0.03 * delta
      }
    })

    if (this.enemies.countActive() === 0) {
      this.wave++
      this.spawnWave()
    }

    this.ui.setText(
      `❤️ ${Math.floor(this.hp)}   🌊 Wave ${this.wave}   🏆 ${this.score}`
    )

    if (this.hp <= 0) {
      this.onGameOver(this.score)
      this.scene.stop()
    }
  }
}
