export interface LearningPathMountOptions {
  initialPath?: string;
  onOpenCourse?: (param?: any) => any;
  onOpenKnowledge?: (param?: any) => any;
  onOpenPractice?: (param?: any) => any;
  onOpenArt?: (param?: any) => any;
  onOpenTool?: (param?: any) => any;
  confirmReset?: (message: string) => boolean;
}

export interface LearningPathController {
  selectPath?: (id: string) => void;
  destroy?: () => void;
  [key: string]: any;
}

export function mountLearningPath(
  root: HTMLElement,
  options?: LearningPathMountOptions
): LearningPathController;

export * from '../../assets/learning-path.js';
