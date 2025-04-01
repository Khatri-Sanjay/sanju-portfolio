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

  private animationFrameId: number | null = null; // Store animation frame

  getDefaultOptions(): DrawingOptions {
    return {...this.defaultOptions};
  }

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


  createParticleEffect(canvas: HTMLCanvasElement, particleCount: number = 100): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: any[] = [];

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

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  stopParticleEffect(canvas: HTMLCanvasElement): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
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
}
