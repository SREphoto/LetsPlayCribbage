import { Injectable } from '@angular/core';

type Sound = 'select' | 'score' | 'reset' | 'play' | 'go' | 'shuffle';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private audioCache = new Map<Sound, HTMLAudioElement>();
  private masterVolume = 0.3;

  constructor() {
    this.preload();
  }

  private preload() {
    // Using short, simple base64 encoded sounds to avoid network requests and keep it self-contained.
    this.loadSound('select', 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='); // Short click
    this.loadSound('play', 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAACY/w=='); // Softer click
    this.loadSound('reset', 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQQAAAB0AP/A'); // Low blip
    this.loadSound('score', 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAABo/w=='); // Higher blip
    this.loadSound('go', 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='); // Click
    this.loadSound('shuffle', 'data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRgAAAB8/vj++P75/v/++f74/vj9+f76/v3+/w=='); // Riffle
  }

  private loadSound(name: Sound, src: string) {
    const audio = new Audio(src);
    audio.volume = this.masterVolume;
    this.audioCache.set(name, audio);
  }

  play(sound: Sound) {
    const audio = this.audioCache.get(sound);
    if (audio) {
      audio.currentTime = 0;
      // The play() method returns a Promise which can be rejected with an AbortError
      // if the sound is interrupted. This happens frequently with rapid UI interactions.
      // We can safely ignore this specific error as it doesn't affect functionality.
      audio.play().catch(error => {
        if (error.name !== 'AbortError') {
          console.error(`Error playing sound: ${sound}`, error);
        }
      });
    }
  }
}