import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import {DrawingMode} from '../@core/enum/drawing-mode.enum';
import {ShapeType} from '../@core/enum/shape-type.enum';
import {BrushStyle} from '../@core/interface/brush-style.interface';
import {DrawingCanvasService} from '../@core/services/drawing-canvas.service';
import {BrushStyleType} from '../@core/enum/brush-style-type.enum';

@Component({
  selector: 'app-drawing-canvas',
  standalone: true,
  templateUrl: './drawing-canvas.component.html',
  styleUrl: './drawing-canvas.component.scss'
})
export class DrawingCanvasComponent implements OnChanges, AfterViewInit{
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('textInput') textInputRef?: ElementRef<HTMLInputElement>;

  @Input() width = 800;
  @Input() height = 600;
  @Input() backgroundColor = '#ffffff';
  @Input() lineColor = '#333333';
  @Input() lineWidth = 2;
  @Input() drawingMode: DrawingMode = DrawingMode.Brush;
  @Input() shapeType: ShapeType = ShapeType.Line;
  @Input() fillShape = false;
  @Input() brushStyle: string = 'normal';

  @Output() canvasChanged = new EventEmitter<void>();

  brushStyles: { [key: string]: BrushStyle };

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private startX = 0;
  private startY = 0;

  // Undo/Redo state
  public undoStack: ImageData[] = [];
  public redoStack: ImageData[] = [];
  private maxUndoSteps = 20;

  // Text tool state
  isTextMode = false;
  textPosition = { x: 0, y: 0 };
  textFont = '16px Arial';
  textColor = '#000000';

  constructor(
    private canvasService: DrawingCanvasService
  ) {
    this.brushStyles = this.canvasService.getBrushStyles();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.clearCanvas();

    this.saveCanvasState();

    this.setupEventListeners();

    this.setCursor();
  }

  ngOnChanges() {
    this.setCursor();
  }

  setBackgroundColor() {
    const canvas = this.canvasRef.nativeElement;
    const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height)
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    // this.ctx.putImageData(imageData, 0, 0);
  }

  private clearCanvas(): void {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private setCursor(): void {
    if (!this.canvasRef || !this.canvasRef.nativeElement) {
      console.warn('Canvas reference is not initialized yet.');
      return;
    }

    const canvas = this.canvasRef.nativeElement;

    switch (this.drawingMode) {
      case 'brush':
        canvas.style.cursor = 'url(assets/image/paint-brush.png) 16 16, auto';
        break;
      case 'eraser':
        canvas.style.cursor = 'pointer';
        break;
      case 'shape':
        canvas.style.cursor = 'crosshair';
        break;
      case 'text':
        canvas.style.cursor = 'text';
        break;
      default:
        canvas.style.cursor = 'default';
        break;
    }
  }

  private setupEventListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    canvas.addEventListener('mousemove', (e) => this.draw(e));
    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mouseout', () => this.stopDrawing());

    // Touch events
    canvas.addEventListener('touchstart', (e) => this.startDrawingTouch(e));
    canvas.addEventListener('touchmove', (e) => this.drawTouch(e));
    canvas.addEventListener('touchend', () => this.stopDrawing());
  }

  private startDrawing(e: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
    this.lastX = this.startX;
    this.lastY = this.startY;

    if (this.drawingMode === 'text') {
      this.isTextMode = true;
      this.textPosition = { x: this.startX, y: this.startY };
      // Focus the text input in the next tick
      setTimeout(() => this.textInputRef?.nativeElement.focus(), 0);
      return;
    }

    this.isDrawing = true;

    this.saveCanvasState();
  }

  private draw(e: MouseEvent): void {
    if (!this.isDrawing || this.drawingMode === DrawingMode.Text) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const style = this.brushStyles[this.brushStyle] || this.brushStyles[BrushStyleType.Normal];

    if (this.drawingMode === DrawingMode.Shape) {
      this.restoreCanvasState(this.undoStack[this.undoStack.length - 1]);
      this.drawShape(this.startX, this.startY, currentX, currentY);
    } else {

      this.ctx.strokeStyle = this.drawingMode === DrawingMode.Eraser ? this.backgroundColor : this.lineColor;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.lineJoin = style.lineJoin || 'round';
      this.ctx.lineCap = style.lineCap || 'round';
      this.ctx.globalAlpha = style.opacity || 1;

      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);

      this.ctx.setLineDash(style.lineDash || []);

      this.ctx.shadowBlur = style.shadowBlur || 0;
      this.ctx.shadowColor = style.shadowColor || this.lineColor;

      if (this.brushStyle === BrushStyleType.Sketchy) {
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * this.lineWidth * 2;
          const offsetY = (Math.random() - 0.5) * this.lineWidth * 2;

          this.ctx.beginPath();
          this.ctx.moveTo(this.lastX + offsetX, this.lastY + offsetY);
          this.ctx.lineTo(currentX + offsetX, currentY + offsetY);
          this.ctx.stroke();
        }

        this.lastX = currentX;
        this.lastY = currentY;
        return;
      }

      if (this.brushStyle === BrushStyleType.Calligraphy) {
        const angle = Math.atan2(currentY - this.lastY, currentX - this.lastX);
        this.ctx.lineWidth = this.lineWidth * (1 + Math.abs(Math.sin(angle)));
      } else if (this.brushStyle === BrushStyleType.Spray) {
        for (let i = 0; i < 20; i++) {
          const randX = currentX + (Math.random() - 0.5) * this.lineWidth * 4;
          const randY = currentY + (Math.random() - 0.5) * this.lineWidth * 4;
          this.ctx.fillRect(randX, randY, 1, 1);
        }
        return;
      } else if (this.brushStyle === BrushStyleType.Charcoal) {
        this.ctx.globalAlpha = 0.3;
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * this.lineWidth / 2;
          const offsetY = (Math.random() - 0.5) * this.lineWidth / 2;
          this.ctx.beginPath();
          this.ctx.moveTo(this.lastX + offsetX, this.lastY + offsetY);
          this.ctx.lineTo(currentX + offsetX, currentY + offsetY);
          this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1.0;
      } else if (this.brushStyle === BrushStyleType.Neon) {
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 1)';
        this.ctx.shadowColor = 'rgba(0, 255, 0, 0.8)';
        this.ctx.shadowBlur = 15;
      }

      this.ctx.lineTo(currentX, currentY);
      this.ctx.stroke();

      this.lastX = currentX;
      this.lastY = currentY;
    }
  }

  private drawShape(startX: number, startY: number, endX: number, endY: number): void {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.lineColor;
    this.ctx.fillStyle = this.lineColor;
    this.ctx.lineWidth = this.lineWidth;

    switch (this.shapeType) {
      case ShapeType.Line:
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        break;

      case ShapeType.Rect:
        const rectWidth = endX - startX;
        const rectHeight = endY - startY;
        if (this.fillShape) {
          this.ctx.fillRect(startX, startY, rectWidth, rectHeight);
        } else {
          this.ctx.rect(startX, startY, rectWidth, rectHeight);
        }
        break;

      case ShapeType.Circle:
        const centerX = (startX + endX) / 2;
        const centerY = (startY + endY) / 2;
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / 2;
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        break;

      case ShapeType.Triangle:
        const midX = (startX + endX) / 2;
        const triHeight = Math.abs(endY - startY); // Renamed 'height' to 'triHeight'
        this.ctx.moveTo(midX, startY);  // Top point
        this.ctx.lineTo(startX, endY);  // Bottom-left
        this.ctx.lineTo(endX, endY);    // Bottom-right
        this.ctx.closePath();
        break;

      case ShapeType.Ellipse:
        const ellipseWidth = Math.abs(endX - startX) / 2;
        const ellipseHeight = Math.abs(endY - startY) / 2;
        this.ctx.ellipse(
          (startX + endX) / 2,
          (startY + endY) / 2,
          ellipseWidth,
          ellipseHeight,
          0,
          0,
          Math.PI * 2
        );
        break;

      case ShapeType.Star:
        this.drawStar(startX, startY, endX, endY, 5);
        break;
    }

    if (this.fillShape && this.shapeType !== ShapeType.Line) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  private drawStar(cx: number, cy: number, endX: number, endY: number, points: number): void {
    const radius = Math.sqrt(Math.pow(endX - cx, 2) + Math.pow(endY - cy, 2)) / 2;
    const innerRadius = radius / 2.5;
    const angle = Math.PI / points;

    this.ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? radius : innerRadius;
      const x = cx + r * Math.cos(i * angle - Math.PI / 2);
      const y = cy + r * Math.sin(i * angle - Math.PI / 2);
      this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
  }

  private startDrawingTouch(e: TouchEvent): void {
    e.preventDefault();
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.startX = e.touches[0].clientX - rect.left;
    this.startY = e.touches[0].clientY - rect.top;
    this.lastX = this.startX;
    this.lastY = this.startY;

    if (this.drawingMode === DrawingMode.Text) {
      this.isTextMode = true;
      this.textPosition = { x: this.startX, y: this.startY };
      return;
    }

    this.isDrawing = true;

    // Save the current canvas state before starting a new drawing operation
    this.saveCanvasState();
  }

  private drawTouch(e: TouchEvent): void {
    e.preventDefault();
    if (!this.isDrawing || this.drawingMode === DrawingMode.Text) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const currentX = e.touches[0].clientX - rect.left;
    const currentY = e.touches[0].clientY - rect.top;

    if (this.drawingMode === DrawingMode.Shape) {
      this.restoreCanvasState(this.undoStack[this.undoStack.length - 1]);
      this.drawShape(this.startX, this.startY, currentX, currentY);
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(currentX, currentY);
      this.ctx.strokeStyle = this.drawingMode === DrawingMode.Eraser ? this.backgroundColor : this.lineColor;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();

      this.lastX = currentX;
      this.lastY = currentY;
    }
  }

  private stopDrawing(): void {
    if (!this.isDrawing) return;

    this.isDrawing = false;

    this.canvasChanged.emit();

    this.redoStack = [];
  }

  confirmText(text: string): void {
    if (!text.trim()) {
      this.isTextMode = false;
      return;
    }

    this.saveCanvasState();

    this.ctx.font = this.textFont;
    this.ctx.fillStyle = this.textColor;
    this.ctx.fillText(text, this.textPosition.x, this.textPosition.y);

    this.isTextMode = false;
    this.canvasChanged.emit();
    this.redoStack = [];
  }

  undo(): void {
    if (this.undoStack.length <= 1) return;

    this.redoStack.push(this.undoStack.pop()!);

    this.restoreCanvasState(this.undoStack[this.undoStack.length - 1]);

    this.canvasChanged.emit();
  }

  redo(): void {
    if (this.redoStack.length === 0) return;
    const state = this.redoStack.pop()!;
    this.undoStack.push(state);
    this.restoreCanvasState(state);
    this.canvasChanged.emit();
  }

  saveCanvasState(): void {
    const canvas = this.canvasRef.nativeElement;
    const state = this.ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Add to undo stack
    this.undoStack.push(state);

    // Limit the stack size
    if (this.undoStack.length > this.maxUndoSteps) {
      this.undoStack.shift();
    }
  }

  restoreCanvasState(state: ImageData): void {
    this.ctx.putImageData(state, 0, 0);
  }

  public clear(): void {
    this.saveCanvasState();
    this.clearCanvas();

    this.redoStack = [];

    this.canvasChanged.emit();
  }

  public saveAsImage(filename: string = 'canvas-drawing.png'): void {
    const canvas = this.canvasRef.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  public saveAsVideo(): void {
    const canvas = this.canvasRef.nativeElement;

    const stream = canvas.captureStream(30); // Capture at 30fps (adjust the number as necessary)
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    let chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas-video.webm';  // Set the desired filename
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);

  }

  public resizeCanvas(newWidth: number, newHeight: number): void {
    const canvas = this.canvasRef.nativeElement;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;

    // Copy the current canvas to the temp canvas
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    // Resize the main canvas
    this.width = newWidth;
    this.height = newHeight;
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Clear the resized canvas
    this.clearCanvas();

    // Copy the temp canvas content back to the main canvas
    this.ctx.drawImage(tempCanvas, 0, 0);

    // Update the undo stack
    this.saveCanvasState();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    // CTRL+Z for undo
    if (event.ctrlKey && event.key === 'z') {
      this.undo();
      event.preventDefault();
    }

    // CTRL+Y for redo
    if (event.ctrlKey && event.key === 'y') {
      this.redo();
      event.preventDefault();
    }
  }
}
