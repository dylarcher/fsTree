import { COLOR_HUES, CSS_COLORS, LAYOUT } from "../shared/constants.js";

/**
 * Service for generating CSS styles for file trees
 */

/**
 * Generates CSS custom properties for colors
 */
function generateColorProperties() {
  const lightProps = Object.entries(CSS_COLORS)
    .filter(([key]) => key.startsWith("light"))
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  const darkProps = Object.entries(CSS_COLORS)
    .filter(([key]) => key.startsWith("dark"))
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  const baseProps = Object.entries(CSS_COLORS)
    .filter(([key]) => !key.startsWith("light") && !key.startsWith("dark"))
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  return `
  ${lightProps}
  ${darkProps}

  ${baseProps}
	`;
}

/**
 * Generates theme-specific CSS variables
 */
function generateThemeVariables() {
  return `
  @media (prefers-color-scheme: dark) {
    --white: var(--darkWhite);
    --black: var(--darkBlack);
    --blue: var(--darkBlue);
    --cyan: var(--darkCyan);
    --gold: var(--darkGold);
    --gray: var(--darkGray);
    --green: var(--darkGreen);
    --maroon: var(--darkMaroon);
    --olive: var(--darkOlive);
    --orange: var(--darkOrange);
    --pink: var(--darkPink);
    --purple: var(--darkPurple);
    --red: var(--darkRed);
    --slate: var(--darkSlate);
    --violet: var(--darkViolet);
    --yellow: var(--darkYellow);
  }

  @media (prefers-color-scheme: light) {
    --white: var(--lightWhite);
    --black: var(--lightBlack);
    --blue: var(--lightBlue);
    --cyan: var(--lightCyan);
    --gold: var(--lightGold);
    --gray: var(--lightGray);
    --green: var(--lightGreen);
    --maroon: var(--lightMaroon);
    --olive: var(--lightOlive);
    --orange: var(--lightOrange);
    --pink: var(--lightPink);
    --purple: var(--lightPurple);
    --red: var(--lightRed);
    --slate: var(--lightSlate);
    --violet: var(--lightViolet);
    --yellow: var(--lightYellow);
  }
	`;
}

/**
 * Generates base typography and layout styles
 */
function generateBaseStyles() {
  return `
body {
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "Noto Sans",
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji";
  margin: 0;
  padding: 0;
  background-color: var(--black);
  color: var(--white);
  overflow-x: auto;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.hierarchy-list {
  display: flex;
  flex-direction: column;
  gap: ${LAYOUT.HIERARCHY_GAP};
  max-width: fit-content;
  min-width: 200px;
}

.hierarchy-list li {
  position: relative;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: ${LAYOUT.NODE_PADDING};
  border-radius: ${LAYOUT.BORDER_RADIUS};
  cursor: pointer;
  user-select: none;
  transition: ${LAYOUT.TRANSITION};
  position: relative;
  z-index: 3;
  font-size: 0.8125rem;
  line-height: 1.2;
}

.node-content:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

.node-content.empty-folder {
  cursor: default;
  opacity: 0.4;
  filter: grayscale(0.5);
  pointer-events: none;
}

.node-content::before {
  content: "";
  position: absolute;
  left: -0.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.125rem;
  height: 1rem;
  background-color: var(--colorWhite);
  border-radius: 0.0625rem;
  opacity: 0.2;
  transition: ${LAYOUT.TRANSITION};
}

.node-content::after {
  content: "";
  position: absolute;
  left: -0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  background-color: #111827;
  border-radius: 50%;
  box-shadow: none;
  filter: opacity(0.15);
  z-index: 2;
}

.node-content:hover::after {
  background-color: var(--colorWhite);
  filter: opacity(0.05);
}
	`;
}

/**
 * Generates hierarchy list styles
 */
function generateHierarchyStyles() {
  return `
.diagram-container {
  position: relative;
  display: inline-block;
  max-width: 100%;
  width: fit-content;
  min-height: 100px;
  padding: 0.5rem;
}

.hierarchy-list li[aria-expanded="false"] > ul {
  display: none;
}

#svg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.icon {
  width: ${LAYOUT.ICON_SIZE};
  height: ${LAYOUT.ICON_SIZE};
  flex-shrink: 0;
  color: var(--colorWhite);
}

.dir,
.folder {
  color: var(--colorSlate);
}
	`;
}

/**
 * Generates color-specific styles for each color hue
 */
function generateColorStyles() {
  return COLOR_HUES.map(
    (color) => `
.hierarchy-list li[data-color="${color}"] .icon,
.hierarchy-list li[data-color="${color}"] span {
  color: var(--color${color}) !important;
}
.hierarchy-list li[data-color="${color}"] .node-content::before {
  background: var(--color${color}) !important;
}
	`
  ).join("");
}

/**
 * Generates folder expansion/collapse icon styles
 */
function generateFolderIconStyles() {
  return `
.folder[aria-expanded="true"] .icon-collapsed {
  display: none;
}
.folder[aria-expanded="true"] .icon-expanded {
  display: inline;
}
.folder[aria-expanded="false"] .icon-collapsed {
  display: inline;
}
.folder[aria-expanded="false"] .icon-expanded {
  display: none;
}
.folder:not([aria-expanded]) .icon-collapsed {
  display: inline;
}
.folder:not([aria-expanded]) .icon-expanded {
  display: none;
}
	`;
}

/**
 * Generates hierarchy highlight styles
 */
function generateHighlightStyles() {
  return `
.hierarchy-list .node-content.hierarchy-highlight {
  background-color: #374151 !important;
  border-color: #6b7280 !important;
  transform: scale(1.02);
  box-shadow: 0 0 1px 2px var(--branch-color);
  outline: 1px dashed var(--branch-color);
  outline-offset: -3px;
  transition: ${LAYOUT.TRANSITION};
}

.hierarchy-list .node-content.hierarchy-highlight::before {
  filter: brightness(1.4) !important;
  transform: scale(1.3) translateY(-0.21875rem) !important;
  transition: ${LAYOUT.TRANSITION};
}

.hierarchy-list .node-content.hierarchy-highlight::after {
  background-color: rgba(17, 24, 39, 0.9) !important;
  filter: brightness(1.2) !important;
}
	`;
}

/**
 * Generates layout styles for the main container
 */
function generateLayoutStyles() {
  return `
.main-body {
  padding: 1rem;
}

@media (min-width: 640px) {
  .main-body {
    padding: 2rem;
  }
}

.container {
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;
}

.main-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: white;
}

@media (min-width: 640px) {
  .main-title {
    font-size: 1.875rem;
  }
}

.diagram-container {
  position: relative;
  padding: 1rem;
  background-color: #111827;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
	`;
}

/**
 * Generates modal styles
 */
function generateModalStyles() {
  return `
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.modal-overlay.hidden {
  display: none;
}

.modal-content {
  position: absolute;
  top: 1rem;
  right: 1rem;
  bottom: 1rem;
  left: 1rem;
  background-color: #111827;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-wrapper {
  display: flex;
  height: 100%;
}

.modal-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #1f2937;
  padding: 1rem;
  z-index: 10;
}

.modal-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.modal-close-btn {
  color: #9ca3af;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.modal-close-btn:hover {
  color: white;
}

.modal-body {
  flex: 1;
  padding-top: 4rem;
  padding: 1rem;
}

.dependency-tree-container {
  width: 100%;
  height: 100%;
  background-color: #111827;
}
	`;
}

/**
 * Generates complete CSS styles for the file tree
 */
export function generateStyles() {
  return `
:root {
${generateColorProperties()}
${generateThemeVariables()}
}

${generateBaseStyles()}
${generateHierarchyStyles()}
${generateColorStyles()}
${generateFolderIconStyles()}
${generateHighlightStyles()}
${generateLayoutStyles()}
${generateModalStyles()}
	`;
}

/**
 * Generates only the essential styles (minimal CSS)
 */
export function generateMinimalStyles() {
  return `
:root {
${generateColorProperties()}
}

${generateBaseStyles()}
${generateHierarchyStyles()}
${generateFolderIconStyles()}
	`;
}

/**
 * Generates theme-specific styles
 */
export function generateThemeStyles(theme = "auto") {
  let themeStyles = "";

  if (theme === "dark" || theme === "auto") {
    themeStyles += `
:root {
  --white: var(--darkWhite);
  --black: var(--darkBlack);
}
		`;
  }

  if (theme === "light" || theme === "auto") {
    themeStyles += `
@media (prefers-color-scheme: light) {
  :root {
    --white: var(--lightWhite);
    --black: var(--lightBlack);
  }
}
		`;
  }

  return themeStyles;
}
