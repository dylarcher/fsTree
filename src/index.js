/**
 * Main entry point for the fsTree library
 * Provides a unified API for creating file tree visualizations
 */

import { setupEventListeners } from "./core/eventManagment.js";
import { drawConnectionLines } from "./core/pathCoordinator.js";
import { createRootNode } from "./core/treeConstructor.js";
import { generateTreeMarkup } from "./services/markupGenerator.js";
import {
  generateInlineScript,
  generateMinimalScript,
} from "./services/scriptGenerator.js";
import {
  generateMinimalStyles,
  generateStyles,
} from "./services/styleGenerator.js";
import {
  generateFormattedTextTree,
  generateMinimalTextTree,
  generateTextTree as generateTextTreeInternal,
} from "./services/textGenerator.js";
import { createConfig } from "./shared/configAdjuster.js";
import { getDirname, resolvePath } from "./utils/fileSystem.js";
import {
  createIgnoreFilter,
  getAllGitignorePatterns,
} from "./utils/ignoreFile.js";

/**
 * Creates a complete file tree visualization
 */
export class FileTree {
  constructor(rootDir, options = {}) {
    this.config = createConfig({
      tree: { rootDir, ...options.tree },
      drawing: options.drawing,
      theme: options.theme,
      generator: options.generator,
    });

    this.rootDir = rootDir;
    this.rootNode = null;
    this.containerElement = null;
    this.svgElement = null;
    this.cleanupFunction = null;
  }

  /**
   * Builds the tree structure from the file system
   */
  build() {
    const mapesmDir = resolvePath(
      getDirname(import.meta.url.replace("file://", "")),
      "../"
    );

    const allGitignoreRules = getAllGitignorePatterns(mapesmDir, this.rootDir);
    const shouldIgnoreFunc = createIgnoreFilter(allGitignoreRules);

    this.rootNode = createRootNode(this.rootDir, shouldIgnoreFunc);
    return this;
  }

  /**
   * Generates HTML markup for the tree
   */
  generateHTML() {
    if (!this.rootNode) this.build();
    return generateTreeMarkup(this.rootNode);
  }

  /**
   * Generates CSS styles for the tree
   */
  generateCSS(minimal = false) {
    return minimal ? generateMinimalStyles() : generateStyles();
  }

  /**
   * Generates JavaScript code for tree interactions
   */
  generateJS(minimal = false) {
    return minimal ? generateMinimalScript() : generateInlineScript();
  }

  /**
   * Generates text-based tree representation
   */
  generateText(options = {}) {
    if (!this.rootNode) this.build();
    const { format = "standard", ...textOptions } = options;

    switch (format) {
      case "minimal":
        return generateMinimalTextTree(this.rootNode);
      case "formatted":
        return generateFormattedTextTree(this.rootNode, textOptions);
      case "standard":
      default:
        return generateTextTreeInternal(this.rootNode, textOptions);
    }
  }

  /**
   * Renders the tree to a DOM element
   */
  render(containerElement, options = {}) {
    if (!this.rootNode) this.build();

    this.containerElement = containerElement;

    const markup = this.generateHTML();
    containerElement.innerHTML = `
			<div id="diagram-container" class="diagram-container">
				${markup}
				<svg id="svg-container"></svg>
			</div>
		`;

    this.svgElement = containerElement.querySelector("#svg-container");
    const diagramContainer =
      containerElement.querySelector("#diagram-container");

    this.cleanupFunction = setupEventListeners(
      diagramContainer,
      this.svgElement,
      options.onToggle,
      options.onHover
    );

    drawConnectionLines(diagramContainer, this.svgElement);

    return this;
  }

  /**
   * Cleans up event listeners and resources
   */
  destroy() {
    if (this.cleanupFunction) {
      this.cleanupFunction();
      this.cleanupFunction = null;
    }

    if (this.containerElement) {
      this.containerElement.innerHTML = "";
      this.containerElement = null;
    }

    this.svgElement = null;
  }

  /**
   * Updates the tree (rebuilds and re-renders)
   */
  update() {
    if (this.containerElement) {
      const options = {
        onToggle: this.onToggle,
        onHover: this.onHover,
      };
      this.destroy();
      this.build();
      this.render(this.containerElement, options);
    }
    return this;
  }

  /**
   * Gets the tree data as a plain object
   */
  toJSON() {
    if (!this.rootNode) this.build();
    return JSON.parse(JSON.stringify(this.rootNode));
  }

  /**
   * Gets tree statistics
   */
  getStats() {
    if (!this.rootNode) this.build();

    const stats = {
      totalNodes: 0,
      directories: 0,
      files: 0,
      maxDepth: 0,
    };

    function traverse(node, depth = 0) {
      stats.totalNodes++;
      stats.maxDepth = Math.max(stats.maxDepth, depth);

      if (node.isDirectory) {
        stats.directories++;
        if (node.children) {
          node.children.forEach((child) => traverse(child, depth + 1));
        }
      } else {
        stats.files++;
      }
    }

    traverse(this.rootNode);
    return stats;
  }
}

/**
 * Quick utility functions for simple use cases
 */

/**
 * Generates complete HTML page with embedded styles and scripts
 */
export function generateCompletePage(rootDir, options = {}) {
  const tree = new FileTree(rootDir, options);
  const markup = tree.generateHTML();
  const styles = tree.generateCSS();
  const scripts = tree.generateJS();

  const title =
    options.title || `File Tree - ${tree.rootNode?.name || "Directory"}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${title}</title>
	<style>${styles}</style>
</head>
<body>
	<div class="main-body">
		<div class="container">
			<h1 class="main-title">${title}</h1>
			<div id="diagram-container" class="diagram-container">
				${markup}
				<svg id="svg-container"></svg>
			</div>
		</div>
	</div>
	<script>${scripts}</script>
</body>
</html>`;
}

/**
 * Quick function to generate just markup
 */
export function generateMarkup(rootDir, options = {}) {
  const tree = new FileTree(rootDir, options);
  return tree.generateHTML();
}

/**
 * Quick function to generate text-based tree
 */
export function generateTextTree(rootDir, options = {}) {
  const tree = new FileTree(rootDir, options);
  return tree.generateText(options);
}

export { setupEventListeners } from "./core/eventManagment.js";
export { drawConnectionLines } from "./core/pathCoordinator.js";
export {
  buildFileTree,
  createRootNode,
  getColorForFile,
  getIconForFile,
} from "./core/treeConstructor.js";
export * from "./shared/configPresets.js";
export * from "./shared/constants.js";

