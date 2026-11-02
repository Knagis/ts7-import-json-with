// Generates a large JSON file (similar to the spine/atlas data in a game) for the repro.
import { writeFileSync } from "node:fs";

const frames: Record<string, unknown> = {};
for (let i = 0; i < 20000; i++) {
    frames[`frame_${i}`] = {
        frame: { x: i % 2048, y: Math.floor(i / 2048), w: 64, h: 64 },
        rotated: i % 3 === 0,
        trimmed: i % 5 === 0,
        spriteSourceSize: { x: 0, y: 0, w: 64, h: 64 },
        sourceSize: { w: 64, h: 64 },
    };
}

writeFileSync(new URL("./src/big.json", import.meta.url), JSON.stringify({ frames: frames }, null, 4));
console.log("src/big.json written");
