import Phaser from 'phaser'
import ArenaScene from './scenes/ArenaScene'

export function startArenaGame(containerId, onGameOver) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,
    width: 800,
    height: 500,
    backgroundColor: '#0b0b0b',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: [
      new ArenaScene(onGameOver)
    ],
    scale: {
      mode: Phaser.Scale.NONE
    }
  })
}
