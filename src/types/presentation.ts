export type SlideCategory = 
  | 'overview'
  | 'concept_design'
  | 'social_standards'
  | 'multi_photo'
  | 'color_theory'
  | 'lighting_3d'
  | 'commercial_design'
  | 'visual_identity'
  | 'case_study'
  | 'concept_art'
  | 'assets_3d'
  | 'exercises'
  | 'summary';

export type LayoutType = 
  | 'hero_cover'
  | 'concept_minimal'
  | 'ai_design_minimal'
  | 'gen_model_minimal'
  | 'lighting_minimal'
  | 'lighting_duo_minimal'
  | 'composition_perspective_minimal'
  | 'color_analysis_minimal'
  | 'value_contrast_minimal'
  | 'style_art_gallery_minimal'
  | 'typography_minimal'
  | 'design_process_minimal'
  | 'design_process_unified'
  | 'sketch_minimal'
  | 'element_replacement_minimal'
  | 'lighting_retouch_minimal'
  | 'global_lighting_minimal'
  | 'finish_effects_minimal'
  | 'gen_ai_grid_minimal'
  | 'prompt_minimal'
  | 'editorial_question_minimal'
  | 'cube_lighting_studio'
  | 'theory_grid'
  | 'multi_photo_spec'
  | 'interactive_color'
  | 'interactive_3d'
  | 'poster_breakdown'
  | 'side_by_side'
  | 'gallery_grid'
  | 'exercise_task'
  | 'social_mockup'
  | 'social_size_minimal'
  | 'social_multi_image_minimal'
  | 'social_size_error_minimal'
  | 'full_visual';

export interface ImageSpec {
  url: string;
  caption?: string;
  dimensions?: string;
  badge?: string;
  aspectRatio?: string;
  role?: 'primary' | 'secondary' | 'analysis' | 'sketch' | 'texture';
}

export interface InteractiveFeature {
  type: 'color_slider' | 'light_angle' | 'dimension_calculator' | 'image_layer_toggle' | 'reaction_counter';
  title?: string;
  data?: any;
}

export interface KeyRule {
  title: string;
  detail: string;
  badge?: string;
}

export interface SlideData {
  id: number;
  slideNumber: string;
  category: SlideCategory;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  primaryText: string;
  keyPoints?: string[];
  rules?: KeyRule[];
  specs?: {
    label: string;
    value: string;
    sub?: string;
  }[];
  images: ImageSpec[];
  layoutType: LayoutType;
  interactiveFeature?: InteractiveFeature;
  notes?: string;
  brand?: string;
}
