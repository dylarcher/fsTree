import { DRAWING } from "../shared/constants.js";

/**
 * Service for generating JavaScript code for file tree interactions
 */

/**
 * Generates the core tree functionality script
 */
export function generateTreeScript() {
  return `
/**
 * Service for generating JavaScript code for file tree interactions
 */

import {
	setupEventListeners as staticSetupEventListeners,
	drawConnectionLines as staticDrawConnectionLines,
} from "../core/eventManagment.js";
import { drawConnectionLines } from "../core/pathCoordinator.js";

document.addEventListener("DOMContentLoaded", () => {
	const diagramContainer = document.getElementById("diagram-container");
	const svg = document.getElementById("svg-container");

	drawConnectionLines(diagramContainer, svg);

	const cleanup = setupEventListeners(diagramContainer, svg);

	window.addEventListener("beforeunload", cleanup);
});
	`;
}

/**
 * Generates inline JavaScript for standalone HTML
 */
export function generateInlineScript() {
  return `
document.addEventListener("DOMContentLoaded", () => {
	const diagramContainer = document.getElementById("diagram-container");
	const svg = document.getElementById("svg-container");

	function drawLines() {
		setTimeout(() => {
			svg.innerHTML = "";
			svg.setAttribute("width", diagramContainer.scrollWidth);
			svg.setAttribute("height", diagramContainer.scrollHeight);

			const containerRect = diagramContainer.getBoundingClientRect();
			function getNodeColor(nodeElement) {
				const computedStyle = window.getComputedStyle(nodeElement);
				return computedStyle.color;
			}

			const allListItems = document.querySelectorAll(".hierarchy-list li");
			allListItems.forEach((li) => {
				li.style.removeProperty("--branch-color");
			});

			document.querySelectorAll(".hierarchy-list li").forEach((parentLi) => {
				const childUl = parentLi.querySelector(":scope > ul");
				const isExpanded = parentLi.getAttribute("aria-expanded") === "true";
				if (childUl && isExpanded) {
					const parentContent = parentLi.querySelector(
						":scope > .node-content"
					);
					const parentRect = parentContent.getBoundingClientRect();
					const pX = parentRect.right - containerRect.left;
					const pY = parentRect.top - containerRect.top + parentRect.height / 2;
					const childLis = childUl.querySelectorAll(":scope > li");
					const childCount = childLis.length;

					childLis.forEach((childLi, index) => {
						const childColor = getNodeColor(childLi);
						childLi.style.setProperty("--branch-color", childColor);

						const childContent = childLi.querySelector(
							":scope > .node-content"
						);
						const childRect = childContent.getBoundingClientRect();
						let xOffset = 0;
						if (childCount > 1) {
							xOffset = (childCount - 1 - index) * ${DRAWING.CHILD_OFFSET_MULTIPLIER};
						}

						let cX, cY;
						cX = childRect.left - containerRect.left - 6 + xOffset;
						cY = childRect.top - containerRect.top + childRect.height / 2;

						const horizontalLength = ${DRAWING.HORIZONTAL_LENGTH} + xOffset * ${DRAWING.HORIZONTAL_OFFSET_FACTOR};
						const cornerRadius = ${DRAWING.CORNER_RADIUS};
						const midX = pX + horizontalLength;

						let d;
						if (Math.abs(pY - cY) <= cornerRadius * 2) {
							d = \`M \${pX} \${pY} L \${cX} \${cY}\`;
						} else if (pY < cY) {
							const horizontalEnd = Math.min(midX + cornerRadius, cX);
							d = \`
								M \${pX} \${pY}
								L \${midX - cornerRadius} \${pY}
								Q \${midX} \${pY} \${midX} \${pY + cornerRadius}
								L \${midX} \${cY - cornerRadius}
								Q \${midX} \${cY} \${horizontalEnd} \${cY}
								L \${cX} \${cY}
							\`;
						} else {
							const horizontalEnd = Math.min(midX + cornerRadius, cX);
							d = \`
								M \${pX} \${pY}
								L \${midX - cornerRadius} \${pY}
								Q \${midX} \${pY} \${midX} \${pY - cornerRadius}
								L \${midX} \${cY + cornerRadius}
								Q \${midX} \${cY} \${horizontalEnd} \${cY}
								L \${cX} \${cY}
							\`;
						}
						const path = document.createElementNS(
							"http://www.w3.org/2000/svg",
							"path"
						);
						path.setAttribute("d", d);
						const isFolderToFolder =
							parentLi.classList.contains("folder") &&
							childLi.classList.contains("folder");

						if (isFolderToFolder) {
							path.setAttribute("stroke", "slategray");
							path.setAttribute("stroke-dasharray", "${DRAWING.STROKE_DASHARRAY}");
							path.setAttribute("stroke-opacity", "${DRAWING.FOLDER_STROKE_OPACITY}");
						} else {
							path.setAttribute("stroke", childColor);
						}

						path.setAttribute("stroke-width", "${DRAWING.STROKE_WIDTH}");
						path.setAttribute("fill", "none");

						path.setAttribute(
							"data-parent-id",
							parentLi.getAttribute("data-id")
						);
						path.setAttribute(
							"data-child-id",
							childLi.getAttribute("data-id")
						);

						svg.appendChild(path);
					});
				}
			});

			addHoverListeners();
		}, ${DRAWING.REDRAW_DELAY});
	}

	function updateAriaExpanded() {
		const allFolders = document.querySelectorAll(".hierarchy-list li.folder");
		allFolders.forEach((folder) => {
			const icon = folder.querySelector(":scope > .node-content > svg");
			const isExpanded = folder.getAttribute("aria-expanded") !== "false";
			folder.setAttribute("aria-expanded", isExpanded.toString());
			if (icon) {
				icon.setAttribute("aria-expanded", isExpanded.toString());
			}
		});
	}

	function toggleNode(event) {
		const targetLi = event.currentTarget.closest("li");

		if (targetLi && targetLi.classList.contains("folder")) {
			const childUl = targetLi.querySelector(":scope > ul");
			if (childUl && childUl.children.length === 0) {
				event.stopPropagation();
				event.preventDefault();
				return;
			}

			const isCurrentlyExpanded =
				targetLi.getAttribute("aria-expanded") !== "false";
			const newExpandedState = !isCurrentlyExpanded;

			targetLi.setAttribute("aria-expanded", newExpandedState.toString());
			const icon = targetLi.querySelector(":scope > .node-content > svg");
			if (icon) {
				icon.setAttribute("aria-expanded", newExpandedState.toString());
			}
			drawLines();
		}
	}

	updateAriaExpanded();
	document.querySelectorAll(".node-content").forEach((node) => {
		if (!node.classList.contains('empty-folder')) {
			node.addEventListener("click", toggleNode);
		}
	});

	function highlightHierarchyPath(targetLi) {
		const parentsToHighlight = [];
		let currentElement = targetLi;

		while (
			currentElement &&
			currentElement !== document.querySelector(".hierarchy-list")
		) {
			if (currentElement.tagName === "LI") {
				parentsToHighlight.push(currentElement);
			}
			currentElement = currentElement.parentElement?.closest("li");
		}

		parentsToHighlight.forEach((li) => {
			const nodeContent = li.querySelector(":scope > .node-content");
			if (nodeContent) {
				nodeContent.classList.add("hierarchy-highlight");
			}
		});

		const highlightedIds = parentsToHighlight.map((li) =>
			li.getAttribute("data-id")
		);

		svg.querySelectorAll("path").forEach((path) => {
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

	function clearHierarchyHighlight() {
		document
			.querySelectorAll(".node-content.hierarchy-highlight")
			.forEach((node) => {
				node.classList.remove("hierarchy-highlight");
			});

		svg.querySelectorAll("path").forEach((path) => {
			path.style.removeProperty("stroke-opacity");
			path.style.removeProperty("filter");
			path.style.removeProperty("stroke-width");
		});
	}

	function addHoverListeners() {
		document.querySelectorAll(".node-content").forEach((node) => {
			const li = node.closest("li");

			node.removeEventListener("mouseenter", node.hierarchyEnterHandler);
			node.removeEventListener("mouseleave", node.hierarchyLeaveHandler);

			node.hierarchyEnterHandler = () => highlightHierarchyPath(li);
			node.hierarchyLeaveHandler = () => clearHierarchyHighlight();

			node.addEventListener("mouseenter", node.hierarchyEnterHandler);
			node.addEventListener("mouseleave", node.hierarchyLeaveHandler);
		});
	}

	addHoverListeners();
	drawLines();
	window.addEventListener("resize", drawLines);
});
	`;
}

/**
 * Generates a minimal script with just basic functionality
 */
export function generateMinimalScript() {
  return `
document.addEventListener("DOMContentLoaded", () => {
	function toggleNode(event) {
		const targetLi = event.currentTarget.closest("li");
		if (targetLi && targetLi.classList.contains("folder")) {
			const childUl = targetLi.querySelector(":scope > ul");
			if (childUl && childUl.children.length === 0) return;

			const isExpanded = targetLi.getAttribute("aria-expanded") !== "false";
			targetLi.setAttribute("aria-expanded", (!isExpanded).toString());
		}
	}

	document.querySelectorAll(".node-content").forEach((node) => {
		if (!node.classList.contains('empty-folder')) {
			node.addEventListener("click", toggleNode);
		}
	});
});
	`;
}

/**
 * Generates script for specific features
 */
export function generateFeatureScript(features = []) {
  let script = `
document.addEventListener("DOMContentLoaded", () => {
	const diagramContainer = document.getElementById("diagram-container");
	const svg = document.getElementById("svg-container");
	`;

  if (features.includes("lines")) {
    script += `
	function drawLines() {
	}
		`;
  }

  if (features.includes("toggle")) {
    script += `
	function toggleNode(event) {
	}
		`;
  }

  if (features.includes("hover")) {
    script += `
	function highlightHierarchyPath(targetLi) {
	}
		`;
  }

  script += `
});
	`;

  return script;
}

/**
 * Generates async script loader
 */
export function generateAsyncScript() {
  return `
    (async function() {
      const { setupEventListeners } = await import('./core/eventManagment.js');
      const { drawConnectionLines } = await import('./core/pathCoordinator.js');

      document.addEventListener("DOMContentLoaded", () => {
        const diagramContainer = document.getElementById("diagram-container");
        const svg = document.getElementById("svg-container");

        drawConnectionLines(diagramContainer, svg);
        setupEventListeners(diagramContainer, svg);
      });
    })();
	`;
}
