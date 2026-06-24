/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientInterval: any = null;
  private activeType: 'home' | 'studying' | null = null;
  
  // Settings
  private _soundEnabled = true;
  private _musicEnabled = true;

  constructor() {
    // Autoplay compliance: Context is initialized lazily upon user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  get soundEnabled() {
    return this._soundEnabled;
  }

  set soundEnabled(val: boolean) {
    this._soundEnabled = val;
    localStorage.setItem('bb_sound_enabled', String(val));
  }

  get musicEnabled() {
    return this._musicEnabled;
  }

  set musicEnabled(val: boolean) {
    this._musicEnabled = val;
    localStorage.setItem('bb_music_enabled', String(val));
    if (!val) {
      this.stopAmbientMusic();
    } else {
      this.startAmbientMusic(this.activeType || 'home');
    }
  }

  loadSettings() {
    const s = localStorage.getItem('bb_sound_enabled');
    const m = localStorage.getItem('bb_music_enabled');
    if (s !== null) this._soundEnabled = s === 'true';
    if (m !== null) this._musicEnabled = m === 'true';
  }

  /**
   * Premium Transient Click
   * Tactile modern high-pitch tick.
   */
  playClick() {
    if (!this._soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn("Could not play click", e);
    }
  }

  /**
   * Modern Dynamic Swipe/Whoosh (Question Appear)
   * Exciting futuristic transition whoosh.
   */
  playQuestionAppear() {
    if (!this._soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
      filter.Q.value = 4.0;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn("Could not play question appear", e);
    }
  }

  /**
   * Thinking Pulse Theme
   * Soft deep stereo drone.
   */
  playThinkingPulse() {
    if (!this._soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.21);
    } catch (e) {
      console.warn("Could not play thinking pulse", e);
    }
  }

  /**
   * Brilliant Super-Motivational Success Chime
   * High-energy digital arpeggio with high-pass filtered sparkles!
   */
  playSuccess() {
    if (!this._soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Beautiful C Major triad run up to C6!
      
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        o.frequency.setValueAtTime(freq, now + idx * 0.05);

        g.gain.setValueAtTime(0.06 - (idx * 0.005), now + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(now + idx * 0.05);
        o.stop(now + idx * 0.05 + 0.28);
      });
    } catch (e) {
      console.warn("Could not play success chime", e);
    }
  }

  /**
   * Playful Retro Game Failure
   * Animated classic cartoonish fail run.
   */
  playFailure() {
    if (!this._soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Play a quick 3-note descending buzzer chord
      const notes = [293.66, 261.63, 220.00]; // D4, C4, A3
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        osc.frequency.linearRampToValueAtTime(freq * 0.8, now + idx * 0.08 + 0.15);

        gain.gain.setValueAtTime(0.05, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.18);
      });
    } catch (e) {
      console.warn("Could not play failure buzz", e);
    }
  }

  /**
   * Stage Level Up (Blast of Supreme Glory)
   * Grand and exciting triumphant fanfare.
   */
  playStageUp() {
    if (!this._soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // Fanfare rhythm chord progression
      const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C Major epic progression
      
      // 1. Triumphant rising arpeggio
      arpeggio.forEach((pitch, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now + i * 0.06);
        osc.frequency.linearRampToValueAtTime(pitch * 1.01, now + i * 0.06 + 0.4);
        gain.gain.setValueAtTime(0.05, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.45);
      });

      // 2. Heavy power landing chord at the end
      const chordTime = now + 0.45;
      const majorChord = [329.63, 392.00, 523.25, 659.25]; // E4, G4, C5, E5
      majorChord.forEach(p => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(p, chordTime);
        gain.gain.setValueAtTime(0.06, chordTime);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(chordTime);
        osc.stop(chordTime + 0.85);
      });
    } catch (e) {
      console.warn("Could not play stage transition", e);
    }
  }

  /**
   * Dynamic Cyber Dice Rolling System
   * Playful acceleration to deceleration tick clicks.
   */
  playDiceRoll() {
    if (!this._soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      let delay = 0;
      
      for (let i = 0; i < 15; i++) {
        const time = now + delay;
        const pitch = 700 - (i * 30) + (Math.random() * 150);
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, time);
        
        gain.gain.setValueAtTime(0.03, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(time);
        osc.stop(time + 0.05);
        
        delay += 0.045 + (i * 0.015);
      }
    } catch (e) {
      console.warn("Could not play dice roll", e);
    }
  }

  /**
   * Audience Cyber Resonator Help Sound
   * Murmur and a bright cheerful whistle that sounds highly motivational and friendly.
   */
  playCrowdHelp() {
    if (!this._soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 2.0;

      // 1. White Noise Crowd Generator
      const bufferSize = this.ctx.sampleRate * duration;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;

      const resonanceFilter = this.ctx.createBiquadFilter();
      resonanceFilter.type = 'bandpass';
      resonanceFilter.frequency.setValueAtTime(350, now);
      resonanceFilter.frequency.exponentialRampToValueAtTime(500, now + 1.2);
      resonanceFilter.Q.setValueAtTime(3.0, now);

      const murmurGain = this.ctx.createGain();
      murmurGain.gain.setValueAtTime(0.01, now);
      murmurGain.gain.linearRampToValueAtTime(0.05, now + 0.3);
      murmurGain.gain.linearRampToValueAtTime(0.04, now + 1.2);
      murmurGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseNode.connect(resonanceFilter);
      resonanceFilter.connect(murmurGain);
      murmurGain.connect(this.ctx.destination);

      // 2. Play a cheering whistle/harmony (Motivational)
      const whistlePitches = [440, 554, 659]; // A Major Cheer Herd
      whistlePitches.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        // Sine whistles
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.1);
        osc.frequency.linearRampToValueAtTime(freq * 1.15, now + 0.8);
        osc.frequency.linearRampToValueAtTime(freq, now + duration);

        oscGain.gain.setValueAtTime(0.005, now);
        oscGain.gain.linearRampToValueAtTime(0.018, now + 0.3);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + duration);
      });

      noiseNode.start(now);
      noiseNode.stop(now + duration);
    } catch (e) {
      console.warn("Could not play audience sound", e);
    }
  }

  /**
   * AMAZING UPBEAT CHILLWAVE ARCHADE SOUNDTRACK (120 BPM Groove)
   * Highly energetic, positive and motivational background groove featuring:
   * 1. Dynamic synthesized retro driving drums (Hihat-noise clicks / Soft bass beat kicks)
   * 2. Energetic retro syncopated arpeggiated bells in loop!
   */
  startAmbientMusic(type: 'home' | 'studying' = 'home') {
    if (!this._musicEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    
    // Avoid double creation if already in the exact same activeType mode and looping
    if (this.activeType === type && this.ambientInterval) {
      return;
    }
    
    // Clean transition by stopping previous loop
    this.stopAmbientMusic();
    this.activeType = type;

    try {
      this.ambientGain = this.ctx.createGain();
      // Increase volume slightly based on user request (0.12 for home, 0.16 for battle)
      const targetVolume = type === 'home' ? 0.12 : 0.16;
      this.ambientGain.gain.setValueAtTime(targetVolume, this.ctx.currentTime); 
      this.ambientGain.connect(this.ctx.destination);

      let step = 0;

      if (type === 'home') {
        // --- HOME / MENU MOTIVATIONAL WAVE (Slower, elegant & grand) ---
        // 100 BPM (600ms per step)
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4 Pentatonic
        this.ambientInterval = setInterval(() => {
          if (!this.ctx || !this._musicEnabled) return;
          const now = this.ctx.currentTime;
          const currentStep = step % 8;

          try {
            // Evolving soft pad chords on first beat
            if (currentStep === 0) {
              const chords = [
                [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
                [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
                [146.83, 174.61, 220.00, 261.63], // Dmin7 (D3, F3, A3, C4)
                [196.00, 246.94, 293.66, 349.23]  // G7 (G3, B3, D4, F4)
              ];
              const selectedChord = chords[Math.floor(step / 8) % chords.length];
              selectedChord.forEach(note => {
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const noteGain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(note, now);
                
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(400, now);

                noteGain.gain.setValueAtTime(0.012, now);
                noteGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

                osc.connect(filter);
                filter.connect(noteGain);
                if (this.ambientGain) noteGain.connect(this.ambientGain);
                osc.start(now);
                osc.stop(now + 4.6);
              });
            }

            // High-glass bell echoes on step intervals
            if (currentStep % 2 === 0) {
              const osc = this.ctx.createOscillator();
              const noteGain = this.ctx.createGain();
              osc.type = 'sine';
              
              const basePitch = scale[Math.floor(Math.random() * scale.length)];
              // Shimmer octave
              osc.frequency.setValueAtTime(basePitch * 2, now);
              
              noteGain.gain.setValueAtTime(0.015, now);
              noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

              osc.connect(noteGain);
              if (this.ambientGain) noteGain.connect(this.ambientGain);
              osc.start(now);
              osc.stop(now + 1.3);
            }

          } catch (innerErr) {
            console.error("Menu music melody cycle failed", innerErr);
          }
          step++;
        }, 600);
      } else {
        // --- ACTIVE BATTLE / STUDYING RETRO ARCHADE TRACK (Lively & Energetic) ---
        // 135 BPM (400ms per step)
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C, D, E, G, A, C5, D5, E5
        this.ambientInterval = setInterval(() => {
          if (!this.ctx || !this._musicEnabled) return;
          const now = this.ctx.currentTime;
          const currentStep = step % 8;

          try {
            // A: Retro Kick Drum (Step 0 & 4)
            if (currentStep === 0 || currentStep === 4) {
              const kick = this.ctx.createOscillator();
              const kickGain = this.ctx.createGain();
              kick.type = 'sine';
              kick.frequency.setValueAtTime(140, now);
              kick.frequency.exponentialRampToValueAtTime(55, now + 0.12);
              kickGain.gain.setValueAtTime(0.09, now); // Slightly boosted kick
              kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
              kick.connect(kickGain);
              if (this.ambientGain) kickGain.connect(this.ambientGain);
              kick.start(now);
              kick.stop(now + 0.13);
            }

            // B: Hihat / Shrimping (Step 2 & 6)
            if (currentStep === 2 || currentStep === 6) {
              const bufferSize = this.ctx.sampleRate * 0.05;
              const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
              const data = buffer.getChannelData(0);
              for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
              }
              const noise = this.ctx.createBufferSource();
              noise.buffer = buffer;
              const filter = this.ctx.createBiquadFilter();
              filter.type = 'highpass';
              filter.frequency.setValueAtTime(7000, now);
              const noiseGain = this.ctx.createGain();
              noiseGain.gain.setValueAtTime(0.009, now);
              noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

              noise.connect(filter);
              filter.connect(noiseGain);
              if (this.ambientGain) noiseGain.connect(this.ambientGain);
              noise.start(now);
              noise.stop(now + 0.05);
            }

            // C: Active Chiptune Arpeggiator Melodies
            if (currentStep !== 2 && currentStep !== 5) {
              const osc = this.ctx.createOscillator();
              const noteGain = this.ctx.createGain();
              osc.type = 'sine';

              const melodyIndices = [0, 2, 4, 3, 5, 4, 7, 6];
              const pitch = scale[melodyIndices[currentStep % melodyIndices.length]];
              
              osc.frequency.setValueAtTime(pitch, now);
              
              // Slided octaves for high motivation output
              if (currentStep % 2 === 0) {
                osc.frequency.setValueAtTime(pitch, now);
                osc.frequency.linearRampToValueAtTime(pitch * 2, now + 0.14);
              }

              noteGain.gain.setValueAtTime(0.022, now); // Extra crisp volume
              noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

              osc.connect(noteGain);
              if (this.ambientGain) noteGain.connect(this.ambientGain);
              osc.start(now);
              osc.stop(now + 0.25);
            }

            // D: Driving Bassline Chords (changes key code context)
            if (step % 16 === 0) {
              const rootKeys = [130.81, 146.83, 164.81, 196.00]; // C3, D3, E3, G3
              const rPitch = rootKeys[Math.floor(step / 16) % rootKeys.length];
              
              const bassOsc = this.ctx.createOscillator();
              const bassGain = this.ctx.createGain();
              bassOsc.type = 'triangle';
              bassOsc.frequency.setValueAtTime(rPitch, now);
              
              const bFilter = this.ctx.createBiquadFilter();
              bFilter.type = 'lowpass';
              bFilter.frequency.setValueAtTime(150, now);

              bassGain.gain.setValueAtTime(0.016, now);
              bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

              bassOsc.connect(bFilter);
              bFilter.connect(bassGain);
              if (this.ambientGain) bassGain.connect(this.ambientGain);
              bassOsc.start(now);
              bassOsc.stop(now + 1.6);
            }

          } catch (innerErr) {
            console.error("Battle music melody cycle failed", innerErr);
          }
          step++;
        }, 400); // Dynamic step duration
      }

    } catch (e) {
      console.warn("Could not start ambient soundtrack", e);
    }
  }

  stopAmbientMusic() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch (e) {}
      this.ambientGain = null;
    }
  }
}

export const audio = new AudioService();
