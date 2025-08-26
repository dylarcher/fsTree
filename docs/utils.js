/**
 * DOM Transform Utilities
 * Can be used in both module and non-module contexts
 *
 * This file consolidates common transform and DOM manipulation utilities
 * to reduce code duplication between main.js (docs) and modular components.
 *
 * Key functions:
 * - Transform utilities: setTranslateX, clearTransform, applyConditionalTranslateX
 * - Node management: resetHierarchyNodeStyles, calculateChildOffset
 * - SVG path generation: calculatePathData, createConnectionPath
 */

// Transform utilities
const TransformUtils = {
  /**
   * Applies translateX transform to element
   */
  setTranslateX(element, xOffset) {
    element.style.transform = `translateX(${xOffset}px)`;
  },

  /**
   * Clears transform style on element
   */
  clearTransform(element) {
    element.style.transform = "";
  },

  /**
   * Applies translateX transform conditionally based on offset value
   */
  applyConditionalTranslateX(element, xOffset) {
    if (xOffset > 0) {
      this.setTranslateX(element, xOffset);
    } else {
      this.clearTransform(element);
    }
  },

  /**
   * Resets transforms for multiple elements matching a selector
   */
  resetTransforms(selector, context = document) {
    const elements = context.querySelectorAll(selector);
    elements.forEach((element) => this.clearTransform(element));
  },

  /**
   * Resets node styles (transforms and branch colors) for hierarchy list
   */
  resetHierarchyNodeStyles() {
    // Reset branch colors
    const allListItems = document.querySelectorAll(".hierarchy-list li");
    allListItems.forEach((li) => {
      li.style.removeProperty("--branch-color");
    });

    // Reset transforms
    this.resetTransforms(".hierarchy-list .node-content");
  },

  /**
   * Calculates horizontal offset for child nodes to create staggered effect
   */
  calculateChildOffset(childCount, index, offsetMultiplier = 12) {
    return childCount > 1 ? (childCount - 1 - index) * offsetMultiplier : 0;
  },

  /**
   * Calculates SVG path data for connecting two points with rounded corners
   */
  calculatePathData(pX, pY, cX, cY, xOffset) {
    const horizontalLength = 30 + xOffset * 0.5;
    const cornerRadius = 24;
    const midX = pX + horizontalLength;

    // Simple line if points are close vertically
    if (Math.abs(pY - cY) <= cornerRadius * 2) {
      return `M ${pX} ${pY} L ${cX} ${cY}`;
    }

    const horizontalEnd = Math.min(midX + cornerRadius, cX);

    // Downward path
    if (pY < cY) {
      return `
        M ${pX} ${pY}
        L ${midX - cornerRadius} ${pY}
        Q ${midX} ${pY} ${midX} ${pY + cornerRadius}
        L ${midX} ${cY - cornerRadius}
        Q ${midX} ${cY} ${horizontalEnd} ${cY}
        L ${cX} ${cY}
      `;
    }
    // Upward path
    else {
      return `
        M ${pX} ${pY}
        L ${midX - cornerRadius} ${pY}
        Q ${midX} ${pY} ${midX} ${pY - cornerRadius}
        L ${midX} ${cY + cornerRadius}
        Q ${midX} ${cY} ${horizontalEnd} ${cY}
        L ${cX} ${cY}
      `;
    }
  },

  /**
   * Creates an SVG path element with connection styling
   */
  createConnectionPath(pathData, childColor, parentLi, childLi) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);

    const isFolderToFolder =
      parentLi.classList.contains("folder") &&
      childLi.classList.contains("folder");

    if (isFolderToFolder) {
      path.setAttribute("stroke", "slategray");
      path.setAttribute("stroke-dasharray", "3, 3");
      path.setAttribute("stroke-opacity", "0.8");
    } else {
      path.setAttribute("stroke", childColor);
      path.setAttribute("stroke-opacity", "0.8");
    }

    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    path.setAttribute("data-parent-id", parentLi.getAttribute("data-id"));
    path.setAttribute("data-child-id", childLi.getAttribute("data-id"));

    return path;
  },
};

// Export for modules if available, otherwise attach to window
if (typeof module !== "undefined" && module.exports) {
  module.exports = TransformUtils;
} else if (typeof window !== "undefined") {
  window.TransformUtils = TransformUtils;
}
