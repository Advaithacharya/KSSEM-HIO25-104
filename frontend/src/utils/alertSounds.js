/**
 * Alert Sound System
 * Plays different sounds based on alert type and severity
 */

class AlertSoundManager {
  constructor() {
    this.enabled = localStorage.getItem('alert-sounds-enabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('alert-volume') || '0.7');
    this.audioContext = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  // Generate tone using Web Audio API
  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Alert-specific sounds
  playGestureAlert() {
    // Two quick beeps
    this.playTone(800, 0.15);
    setTimeout(() => this.playTone(1000, 0.15), 200);
  }

  playFallAlert() {
    // Urgent descending tone
    this.playTone(1200, 0.2);
    setTimeout(() => this.playTone(900, 0.2), 150);
    setTimeout(() => this.playTone(600, 0.3), 300);
  }

  playVoiceAlert() {
    // Three quick high-pitched beeps
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.playTone(1500, 0.1), i * 150);
    }
  }

  playEmotionAlert() {
    // Moderate urgency - sustained tone
    this.playTone(950, 0.5);
  }

  playAnomalyAlert() {
    // Pulsing alert
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.playTone(700, 0.1, 'square'), i * 200);
    }
  }

  playEscalationAlert() {
    // Very urgent - loud rapid beeps
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(1800, 0.1);
        this.playTone(1400, 0.1);
      }, i * 250);
    }
  }

  playAcknowledgeSound() {
    // Confirmation beep
    this.playTone(600, 0.08);
    setTimeout(() => this.playTone(800, 0.08), 100);
  }

  playResolveSound() {
    // Success sound - ascending tones
    this.playTone(600, 0.1);
    setTimeout(() => this.playTone(800, 0.1), 100);
    setTimeout(() => this.playTone(1000, 0.15), 200);
  }

  playAlert(alertType, severity = 'medium') {
    switch (alertType?.toLowerCase()) {
      case 'gesture':
        this.playGestureAlert();
        break;
      case 'fall':
        this.playFallAlert();
        break;
      case 'voice':
        this.playVoiceAlert();
        break;
      case 'emotion':
        this.playEmotionAlert();
        break;
      case 'anomaly':
        this.playAnomalyAlert();
        break;
      case 'escalation':
      case 'escalated':
        this.playEscalationAlert();
        break;
      default:
        this.playGestureAlert();
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('alert-sounds-enabled', enabled.toString());
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('alert-volume', this.volume.toString());
  }

  getVolume() {
    return this.volume;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const alertSoundManager = new AlertSoundManager();
export default alertSoundManager;
