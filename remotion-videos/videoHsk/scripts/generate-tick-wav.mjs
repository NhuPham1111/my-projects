import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const sampleRate = 44_100;
const samples = sampleRate;
const bytesPerSample = 2;
const buffer = Buffer.alloc(44 + samples * bytesPerSample);

buffer.write("RIFF", 0);
buffer.writeUInt32LE(buffer.length - 8, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
buffer.writeUInt16LE(bytesPerSample, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(samples * bytesPerSample, 40);

const ticks = [
  { start: 0.04, frequency: 1_650, volume: 0.32 },
  { start: 0.54, frequency: 1_150, volume: 0.28 },
];

for (let sample = 0; sample < samples; sample++) {
  const time = sample / sampleRate;
  let value = 0;

  for (const tick of ticks) {
    const elapsed = time - tick.start;
    if (elapsed >= 0 && elapsed < 0.09) {
      const envelope = Math.exp(-elapsed * 52);
      value +=
        Math.sin(2 * Math.PI * tick.frequency * elapsed) *
        envelope *
        tick.volume;
    }
  }

  const pcm = Math.max(-1, Math.min(1, value)) * 32_767;
  buffer.writeInt16LE(Math.round(pcm), 44 + sample * bytesPerSample);
}

const outputDirectory = path.join(projectRoot, "public", "audio", "sfx");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(path.join(outputDirectory, "tick-tock.wav"), buffer);
console.log("Created public/audio/sfx/tick-tock.wav");
