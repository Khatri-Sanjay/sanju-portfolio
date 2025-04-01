import {BrushStyleType} from '../enum/brush-style-type.enum';
import {BrushStyle} from '../interface/brush-style.interface';
import {BrushTexture} from '../enum/brush-texture.enum';

export const BrushStyles: { [key in BrushStyleType]: BrushStyle } = {
  [BrushStyleType.Normal]: {
    name: 'Normal',
    lineJoin: 'round',
    lineCap: 'round',
    lineDash: [],
    shadowBlur: 0,
    opacity: 1
  },
  [BrushStyleType.Sketchy]: {
    name: 'Sketchy',
    lineJoin: 'bevel',
    lineCap: 'round',
    lineDash: [],
    shadowBlur: 0,
    opacity: 1,
    texture: BrushTexture.Rough
  },
  [BrushStyleType.Square]: {
    name: 'Square',
    lineJoin: 'miter',
    lineCap: 'butt',
    lineDash: [5, 5],
    shadowBlur: 0,
    opacity: 1
  },
  [BrushStyleType.Spray]: {
    name: 'Spray',
    lineJoin: 'round',
    lineCap: 'round',
    lineDash: [],
    shadowBlur: 5,
    opacity: 0.6,
    texture: BrushTexture.Grainy
  },
  [BrushStyleType.Calligraphy]: {
    name: 'Calligraphy',
    lineJoin: 'round',
    lineCap: 'round',
    lineDash: [],
    shadowBlur: 0,
    opacity: 1
  },
  [BrushStyleType.Charcoal]: {
    name: 'Charcoal',
    lineJoin: 'round',
    lineCap: 'round',
    lineDash: [],
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.8,
    texture: BrushTexture.Rough
  },
  [BrushStyleType.Neon]: {
    name: 'Neon Glow',
    lineJoin: 'round',
    lineCap: 'round',
    lineDash: [],
    shadowBlur: 15,
    shadowColor: 'rgba(0, 255, 0, 1)',
    opacity: 0.9,
    texture: BrushTexture.Glow
  },
  [BrushStyleType.Dotted]: {
    name: 'Dotted Line',
    lineJoin: 'round',
    lineCap: 'round',
    lineDash: [1, 5],
    shadowBlur: 0,
    opacity: 1
  },
  [BrushStyleType.Watercolor]: {
    name: 'Watercolor',
    lineJoin: 'round',
    lineCap: 'round',
    lineDash: [],
    shadowBlur: 5,
    opacity: 0.5,
    texture: BrushTexture.Smooth
  },
  [BrushStyleType.Ink]: {
    name: 'Ink Pen',
    lineJoin: 'round',
    lineCap: 'round',
    lineDash: [],
    shadowBlur: 0,
    opacity: 1,
    texture: BrushTexture.Smooth
  },
  [BrushStyleType.Marker]: {
    name: 'Marker',
    lineJoin: 'round',
    lineCap: 'round',
    lineDash: [],
    shadowBlur: 2,
    opacity: 0.85,
    texture: BrushTexture.Smooth
  },
  [BrushStyleType.Emboss]: {
    name: 'Emboss',
    lineJoin: 'miter',
    lineCap: 'square',
    lineDash: [],
    shadowBlur: 5,
    shadowColor: 'rgba(200, 200, 200, 0.8)',
    opacity: 0.9,
    texture: BrushTexture.Rough
  }
};
