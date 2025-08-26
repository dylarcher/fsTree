import { DRAWING } from "../shared/constants.js";
import {
  appendChild,
  clearInnerHTML,
  createSVGPath,
  getElementRect,
  getNodeColor,
  queryAll,
  setAttribute,
} from "../utils/docsModel.js";

/**
 * Core logic for drawing connection lines between tree nodes
 */

/**
 * Draws connecting lines between parent and child nodes in the tree
 */
export function drawConnectionLines(diagramContainer, svg) {
  
  clearInnerHTML(svg);

  
  setAttribute(svg, "width", diagramContainer.scrollWidth);
  setAttribute(svg, "height", diagramContainer.scrollHeight);

  const containerRect = getElementRect(diagramContainer);

  
  resetNodeStyles();

  
  queryAll(".hierarchy-list li").forEach((parentLi) => {
    const childUl = parentLi.querySelector(":scope > ul");
    const isExpanded = parentLi.getAttribute("aria-expanded") === "true";

    if (childUl && isExpanded) {
      drawParentChildConnections(parentLi, childUl, containerRect, svg);
    }
  });
}

/**
 * Resets node styles (transforms and branch colors)
 */
function resetNodeStyles() {
  
  const allListItems = queryAll(".hierarchy-list li");
  allListItems.forEach((li) => {
    li.style.removeProperty("--branch-color");
  });

  
  queryAll(".hierarchy-list .node-content").forEach((nodeContent) => {
    nodeContent.style.transform = "";
  });
}

/**
 * Draws connections between a parent node and its children
 */
function drawParentChildConnections(parentLi, childUl, containerRect, svg) {
  const parentContent = parentLi.querySelector(":scope > .node-content");
  const parentRect = getElementRect(parentContent);
  const pX = parentRect.right - containerRect.left;
  const pY = parentRect.top - containerRect.top + parentRect.height / 2;

  const childLis = childUl.querySelectorAll(":scope > li");
  const childCount = childLis.length;

  childLis.forEach((childLi, index) => {
    drawSingleConnection(
      childLi,
      index,
      childCount,
      pX,
      pY,
      containerRect,
      svg,
      parentLi
    );
  });
}

/**
 * Draws a single connection line from parent to child
 */
function drawSingleConnection(
  childLi,
  index,
  childCount,
  pX,
  pY,
  containerRect,
  svg,
  parentLi
) {
  const childColor = getNodeColor(childLi);
  childLi.style.setProperty("--branch-color", childColor);

  const childContent = childLi.querySelector(":scope > .node-content");
  const childRect = getElementRect(childContent);

  
  let xOffset = 0;
  if (childCount > 1) {
    xOffset = (childCount - 1 - index) * DRAWING.CHILD_OFFSET_MULTIPLIER;
  }

  
  const cX = childRect.left - containerRect.left - 6 + xOffset;
  const cY = childRect.top - containerRect.top + childRect.height / 2;

  
  if (xOffset > 0) {
    childContent.style.transform = `translateX(${xOffset}px)`;
  }

  
  const pathData = calculatePathData(pX, pY, cX, cY, xOffset);
  const path = createConnectionPath(pathData, childColor, parentLi, childLi);

  appendChild(svg, path);
}

/**
 * Calculates SVG path data for connecting two points
 */
function calculatePathData(pX, pY, cX, cY, xOffset) {
  const horizontalLength =
    DRAWING.HORIZONTAL_LENGTH + xOffset * DRAWING.HORIZONTAL_OFFSET_FACTOR;
  const cornerRadius = DRAWING.CORNER_RADIUS;
  const midX = pX + horizontalLength;

  
  if (Math.abs(pY - cY) <= cornerRadius * 2) {
    return `M ${pX} ${pY} L ${cX} ${cY}`;
  }

  const horizontalEnd = Math.min(midX + cornerRadius, cX);

  
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
}

/**
 * Creates an SVG path element for connection line
 */
function createConnectionPath(pathData, childColor, parentLi, childLi) {
  const isFolderToFolder =
    parentLi.classList.contains("folder") &&
    childLi.classList.contains("folder");

  const strokeColor = isFolderToFolder ? "slategray" : childColor;
  const strokeWidth = DRAWING.STROKE_WIDTH.toString();

  const additionalAttribs = {
    "data-parent-id": parentLi.getAttribute("data-id"),
    "data-child-id": childLi.getAttribute("data-id"),
  };

  if (isFolderToFolder) {
    additionalAttribs["stroke-dasharray"] = DRAWING.STROKE_DASHARRAY;
    additionalAttribs["stroke-opacity"] =
      DRAWING.FOLDER_STROKE_OPACITY.toString();
  }

  return createSVGPath(
    pathData,
    strokeColor,
    strokeWidth,
    "none",
    additionalAttribs
  );
}

/**
 * Gets all connection paths in the SVG
 */
export function getConnectionPaths(svg) {
  return svg.querySelectorAll("path");
}

/**
 * Highlights connection paths in a hierarchy chain
 */
export function highlightConnectionPaths(svg, highlightedIds) {
  getConnectionPaths(svg).forEach((path) => {
    const parentId = path.getAttribute("data-parent-id");
    const childId = path.getAttribute("data-child-id");

    const isParentInChain = highlightedIds.includes(parentId);
    const isChildInChain = highlightedIds.includes(childId);

    if (isParentInChain && isChildInChain) {
      path.style.strokeOpacity = "1";
      path.style.filter = "brightness(1.2) opacity(1)";
      path.style.strokeWidth = "1.2";
    }
  });
}

/**
 * Clears connection path highlighting
 */
export function clearConnectionHighlight(svg) {
  getConnectionPaths(svg).forEach((path) => {
    path.style.removeProperty("stroke-opacity");
    path.style.removeProperty("filter");
    path.style.removeProperty("stroke-width");
  });
}
