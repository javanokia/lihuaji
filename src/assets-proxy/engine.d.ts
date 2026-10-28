export interface EmbroideryDesign {
  title: string;
  source: string;
  options: {
    title: string;
    size: number;
    spacing: number;
    colors: number;
    stitch: string;
    ignoreBg: boolean;
  };
  paths: Array<{
    color: number;
    layer: number;
    stitch: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    order?: number;
  }>;
  colors: Array<{
    code: string;
    rgb: number[];
    hex: string;
    layer: number;
    count: number;
    length: number;
  }>;
  score: number;
  tips: string[];
  metrics: {
    actualSpacingMm: number;
    complexity: number;
    tinyRatio: number;
    stitches: number;
    threadMeters: number;
    hours: number;
  };
  engine: string;
  svg: string;
  archiveSource?: {
    title?: string;
    sourceUrl?: string;
    author?: string;
    license?: string;
    licenseUrl?: string;
    derivativeChanges?: string;
  };
  csv?: string;
}

export function generate(source: string, opt: any): Promise<EmbroideryDesign>;
export function designSVG(design: EmbroideryDesign, layer?: number, pathsVisible?: boolean): string;
export function pathCSV(design: EmbroideryDesign): string;
export function dataURL(svg: string): string;
export function loadImage(src: string): Promise<HTMLImageElement>;

export * from '../../assets/engine.js';
