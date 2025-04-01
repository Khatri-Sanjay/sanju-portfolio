import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {DrawingMode} from './@core/enum/drawing-mode.enum';
import {ShapeType} from './@core/enum/shape-type.enum';
import {BrushStyleType} from './@core/enum/brush-style-type.enum';
import {DrawingCanvasComponent} from './drawing-canva/drawing-canvas.component';
import {NgClass} from '@angular/common';
import {ImageFilter} from './@core/enum/image-filter.enum';
import {GradientType} from './@core/enum/gradient-type.enum';
import {BrushStyle} from './@core/interface/brush-style.interface';
import {DrawingCanvasService} from './@core/services/drawing-canvas.service';

@Component({
  selector: 'app-drawing-page',
  imports: [
    FormsModule,
    NgbTooltip,
    DrawingCanvasComponent,
    NgClass
  ],
  templateUrl: './drawing-page.component.html',
  styleUrl: './drawing-page.component.scss'
})
export class DrawingPageComponent {
  @ViewChild('canvasComponent') canvasComponent!: DrawingCanvasComponent;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  private particleCanvas!: HTMLCanvasElement; // Separate canvas for particles

  isToolbarCollapsed: boolean = false;

  canvasWidth = 1200;
  canvasHeight = 600;
  backgroundColor = '#ffffff';
  gradiantColorOne = '#fa5d5d';
  gradiantColorTwo = '#ff6600';
  gradiantColorThree = '#ffcc00';
  lineColor = '#333333';
  lineWidth = 2;

  DrawingMode = DrawingMode;
  ShapeType = ShapeType;
  ImageFilter = ImageFilter;
  GradientType = GradientType;

  // Drawing mode options
  currentMode: DrawingMode = DrawingMode.Brush;
  currentShapeType: ShapeType = ShapeType.Line;
  fillShape = false;

  // Text options
  textColor = '#000000';
  fontSize = '16';
  fontFamily = 'Arial';

  // Brush styles
  brushStyles: { [key: string]: BrushStyle };
  brushStyleKeys: { key: string; value: BrushStyleType }[] = Object.entries(BrushStyleType).map(([key, value]) => ({ key, value }));
  currentBrushStyle: BrushStyleType = BrushStyleType.Normal;

  // Grid options
  showGrid = false;
  gridSize = 20;

  // Image adjustment options
  brightness = 0;
  contrast = 0;
  saturation = 0;

  myArray = new Array(10);

  constructor(
    private canvasService: DrawingCanvasService
  ) {
    this.brushStyles = this.canvasService.getBrushStyles();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    if (window.innerWidth < 992) {
      this.isToolbarCollapsed = true;
    }
  }

  toggleToolbar(): void {
    this.isToolbarCollapsed = !this.isToolbarCollapsed;
  }

  getIconClass(mode: string): string {
    const iconMap: { [key in DrawingMode]: string } = {
      [DrawingMode.Brush]: 'bi bi-brush',
      [DrawingMode.Eraser]: 'bi bi-eraser',
      [DrawingMode.Shape]: 'bi bi-hexagon',
      [DrawingMode.Text]: 'bi bi-type'
    };
    return iconMap[mode as DrawingMode] || 'bi bi-question-circle';
  }

  setDrawingMode(mode: DrawingMode): void {
    this.currentMode = mode;
    if (this.canvasComponent) {
      this.canvasComponent.drawingMode = mode;
    }
  }

  setShapeType(type: ShapeType): void {
    this.currentShapeType = type;
    if (this.canvasComponent) {
      this.canvasComponent.shapeType = type;
    }
  }

  setBrushStyle(style: BrushStyleType): void {
    if (this.brushStyles[style]) {
      this.currentBrushStyle = style;
      console.log('currentBrushStyle', this.currentBrushStyle);
    }
  }

  updateCanvasOptions(): void {
    if (this.canvasComponent) {
      this.canvasComponent.lineColor = this.lineColor;
      this.canvasComponent.lineWidth = this.lineWidth;
    }
  }

  updateBackGroundColor() {
    if (this.canvasComponent) {
      this.canvasComponent.backgroundColor = this.backgroundColor;
      this.canvasComponent.setBackgroundColor();
    }
  }

  updateTextOptions(): void {
    if (this.canvasComponent) {
      this.canvasComponent.textColor = this.textColor;
      this.canvasComponent.textFont = `${this.fontSize}px ${this.fontFamily}`;
    }
  }

  undo(): void {
    if (this.canvasComponent) {
      this.canvasComponent.undo();
    }
  }

  redo(): void {
    if (this.canvasComponent) {
      this.canvasComponent.redo();
    }
  }

  clear(): void {
    if (this.canvasComponent) {
      this.canvasComponent.clear();
    }

    if (this.particleCanvas) {
      this.canvasService.stopParticleEffect(this.particleCanvas);
    }
  }

  saveImage(): void {
    if (this.canvasComponent) {
      this.canvasComponent.saveAsImage(`canvas-drawing-${new Date().toISOString()}.png`);
    }
  }

  saveVideo() {
    if (this.canvasComponent) {
      this.canvasComponent.saveAsVideo();
    }
  }

  resizeCanvas(): void {
    if (this.canvasComponent) {
      this.canvasComponent.resizeCanvas(this.canvasWidth, this.canvasHeight);
    }
  }

  applyFilter(filterType: ImageFilter): void {
    if (this.canvasComponent) {
      const canvas = this.canvasComponent.canvasRef.nativeElement;
      this.canvasService.applyFilter(canvas, filterType);
      this.canvasComponent.canvasChanged.emit();
      this.canvasComponent.saveCanvasState();
    }
  }

  applyGradient(type: GradientType): void {
    if (this.canvasComponent) {
      const canvas = this.canvasComponent.canvasRef.nativeElement;
      const colors = [this.gradiantColorOne, this.gradiantColorTwo, this.gradiantColorThree];
      this.canvasService.createGradient(canvas, type, colors);
      this.canvasComponent.canvasChanged.emit();
      this.canvasComponent.saveCanvasState();
    }
  }

  createParticleEffect(): void {
    if (this.canvasComponent) {
      const mainCanvas = this.canvasComponent.canvasRef.nativeElement;

      // Create a separate canvas for particles if not already created
      if (!this.particleCanvas) {
        this.particleCanvas = document.createElement('canvas');
        this.particleCanvas.width = mainCanvas.width;
        this.particleCanvas.height = mainCanvas.height;
        this.particleCanvas.style.position = 'absolute';
        this.particleCanvas.style.top = '0';
        this.particleCanvas.style.left = '0';
        this.particleCanvas.style.pointerEvents = 'none'; // Allow clicks to pass through
        mainCanvas.parentElement?.appendChild(this.particleCanvas);
      }

      // Start animation on the new particle canvas
      this.canvasService.createParticleEffect(this.particleCanvas, 50);
    }
  }

  toggleGrid(): void {
    if (this.canvasComponent && this.showGrid) {
      const canvas = this.canvasComponent.canvasRef.nativeElement;
      // First restore the last state to clear any previous grid
      if (this.canvasComponent.undoStack.length > 0) {
        this.canvasComponent.restoreCanvasState(
          this.canvasComponent.undoStack[this.canvasComponent.undoStack.length - 1]
        );
      }
      this.canvasService.drawGrid(canvas, this.gridSize);
    } else if (this.canvasComponent && !this.showGrid) {
      // Restore the last state to remove the grid
      if (this.canvasComponent.undoStack.length > 0) {
        this.canvasComponent.restoreCanvasState(
          this.canvasComponent.undoStack[this.canvasComponent.undoStack.length - 1]
        );
      }
    }
  }

  adjustImage(): void {
    if (this.canvasComponent) {
      const canvas = this.canvasComponent.canvasRef.nativeElement;
      this.canvasService.adjustImage(canvas, {
        brightness: this.brightness,
        contrast: this.contrast,
        saturation: this.saturation
      });
      this.canvasComponent.canvasChanged.emit();
    }
  }

  resetAdjustments(): void {
    this.brightness = 0;
    this.contrast = 0;
    this.saturation = 0;

    if (this.canvasComponent && this.canvasComponent.undoStack.length > 0) {
      this.canvasComponent.restoreCanvasState(
        this.canvasComponent.undoStack[this.canvasComponent.undoStack.length - 1]
      );
    }
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && this.canvasComponent) {
          const canvas = this.canvasComponent.canvasRef.nativeElement;
          const imageUrl = e.target.result as string;

          // Save current state before adding image
          this.canvasComponent.saveCanvasState();

          // Add image to center of canvas
          this.canvasService.addImageToCanvas(
            canvas,
            imageUrl,
            canvas.width / 4,
            canvas.height / 4,
            canvas.width / 2,
            canvas.height / 2
          ).then(() => {
            this.canvasComponent.canvasChanged.emit();
          }).catch(error => {
            console.error('Error loading image:', error);
          });
        }
      };

      reader.readAsDataURL(file);
      input.value = '';
    }
  }

  onCanvasChanged(): void {
    console.log('Canvas changed');
  }
}

