import { CSS_COLORS, DRAWING, LAYOUT } from "./constants.js";

/**
 * Default configuration for the file tree system
 */

/**
 * Default drawing configuration
 * @type {import('../types.js').DrawingConfig}
 */
export const DEFAULT_DRAWING_CONFIG = {
  cornerRadius: DRAWING.CORNER_RADIUS,
  horizontalLength: DRAWING.HORIZONTAL_LENGTH,
  strokeWidth: DRAWING.STROKE_WIDTH,
  folderStrokeOpacity: DRAWING.FOLDER_STROKE_OPACITY,
  strokeDasharray: DRAWING.STROKE_DASHARRAY,
  childOffsetMultiplier: DRAWING.CHILD_OFFSET_MULTIPLIER,
  horizontalOffsetFactor: DRAWING.HORIZONTAL_OFFSET_FACTOR,
  redrawDelay: DRAWING.REDRAW_DELAY,
};

/**
 * Default theme configuration
 * @type {import('../types.js').ThemeConfig}
 */
export const DEFAULT_THEME_CONFIG = {
  mode: "auto",
  colors: CSS_COLORS,
  layout: LAYOUT,
};

/**
 * Default tree options
 * @type {Partial<import('../types.js').TreeOptions>}
 */
export const DEFAULT_TREE_OPTIONS = {
  showHidden: false,
  maxDepth: Infinity,
  shouldIgnore: null,
  colorGenerator: null,
  iconResolver: null,
};

/**
 * Default generator options
 * @type {import('../types.js').GeneratorOptions}
 */
export const DEFAULT_GENERATOR_OPTIONS = {
  inlineStyles: false,
  inlineScripts: false,
  features: ["toggle", "hover", "lines"],
  theme: DEFAULT_THEME_CONFIG,
  minify: false,
  customStyles: {},
  customScripts: {},
};

/**
 * Feature flags for optional functionality
 */
export const FEATURES = {
  TOGGLE: "toggle",
  HOVER: "hover",
  LINES: "lines",
  SEARCH: "search",
  EXPORT: "export",
  ANIMATIONS: "animations",
};

/**
 * Supported output formats
 */
export const OUTPUT_FORMATS = {
  HTML: "html",
  JSON: "json",
  MARKDOWN: "markdown",
  SVG: "svg",
};

/**
 * Event types
 */
export const EVENT_TYPES = {
  TOGGLE: "tree:toggle",
  HOVER: "tree:hover",
  CLICK: "tree:click",
  RENDER: "tree:render",
  ERROR: "tree:error",
};

/**
 * CSS class names
 */
export const CSS_CLASSES = {
  HIERARCHY_LIST: "hierarchy-list",
  NODE_CONTENT: "node-content",
  FOLDER: "folder",
  FILE: "file",
  EMPTY_FOLDER: "empty-folder",
  ICON: "icon",
  ICON_COLLAPSED: "icon-collapsed",
  ICON_EXPANDED: "icon-expanded",
  HIERARCHY_HIGHLIGHT: "hierarchy-highlight",
};

/**
 * HTML attributes
 */
export const HTML_ATTRIBUTES = {
  DATA_ID: "data-id",
  DATA_ROUTE: "data-route",
  DATA_COLOR: "data-color",
  DATA_LEVEL: "data-level",
  ARIA_EXPANDED: "aria-expanded",
  DATA_PARENT_ID: "data-parent-id",
  DATA_CHILD_ID: "data-child-id",
};
