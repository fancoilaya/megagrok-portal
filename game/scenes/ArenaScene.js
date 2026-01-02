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

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    // Mobile input
    this.joystickVector = { x: 0, y: 0 }
    this.input.on('pointerdown', () => {
      this.attack()
    })

    this.spawnWave()

    // UI
    this.ui = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#ffffff'
    })
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
      e.speed = 40 + this.wave * 5
      this.enemies.add(e)
    }
  }

  attack() {
    const enemy = this.enemies.getChildren()[0]
    if (!enemy) return

    enemy.hp -= 10
    if (enemy.hp <= 0) {
      enemy.destroy()
      this.score += 100
    }
  }

  update(_, delta) {
    const speed = 180
    let vx = 0
    let vy = 0

    if (this.cursors.left.isDown || this.keys.A.isDown) vx -= speed
    if (this.cursors.right.isDown || this.keys.D.isDown) vx += speed
    if (this.cursors.up.isDown || this.keys.W.isDown) vy -= speed
    if (this.cursors.down.isDown || this.keys.S.isDown) vy += speed

    this.player.body.setVelocity(vx, vy)

    this.enemies.getChildren().forEach(e => {
      this.physics.moveToObject(e, this.player, e.speed)
      if (Phaser.Math.Distance.Between(
        e.x, e.y, this.player.x, this.player.y
      ) < 20) {
        this.hp -= 0.05 * delta
      }
    })

    if (this.enemies.countActive() === 0) {
      this.wave++
      this.spawnWave()
    }

    this.ui.setText(
      `❤️ ${Math.floor(this.hp)}  🌊 Wave ${this.wave}  🏆 ${this.score}`
    )

    if (this.hp <= 0) {
      this.onGameOver(this.score)
      this.scene.stop()
    }
  }
}
