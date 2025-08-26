import { DRAWING, EVENTS } from "../shared/constants.js";
import {
  addClass,
  addEventListenerWithCleanup,
  closest,
  delay,
  getAttribute,
  hasClass,
  query,
  queryAll,
  removeClass,
  setAttribute,
} from "../utils/docsModel.js";
import {
  clearConnectionHighlight,
  drawConnectionLines,
  highlightConnectionPaths,
} from "./pathCoordinator.js";

/**
 * Core event handling logic for tree interactions
 */

/**
 * Sets up all event listeners for the file tree
 */
export function setupEventListeners(
  diagramContainer,
  svg,
  onToggle = null,
  onHover = null
) {
  const cleanupFunctions = [];

  
  updateAriaExpanded();

  
  queryAll(".node-content").forEach((node) => {
    
    if (!hasClass(node, EVENTS.EMPTY_FOLDER_CLASS)) {
      const cleanup = addEventListenerWithCleanup(node, "click", (event) =>
        handleNodeToggle(event, diagramContainer, svg, onToggle)
      );
      cleanupFunctions.push(cleanup);
    }
  });

  
  const hoverCleanup = setupHoverListeners(svg, onHover);
  cleanupFunctions.push(hoverCleanup);

  
  const resizeCleanup = addEventListenerWithCleanup(window, "resize", () =>
    delay(
      () => drawConnectionLines(diagramContainer, svg),
      DRAWING.REDRAW_DELAY
    )
  );
  cleanupFunctions.push(resizeCleanup);

  
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

/**
 * Handles node toggle (expand/collapse) events
 */
function handleNodeToggle(event, diagramContainer, svg, onToggle) {
  const targetLi = closest(event.currentTarget, "li");

  if (targetLi && hasClass(targetLi, "folder")) {
    const childUl = targetLi.querySelector(":scope > ul");

    
    if (childUl && childUl.children.length === 0) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    const isCurrentlyExpanded =
      getAttribute(targetLi, EVENTS.FOLDER_EXPANDED_ATTRIBUTE) !== "false";
    const newExpandedState = !isCurrentlyExpanded;

    
    setAttribute(
      targetLi,
      EVENTS.FOLDER_EXPANDED_ATTRIBUTE,
      newExpandedState.toString()
    );

    
    const icon = targetLi.querySelector(":scope > .node-content > svg");
    if (icon) {
      setAttribute(
        icon,
        EVENTS.FOLDER_EXPANDED_ATTRIBUTE,
        newExpandedState.toString()
      );
    }

    
    delay(
      () => drawConnectionLines(diagramContainer, svg),
      DRAWING.REDRAW_DELAY
    );

    
    if (onToggle) {
      onToggle(targetLi, newExpandedState);
    }
  }
}

/**
 * Updates aria-expanded attributes for all folders
 */
function updateAriaExpanded() {
  const allFolders = queryAll(".hierarchy-list li.folder");
  allFolders.forEach((folder) => {
    const icon = folder.querySelector(":scope > .node-content > svg");
    const isExpanded =
      getAttribute(folder, EVENTS.FOLDER_EXPANDED_ATTRIBUTE) !== "false";

    setAttribute(
      folder,
      EVENTS.FOLDER_EXPANDED_ATTRIBUTE,
      isExpanded.toString()
    );

    if (icon) {
      setAttribute(
        icon,
        EVENTS.FOLDER_EXPANDED_ATTRIBUTE,
        isExpanded.toString()
      );
    }
  });
}

/**
 * Sets up hover listeners for hierarchy highlighting
 */
function setupHoverListeners(svg, onHover) {
  const cleanupFunctions = [];

  queryAll(".node-content").forEach((node) => {
    const li = closest(node, "li");

    
    if (node.hierarchyEnterHandler) {
      node.removeEventListener("mouseenter", node.hierarchyEnterHandler);
    }
    if (node.hierarchyLeaveHandler) {
      node.removeEventListener("mouseleave", node.hierarchyLeaveHandler);
    }

    
    node.hierarchyEnterHandler = () => {
      highlightHierarchyPath(li, svg);
      if (onHover) onHover(li, true);
    };

    node.hierarchyLeaveHandler = () => {
      clearHierarchyHighlight(svg);
      if (onHover) onHover(li, false);
    };

    
    const enterCleanup = addEventListenerWithCleanup(
      node,
      "mouseenter",
      node.hierarchyEnterHandler
    );
    const leaveCleanup = addEventListenerWithCleanup(
      node,
      "mouseleave",
      node.hierarchyLeaveHandler
    );

    cleanupFunctions.push(enterCleanup, leaveCleanup);
  });

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

/**
 * Highlights the hierarchy path from root to target node
 */
function highlightHierarchyPath(targetLi, svg) {
  const parentsToHighlight = [];
  let currentElement = targetLi;

  
  while (currentElement && currentElement !== query(".hierarchy-list")) {
    if (currentElement.tagName === "LI") {
      parentsToHighlight.push(currentElement);
    }
    currentElement = currentElement.parentElement?.closest("li");
  }

  
  parentsToHighlight.forEach((li) => {
    const nodeContent = li.querySelector(":scope > .node-content");
    if (nodeContent) {
      addClass(nodeContent, EVENTS.HOVER_HIGHLIGHT_CLASS);
    }
  });

  
  const highlightedIds = parentsToHighlight.map((li) =>
    getAttribute(li, "data-id")
  );
  highlightConnectionPaths(svg, highlightedIds);
}

/**
 * Clears hierarchy highlighting
 */
function clearHierarchyHighlight(svg) {
  
  queryAll(`.node-content.${EVENTS.HOVER_HIGHLIGHT_CLASS}`).forEach((node) => {
    removeClass(node, EVENTS.HOVER_HIGHLIGHT_CLASS);
  });

  
  clearConnectionHighlight(svg);
}

/**
 * Gets all parent nodes for a given node
 */
export function getParentNodes(targetNode) {
  const parents = [];
  let currentElement = targetNode;

  while (currentElement && currentElement !== query(".hierarchy-list")) {
    if (currentElement.tagName === "LI") {
      parents.push(currentElement);
    }
    currentElement = currentElement.parentElement?.closest("li");
  }

  return parents;
}

/**
 * Checks if a node is expanded
 */
export function isNodeExpanded(node) {
  return getAttribute(node, EVENTS.FOLDER_EXPANDED_ATTRIBUTE) === "true";
}

/**
 * Expands or collapses a node
 */
export function setNodeExpanded(node, expanded, diagramContainer, svg) {
  setAttribute(node, EVENTS.FOLDER_EXPANDED_ATTRIBUTE, expanded.toString());

  const icon = node.querySelector(":scope > .node-content > svg");
  if (icon) {
    setAttribute(icon, EVENTS.FOLDER_EXPANDED_ATTRIBUTE, expanded.toString());
  }

  delay(() => drawConnectionLines(diagramContainer, svg), DRAWING.REDRAW_DELAY);
}

/**
 * Expands all nodes in the tree
 */
export function expandAllNodes(diagramContainer, svg) {
  queryAll(".hierarchy-list li.folder").forEach((folder) => {
    setNodeExpanded(folder, true, diagramContainer, svg);
  });
}

/**
 * Collapses all nodes in the tree
 */
export function collapseAllNodes(diagramContainer, svg) {
  queryAll(".hierarchy-list li.folder").forEach((folder) => {
    setNodeExpanded(folder, false, diagramContainer, svg);
  });
}
