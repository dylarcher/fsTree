import { ICONS } from "../shared/constants.js";

/**
 * Service for generating HTML markup for file trees
 */

/**
 * Generates HTML markup for a single file tree node
 */
function generateNodeMarkup(node) {
  const {
    name,
    id,
    route,
    color,
    icon,
    isDirectory,
    isEmpty,
    children,
    level,
  } = node;

  if (isDirectory) {
    const emptyClass = isEmpty ? " empty-folder" : "";
    const childrenMarkup = children
      ? generateListMarkup(children, level + 1)
      : "";

    return `
		<li data-id="${id}" class="folder${emptyClass}" aria-expanded="true" data-route="${route}" data-color="${color}">
			<div class="node-content${emptyClass}">
				<svg class="icon icon-collapsed dir" aria-expanded="true" style="color: var(--color${color})">
					<use xlink:href="${ICONS.FOLDER}" />
				</svg>
				<svg class="icon icon-expanded dir" aria-expanded="true" style="color: var(--color${color})">
					<use xlink:href="${ICONS.DIR}" />
				</svg>
				<span style="color: var(--color${color})">${name}/</span>
			</div>
			${childrenMarkup}
		</li>`;
  } else {
    return `
		<li data-id="${id}" class="file" data-route="${route}" data-color="${color}">
			<div class="node-content">
				<svg class="icon" style="color: var(--color${color})">
					<use xlink:href="${icon}" />
				</svg>
				<span style="color: var(--color${color})">${name}</span>
			</div>
		</li>`;
  }
}

/**
 * Generates HTML markup for a list of nodes
 */
function generateListMarkup(nodes, level) {
  if (!nodes.length) {
    return "";
  }

  const itemsMarkup = nodes.map(generateNodeMarkup).join("");
  return `<ul class="hierarchy-list" data-level="${level}">${itemsMarkup}</ul>`;
}

/**
 * Generates complete HTML markup for a file tree
 */
export function generateTreeMarkup(rootNode) {
  if (!rootNode) {
    return "";
  }

  const { name, id, route, color, children } = rootNode;
  const childrenMarkup = children ? generateListMarkup(children, 1) : "";

  return `
	<ul class="hierarchy-list" data-level="0">
		<li data-id="${id}" class="folder" aria-expanded="true" data-route="${route}" data-color="${color}">
			<div class="node-content">
				<svg class="icon icon-collapsed dir" aria-expanded="true" style="color: var(--color${color})">
					<use xlink:href="${ICONS.FOLDER}" />
				</svg>
				<svg class="icon icon-expanded dir" aria-expanded="true" style="color: var(--color${color})">
					<use xlink:href="${ICONS.DIR}" />
				</svg>
				<span style="color: var(--color${color})">${name}/</span>
			</div>
			${childrenMarkup}
		</li>
	</ul>
	`;
}

/**
 * Generates markup for a subtree (used for dynamic loading)
 */
export function generateSubtreeMarkup(nodes, level = 0) {
  return generateListMarkup(nodes, level);
}

/**
 * Generates minimal markup structure (just structure, no styling)
 */
export function generateMinimalMarkup(rootNode) {
  function generateMinimalNode(node) {
    const { name, isDirectory, children } = node;

    if (isDirectory && children?.length) {
      const childrenMarkup = children.map(generateMinimalNode).join("");
      return `<li class="folder">${name}/<ul>${childrenMarkup}</ul></li>`;
    } else if (isDirectory) {
      return `<li class="folder">${name}/</li>`;
    } else {
      return `<li class="file">${name}</li>`;
    }
  }

  return `<ul>${generateMinimalNode(rootNode)}</ul>`;
}

/**
 * Generates markup with custom node renderer
 */
export function generateCustomMarkup(rootNode, nodeRenderer) {
  function generateWithRenderer(nodes, level) {
    if (!nodes?.length) return "";

    const itemsMarkup = nodes.map((node) => nodeRenderer(node, level)).join("");
    return `<ul class="hierarchy-list" data-level="${level}">${itemsMarkup}</ul>`;
  }

  const rootMarkup = nodeRenderer(rootNode, 0);
  const childrenMarkup = rootNode.children
    ? generateWithRenderer(rootNode.children, 1)
    : "";

  return `<ul class="hierarchy-list" data-level="0">${rootMarkup.replace("{{children}}", childrenMarkup)}</ul>`;
}
