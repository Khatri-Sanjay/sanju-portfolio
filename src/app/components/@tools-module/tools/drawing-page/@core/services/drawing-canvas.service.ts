import { Injectable } from '@angular/core';
import {DrawingOptions} from '../interface/drawing-options.interface';
import {BrushStyle} from '../interface/brush-style.interface';
import {BrushStyles} from '../const/brush-styles';
import {ImageFilter} from '../enum/image-filter.enum';
import {GradientType} from '../enum/gradient-type.enum';

@Injectable({
  providedIn: 'root'
})
export class DrawingCanvasService {
  private defaultOptions: DrawingOptions = {
    lineWidth: 2,
    lineColor: '#333333',
    backgroundColor: '#ffffff'
  };

  brushStyles = BrushStyles;

  getBrushStyles(): { [key: string]: BrushStyle } {
    return this.brushStyles;
  }

  applyFilter(canvas: HTMLCanvasElement, filterType: ImageFilter): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch(filterType) {
      case ImageFilter.Grayscale:
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        break;
      case ImageFilter.Invert:
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];         // red
          data[i + 1] = 255 - data[i + 1]; // green
          data[i + 2] = 255 - data[i + 2]; // blue
        }
        break;
      case ImageFilter.Sepia:
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
      case ImageFilter.Blur:
        const tempData = new Uint8ClampedArray(data.length);
        for (let i = 0; i < data.length; i++) {
          tempData[i] = data[i];
        }

        const blurRadius = 2;
        const width = canvas.width;
        const height = canvas.height;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let sumR = 0, sumG = 0, sumB = 0, count = 0;

            for (let dy = -blurRadius; dy <= blurRadius; dy++) {
              for (let dx = -blurRadius; dx <= blurRadius; dx++) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  const index = (ny * width + nx) * 4;
                  sumR += tempData[index];
                  sumG += tempData[index + 1];
                  sumB += tempData[index + 2];
                  count++;
                }
              }
            }

            const index = (y * width + x) * 4;
            data[index] = sumR / count;
            data[index + 1] = sumG / count;
            data[index + 2] = sumB / count;
          }
        }
        break;
      case ImageFilter.Sharpen:
        const tempData2 = new Uint8ClampedArray(data.length);
        for (let i = 0; i < data.length; i++) {
          tempData2[i] = data[i];
        }

        const width2 = canvas.width;
        const height2 = canvas.height;

        // Sharpen kernel: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]]
        for (let y = 1; y < height2 - 1; y++) {
          for (let x = 1; x < width2 - 1; x++) {
            const index = (y * width2 + x) * 4;
            const indexN = ((y - 1) * width2 + x) * 4;
            const indexS = ((y + 1) * width2 + x) * 4;
            const indexW = (y * width2 + x - 1) * 4;
            const indexE = (y * width2 + x + 1) * 4;

            for (let c = 0; c < 3; c++) {
              const val = 5 * tempData2[index + c] - tempData2[indexN + c] -
                tempData2[indexS + c] - tempData2[indexW + c] - tempData2[indexE + c];
              data[index + c] = Math.max(0, Math.min(255, val));
            }
          }
        }
        break;
      case ImageFilter.Emboss:
        const tempData3 = new Uint8ClampedArray(data.length);
        for (let i = 0; i < data.length; i++) {
          tempData3[i] = data[i];
        }

        const width3 = canvas.width;
        const height3 = canvas.height;

        for (let y = 1; y < height3 - 1; y++) {
          for (let x = 1; x < width3 - 1; x++) {
            const index = (y * width3 + x) * 4;
            const indexNW = ((y - 1) * width3 + x - 1) * 4;

            for (let c = 0; c < 3; c++) {
              const val = 128 + (tempData3[index + c] - tempData3[indexNW + c]);
              data[index + c] = Math.max(0, Math.min(255, val));
            }
          }
        }
        break;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // Create gradient effect
  createGradient(canvas: HTMLCanvasElement, type: GradientType, colors: string[]): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let gradient;

    switch(type) {
      case GradientType.LinearHorizontal:
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        break;
      case GradientType.LinearVertical:
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        break;
      case GradientType.Radial:
        gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        break;
      default:
        gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    }

    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Add an image to the canvas
  addImageToCanvas(canvas: HTMLCanvasElement, imageUrl: string, x: number, y: number, width?: number, height?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Canvas context not available');
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(
          img,
          x, y,
          width || img.width,
          height || img.height
        );
        resolve();
      };
      img.onerror = () => reject('Failed to load image');
      img.src = imageUrl;
    });
  }

  // Grid / Snap to grid functionality
  drawGrid(canvas: HTMLCanvasElement, gridSize: number): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();

    // Draw vertical lines
    for (let x = gridSize; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = gridSize; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.stroke();
    }

    ctx.restore();
  }

  // Adjust canvas image attributes
  adjustImage(canvas: HTMLCanvasElement, adjustments: { brightness?: number, contrast?: number, saturation?: number }): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const brightness = adjustments.brightness || 0;
    const contrast = adjustments.contrast || 0;
    const saturation = adjustments.saturation || 0;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply brightness
      r += brightness;
      g += brightness;
      b += brightness;

      // Apply contrast
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      b = factor * (b - 128) + 128;

      // Apply saturation
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      r = Math.max(0, Math.min(255, gray + saturation * (r - gray)));
      g = Math.max(0, Math.min(255, gray + saturation * (g - gray)));
      b = Math.max(0, Math.min(255, gray + saturation * (b - gray)));

      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    ctx.putImageData(imageData, 0, 0);
  }

  private animationFrameId: number | null = null;
  private animationIds: Map<string, number> = new Map();

  private effectsConfig = {
    shimmering: {
      baseColor: { r: 255, g: 255, b: 255 },
      connectionOpacity: 0.3,
      glowIntensity: 0.4,
      waveStrength: 1.2,
      speedFactor: 0.6
    },
    flowing: {
      baseColor: { r: 30, g: 144, b: 255 },
      glowIntensity: 0.8,
      waveStrength: 1.2,
      speedFactor: 0.8
    },
    interactive: {
      baseColor: { h: 200, s: 80, l: 60 },
      interactionRadius: 0.15, // percentage of canvas width
      maxForce: 6,
      particleSizeVariation: 3
    },
    confetti: {
      colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#4CAF50', '#FFEB3B'],
      gravity: 0.1,
      friction: 0.98,
      duration: 3000, // ms
      sizeVariation: { min: 5, max: 12 }
    }
  };

  createParticleEffect(canvas: HTMLCanvasElement, particleCount: number = 100): string {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const particles: any[] = [];
    const effectId = `particle-${Date.now()}`;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 5 + 1,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      this.animationIds.set(effectId, requestAnimationFrame(animate));

    };

    animate();
    return effectId;

  }

  /**
   * Creates a shimmering particle effect with connected lines between nearby particles
   */
  createShimmeringNetworkEffect(canvas: HTMLCanvasElement, particleCount: number = 100): string {
    console.log('      waveStrength: 1.2,\n');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Resize canvas to match display size for better resolution
    // this.resizeCanvasToDisplaySize(canvas);

    const particles: any[] = [];
    const effectId = `network-${Date.now()}`;
    const { baseColor, connectionOpacity, glowIntensity, speedFactor } = this.effectsConfig.shimmering;

    // Connection distance based on canvas dimensions for consistent look at different sizes
    const connectionDistance = Math.min(canvas.width, canvas.height) * 0.15;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${Math.random() * 0.5 + 0.3})`,
        speedX: (Math.random() * 2 - 1) * speedFactor,
        speedY: (Math.random() * 2 - 1) * speedFactor,
        pulse: Math.random() * Math.PI * 2, // Random starting phase
        pulseSpeed: Math.random() * 0.04 + 0.02
      });
    }

    // Spatial partitioning for improved performance
    const gridSize = Math.ceil(connectionDistance);
    const gridCells: Map<string, any[]> = new Map();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Reset grid
      gridCells.clear();

      // Update particles and assign to grid cells
      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges with slight randomization for natural movement
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
          particle.speedX += (Math.random() * 0.2 - 0.1) * speedFactor;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
          particle.speedY += (Math.random() * 0.2 - 0.1) * speedFactor;
        }

        // Normalize speed if it gets too high
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
        if (speed > 2 * speedFactor) {
          particle.speedX = (particle.speedX / speed) * 2 * speedFactor;
          particle.speedY = (particle.speedY / speed) * 2 * speedFactor;
        }

        // Update pulse with smoother sine wave
        particle.pulse += particle.pulseSpeed;
        if (particle.pulse > Math.PI * 2) particle.pulse -= Math.PI * 2;

        // Add particle to spatial grid
        const cellX = Math.floor(particle.x / gridSize);
        const cellY = Math.floor(particle.y / gridSize);
        const cellKey = `${cellX},${cellY}`;

        if (!gridCells.has(cellKey)) {
          gridCells.set(cellKey, []);
        }
        gridCells.get(cellKey)!.push(particle);
      });

      // First draw connections using the grid for optimization
      ctx.globalAlpha = connectionOpacity;
      particles.forEach(particle => {
        const cellX = Math.floor(particle.x / gridSize);
        const cellY = Math.floor(particle.y / gridSize);

        // Check only neighboring cells
        for (let x = cellX - 1; x <= cellX + 1; x++) {
          for (let y = cellY - 1; y <= cellY + 1; y++) {
            const cellKey = `${x},${y}`;
            const cellParticles = gridCells.get(cellKey);

            if (cellParticles) {
              cellParticles.forEach(otherParticle => {
                if (particle === otherParticle) return;

                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                  const opacity = 0.15 * (1 - distance / connectionDistance);
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity})`;
                  ctx.lineWidth = 0.5;
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(otherParticle.x, otherParticle.y);
                  ctx.stroke();
                }
              });
            }
          }
        }
      });

      // Then draw particles
      ctx.globalAlpha = 1;
      particles.forEach(particle => {
        // Draw particle with improved pulsing effect
        const pulseFactor = 0.7 + Math.sin(particle.pulse) * 0.3;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add enhanced glow effect
        const gradientSize = particle.radius * (3 + Math.sin(particle.pulse) * 0.5);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, particle.radius * 0.5,
          particle.x, particle.y, gradientSize
        );
        gradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${glowIntensity})`);
        gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, gradientSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      this.animationIds.set(effectId, requestAnimationFrame(animate));
    };

    animate();
    return effectId;
  }

  /**
   * Creates a flowing wave particle effect that moves across the canvas with improved aesthetics
   */
  createFlowingWaveEffect(canvas: HTMLCanvasElement, particleCount: number = 150): string {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Resize canvas to match display size
    // this.resizeCanvasToDisplaySize(canvas);

    const effectId = `wave-${Date.now()}`;
    const particles: any[] = [];
    const { baseColor, glowIntensity, waveStrength, speedFactor } = this.effectsConfig.flowing;

    // Create gradient background for improved depth
    const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    backgroundGradient.addColorStop(0, `rgba(${baseColor.r * 0.2}, ${baseColor.g * 0.2}, ${baseColor.b * 0.2}, 0.2)`);
    backgroundGradient.addColorStop(1, `rgba(${baseColor.r * 0.1}, ${baseColor.g * 0.1}, ${baseColor.b * 0.1}, 0.1)`);

    // Different types of particles for visual variety
    const particleTypes = [
      { // Bright, fast-moving
        sizeRange: [1, 3],
        speedRange: [0.5, 1.2],
        opacityRange: [0.4, 0.8],
        brightnessRange: [0.7, 1.0],
        waveMagnitude: [1, 2]
      },
      { // Medium, average speed
        sizeRange: [2, 5],
        speedRange: [0.3, 0.8],
        opacityRange: [0.3, 0.6],
        brightnessRange: [0.6, 0.9],
        waveMagnitude: [1.5, 3]
      },
      { // Large, slow-moving
        sizeRange: [4, 8],
        speedRange: [0.1, 0.4],
        opacityRange: [0.2, 0.5],
        brightnessRange: [0.5, 0.8],
        waveMagnitude: [2, 4]
      }
    ];

    for (let i = 0; i < particleCount; i++) {
      // Select random particle type
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];

      // Get random values within type ranges
      const getInRange = (range: number[]) => range[0] + Math.random() * (range[1] - range[0]);

      const brightness = getInRange(type.brightnessRange);
      const size = getInRange(type.sizeRange);
      const speed = getInRange(type.speedRange) * speedFactor;
      const opacity = getInRange(type.opacityRange);
      const waveMagnitude = getInRange(type.waveMagnitude) * waveStrength;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: size,
        speedX: speed * (Math.random() > 0.5 ? 1 : -1),
        waveAmplitude: waveMagnitude,
        waveFrequency: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        opacity: opacity,
        color: `rgba(
        ${Math.floor(baseColor.r * brightness)},
        ${Math.floor(baseColor.g * brightness)},
        ${Math.floor(baseColor.b * brightness)},
        ${opacity})`,
        // Add vertical drift for more organic movement
        driftY: Math.random() * 0.2 - 0.1
      });
    }

    let time = 0;

    const animate = () => {
      // Semi-transparent clear for motion trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle background gradient
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      // Sort particles by size for depth effect
      particles.sort((a, b) => a.size - b.size);

      particles.forEach(particle => {
        // Update position with wave motion
        particle.x += particle.speedX;

        // More complex wave pattern with both time and position factors
        const xFactor = particle.x * particle.waveFrequency * 0.1;
        const timeFactor = time * particle.waveFrequency;
        particle.y = particle.y +
          Math.sin(timeFactor + particle.phase) * particle.waveAmplitude +
          particle.driftY;

        // Wrap around edges
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;

        // Depth-based opacity for more immersive feel
        const depthFactor = 0.7 + (particle.size / 8) * 0.3;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add enhanced glow with size variation
        const glowSize = particle.size * (3 + Math.sin(time + particle.phase) * 0.5);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        gradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${particle.opacity * glowIntensity * depthFactor})`);
        gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      this.animationIds.set(effectId, requestAnimationFrame(animate));
    };

    animate();
    return effectId;
  }

  /**
   * Creates interactive particle effect that responds to mouse movement with improved interaction
   */
  createInteractiveParticleEffect(canvas: HTMLCanvasElement, particleCount: number = 80): string {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Resize canvas to match display size
    // this.resizeCanvasToDisplaySize(canvas);

    const effectId = `interactive-${Date.now()}`;
    const particles: any[] = [];
    const { baseColor, interactionRadius, maxForce, particleSizeVariation } = this.effectsConfig.interactive;

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: canvas.width * interactionRadius,
      isDown: false
    };

    // Add mouse event listeners
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });

    canvas.addEventListener('mousedown', () => {
      mouse.isDown = true;
    });

    canvas.addEventListener('mouseup', () => {
      mouse.isDown = false;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
      mouse.isDown = false;
    });

    // Touch events for mobile support
    canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.touches[0].clientX - rect.left;
      mouse.y = event.touches[0].clientY - rect.top;
      mouse.isDown = true;
    });

    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.touches[0].clientX - rect.left;
      mouse.y = event.touches[0].clientY - rect.top;
    });

    canvas.addEventListener('touchend', () => {
      mouse.isDown = false;
    });

    // Create particles with varying properties
    for (let i = 0; i < particleCount; i++) {
      // Use HSL color with variation
      const hue = baseColor.h + Math.random() * 40 - 20;
      const saturation = baseColor.s + Math.random() * 20 - 10;
      const lightness = baseColor.l + Math.random() * 30 - 15;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * particleSizeVariation + 2,
        baseRadius: Math.random() * particleSizeVariation + 2,
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        baseSpeed: Math.random() * 0.5 + 0.5,
        maxSpeed: Math.random() * maxForce + 3,
        mass: Math.random() * 0.5 + 0.5, // For physics calculations
        dampening: Math.random() * 0.03 + 0.95, // Slightly different dampening per particle
        // For trailing effect
        trail: [] as {x: number, y: number}[],
        trailLength: Math.floor(Math.random() * 5) + 3
      });
    }

    // Time tracking for consistent animation speed
    let lastTime = 0;

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Use request animation frame delta time for smooth animation
      const timeCorrection = deltaTime / 16.67; // Normalize to 60fps

      // Clear with fade for motion trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Store previous position for trail effect
        if (particle.trail.length >= particle.trailLength) {
          particle.trail.shift();
        }
        particle.trail.push({x: particle.x, y: particle.y});

        // Default speed based on base speed and time correction
        let accelerationX = 0;
        let accelerationY = 0;

        // Apply mouse interaction if mouse is on canvas
        if (mouse.x !== null && mouse.y !== null) {
          const distX = mouse.x - particle.x;
          const distY = mouse.y - particle.y;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if (distance < mouse.radius) {
            // Calculate force direction
            const forceDirectionX = distX / distance;
            const forceDirectionY = distY / distance;

            // Calculate force strength (stronger when closer)
            const force = (mouse.radius - distance) / mouse.radius;

            // Apply force based on mouse state (attract when clicked, repel when not)
            const multiplier = mouse.isDown ? 1 : -1;
            accelerationX = forceDirectionX * force * particle.maxSpeed * multiplier;
            accelerationY = forceDirectionY * force * particle.maxSpeed * multiplier;

            // Increase particle size when near mouse
            particle.radius = particle.baseRadius * (1 + force);
          } else {
            // Return to base size gradually
            particle.radius = particle.baseRadius + (particle.radius - particle.baseRadius) * 0.9;
          }
        } else {
          // Return to base size when mouse leaves
          particle.radius = particle.baseRadius + (particle.radius - particle.baseRadius) * 0.9;
        }

        // Apply acceleration to speed
        particle.speedX += accelerationX * timeCorrection;
        particle.speedY += accelerationY * timeCorrection;

        // Apply dampening
        particle.speedX *= particle.dampening;
        particle.speedY *= particle.dampening;

        // Limit maximum speed
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
        if (speed > particle.maxSpeed) {
          particle.speedX = (particle.speedX / speed) * particle.maxSpeed;
          particle.speedY = (particle.speedY / speed) * particle.maxSpeed;
        }

        // Add a small random movement for more natural behavior
        if (Math.random() < 0.05) {
          particle.speedX += (Math.random() * 0.4 - 0.2) * timeCorrection;
          particle.speedY += (Math.random() * 0.4 - 0.2) * timeCorrection;
        }

        // Update position with time correction
        particle.x += particle.speedX * timeCorrection;
        particle.y += particle.speedY * timeCorrection;

        // Bounce off edges with dampening
        if (particle.x < particle.radius) {
          particle.x = particle.radius;
          particle.speedX *= -0.8;
        } else if (particle.x > canvas.width - particle.radius) {
          particle.x = canvas.width - particle.radius;
          particle.speedX *= -0.8;
        }

        if (particle.y < particle.radius) {
          particle.y = particle.radius;
          particle.speedY *= -0.8;
        } else if (particle.y > canvas.height - particle.radius) {
          particle.y = canvas.height - particle.radius;
          particle.speedY *= -0.8;
        }

        // Draw trail effect
        if (particle.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);

          for (let i = 1; i < particle.trail.length; i++) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }

          ctx.strokeStyle = particle.color.replace('hsl', 'hsla').replace(')', ', 0.2)');
          ctx.lineWidth = particle.radius * 0.8;
          ctx.stroke();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );

        // Extract HSL values for glow
        const colorMatch = particle.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (colorMatch) {
          const [, h, s, l] = colorMatch.map(Number);
          gradient.addColorStop(0, `hsla(${h}, ${s}%, ${l}%, 0.3)`);
          gradient.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      this.animationIds.set(effectId, requestAnimationFrame(animate));
    };

    animate(0);
    return effectId;
  }

  /**
   * Create an enhanced confetti particle burst effect with improved physics and visuals
   */
  createConfettiBurstEffect(canvas: HTMLCanvasElement, burstX?: number, burstY?: number, particleCount: number = 100): string {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Resize canvas to match display size
    // this.resizeCanvasToDisplaySize(canvas);

    const effectId = `confetti-${Date.now()}`;
    const particles: any[] = [];
    const { colors, gravity, friction, duration, sizeVariation } = this.effectsConfig.confetti;

    const centerX = burstX || canvas.width / 2;
    const centerY = burstY || canvas.height / 2;

    // Create different particle shapes for more variety
    const shapes = ['rect', 'circle', 'triangle', 'star'];

    // Add burst shockwave effect
    const shockwave = {
      radius: 10,
      maxRadius: Math.min(canvas.width, canvas.height) * 0.3,
      alpha: 0.8,
      expanding: true
    };

    // Create confetti particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 3;
      const size = Math.random() * (sizeVariation.max - sizeVariation.min) + sizeVariation.min;
      const rotationSpeed = Math.random() * 10 - 5;

      // More varied colors with occasional metallic sheen
      const colorIndex = Math.floor(Math.random() * colors.length);
      let color = colors[colorIndex];

      // Occasionally add metallic or bright highlight
      if (Math.random() > 0.8) {
        // Create lighter/metallic variant
        const lighterColor = this.adjustColorBrightness(color, 40);
        color = lighterColor;
      }

      particles.push({
        x: centerX,
        y: centerY,
        size: size,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        color: color,
        rotation: Math.random() * 360,
        rotationSpeed: rotationSpeed,
        angularVelocity: rotationSpeed,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1,
        // Add wobble effect
        wobble: Math.random() * 3,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        wobbleAngle: Math.random() * Math.PI * 2,
        // Different physics for different shapes
        mass: size / 10 + 0.5,
        // Add delayed fade effect
        fadeDelay: Math.random() * 1000
      });
    }

    const startTime = Date.now();
    let lastTime = 0;

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      const timeCorrection = Math.min(deltaTime / 16.67, 2); // Normalize to 60fps, cap at 2

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw shockwave if still expanding
      if (shockwave.expanding) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, shockwave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${shockwave.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Expand shockwave
        shockwave.radius += 10 * timeCorrection;
        shockwave.alpha -= 0.02 * timeCorrection;

        if (shockwave.radius > shockwave.maxRadius || shockwave.alpha <= 0) {
          shockwave.expanding = false;
        }
      }

      let particlesRemaining = false;
      const elapsedTime = Date.now() - startTime;

      particles.forEach(particle => {
        // Apply physics with time correction
        particle.speedY += gravity * particle.mass * timeCorrection;
        particle.speedX *= friction;
        particle.speedY *= friction;

        particle.x += particle.speedX * timeCorrection;
        particle.y += particle.speedY * timeCorrection;

        // Update rotation with angular velocity
        particle.rotation += particle.rotationSpeed * timeCorrection;

        // Update wobble effect
        particle.wobbleAngle += particle.wobbleSpeed * timeCorrection;
        const wobbleX = Math.sin(particle.wobbleAngle) * particle.wobble;
        const wobbleY = Math.cos(particle.wobbleAngle) * particle.wobble;

        // Handle fade-out based on time
        if (elapsedTime > particle.fadeDelay) {
          const fadeRate = 0.003 * timeCorrection;
          particle.opacity -= fadeRate;
        }

        if (particle.opacity > 0) {
          particlesRemaining = true;

          // Set transparency
          ctx.globalAlpha = particle.opacity;

          // Draw particle based on shape
          switch (particle.shape) {
            case 'rect':
              ctx.save();
              ctx.translate(particle.x + wobbleX, particle.y + wobbleY);
              ctx.rotate(particle.rotation * Math.PI / 180);
              ctx.fillStyle = particle.color;
              ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
              ctx.restore();
              break;

            case 'circle':
              ctx.beginPath();
              ctx.arc(particle.x + wobbleX, particle.y + wobbleY, particle.size / 2, 0, Math.PI * 2);
              ctx.fillStyle = particle.color;
              ctx.fill();
              break;

            case 'triangle':
              ctx.save();
              ctx.translate(particle.x + wobbleX, particle.y + wobbleY);
              ctx.rotate(particle.rotation * Math.PI / 180);
              ctx.beginPath();
              ctx.moveTo(0, -particle.size / 2);
              ctx.lineTo(particle.size / 2, particle.size / 2);
              ctx.lineTo(-particle.size / 2, particle.size / 2);
              ctx.closePath();
              ctx.fillStyle = particle.color;
              ctx.fill();
              ctx.restore();
              break;

            case 'star':
              ctx.save();
              ctx.translate(particle.x + wobbleX, particle.y + wobbleY);
              ctx.rotate(particle.rotation * Math.PI / 180);
              ctx.beginPath();

              // Draw a 5-point star
              const outerRadius = particle.size / 2;
              const innerRadius = particle.size / 4;
              const spikes = 5;

              for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                if (i === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              }

              ctx.closePath();
              ctx.fillStyle = particle.color;
              ctx.fill();
              ctx.restore();
              break;
          }

          // Reset global alpha
          ctx.globalAlpha = 1;
        }
      });

      // Continue animation if particles remain or stop after duration limit
      if (particlesRemaining && (elapsedTime < duration)) {
        this.animationIds.set(effectId, requestAnimationFrame(animate));
      } else {
        // Remove animation frame ID when complete
        this.animationIds.delete(effectId);
      }
    };

    animate(0);
    return effectId;
  }

  /**
   * Utility method to adjust color brightness
   */
  private adjustColorBrightness(hexColor: string, amount: number): string {
    // Convert hex to RGB
    let r = parseInt(hexColor.substring(1, 3), 16);
    let g = parseInt(hexColor.substring(3, 5), 16);
    let b = parseInt(hexColor.substring(5, 7), 16);

    // Adjust brightness
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Stop and remove a specific animation effect by its ID
   */
  stopEffect(canvas: HTMLCanvasElement, effectId: string): boolean {
    if (this.animationIds.has(effectId)) {
      cancelAnimationFrame(this.animationIds.get(effectId)!);
      this.animationIds.delete(effectId);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return true;
    }
    return false;
  }

  /**
   * Stop all running animation effects
   */
  stopAllEffects(canvas: HTMLCanvasElement): void {
    this.animationIds.forEach((id) => {
      cancelAnimationFrame(id);
    });
    this.animationIds.clear();

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  /**
   * Resize canvas to match its display size
   */
  private resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }

    return false;
  }

}

