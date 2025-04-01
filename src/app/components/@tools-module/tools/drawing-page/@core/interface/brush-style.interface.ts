import {BrushTexture} from '../enum/brush-texture.enum';

export interface BrushStyle {
  name: string;
  lineJoin?: CanvasLineJoin;
  lineCap?: CanvasLineCap;
  lineDash?: number[];
  shadowBlur?: number;
  shadowColor?: string;
  opacity?: number;
  texture?: BrushTexture;
}
