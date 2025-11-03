# Line Clash

A browser-based tower defense game built with Phaser 3, TypeScript, and Vite.

## Description

Line Clash is a single-lane tower defense game where you defend your base against waves of enemies. Spawn units strategically, manage your gold economy, and destroy the enemy base before they destroy yours!

## Features

- **5 Unique Units**: Warrior, Archer, Knight, Mage, and Tank - each with different stats and abilities
- **Wave-based Enemy System**: Enemies spawn based on wave budgets with increasing difficulty
- **Economy System**: Earn gold over time to spawn more units
- **Real-time Combat**: Units automatically march down the lane, engaging enemies in their range
- **Ranged and Melee Combat**: Different attack styles with projectiles for ranged units

## Game Mechanics

- **Gold System**: Start with 200 gold and earn +10 gold every 2 seconds
- **Unit Spawning**: Click the unit buttons at the bottom to spawn units (costs gold)
- **Combat**: Units automatically move towards the enemy base and attack enemies in range
- **Victory**: Destroy the enemy base to win
- **Defeat**: Protect your base - if it's destroyed, you lose!

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The game will open automatically in your default browser at `http://localhost:3000`.

## Build

Create a production build:

```bash
npm run build
```

## Preview

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── core/          # Core configuration and types
├── scenes/        # Phaser scenes (Boot, MainMenu, Game, UI)
├── systems/       # Game systems (Economy, AI, Waves, etc.)
├── entities/      # Game entities (Unit, Base, Projectile)
├── ui/            # UI components (Buttons, etc.)
└── data/          # Game data (units, waves, economy, upgrades)
```

## Technologies

- **Phaser 3**: Game framework
- **TypeScript**: Type-safe game logic
- **Vite**: Fast build tool and dev server

## License

ISC
