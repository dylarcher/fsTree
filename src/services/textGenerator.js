/**
 * Service for generating text-based tree representations
 */

/**
 * Generates a text-based tree structure
 * @param {Object} rootNode - The root node of the tree
 * @param {Object} options - Configuration options
 * @returns {string} - Text representation of the tree
 */
export function generateTextTree(rootNode, options = {}) {
  if (!rootNode) {
    return "";
  }

  const lines = [];

  // Add the root node name
  lines.push(rootNode.name);

  if (rootNode.children && rootNode.children.length > 0) {
    generateTextTreeRecursive(rootNode.children, "", true, lines);
  }

  return lines.join("\n");
}

/**
 * Recursively generates text tree structure
 * @param {Array} nodes - Array of nodes to process
 * @param {string} prefix - Current prefix for indentation
 * @param {boolean} isRoot - Whether this is the root level
 * @param {Array} lines - Array to collect output lines
 */
function generateTextTreeRecursive(nodes, prefix, isRoot, lines) {
  if (!nodes || nodes.length === 0) return;

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const displayName = node.isDirectory ? `${node.name}/` : node.name;

    lines.push(prefix + connector + displayName);

    if (node.children && node.children.length > 0) {
      const childPrefix = prefix + (isLast ? "    " : "│   ");
      generateTextTreeRecursive(node.children, childPrefix, false, lines);
    }
  });
}

/**
 * Generates a simplified text tree (minimal output)
 * @param {Object} rootNode - The root node of the tree
 * @returns {string} - Minimal text representation
 */
export function generateMinimalTextTree(rootNode) {
  if (!rootNode) {
    return "";
  }

  const lines = [];

  function processNode(node, level = 0) {
    const indent = "  ".repeat(level);
    const displayName = node.isDirectory ? `${node.name}/` : node.name;
    lines.push(indent + displayName);

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => processNode(child, level + 1));
    }
  }

  processNode(rootNode);
  return lines.join("\n");
}

/**
 * Generates tree with custom formatting options
 * @param {Object} rootNode - The root node of the tree
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted text representation
 */
export function generateFormattedTextTree(rootNode, options = {}) {
  const {
    showExtensions = true,
    maxDepth = Infinity,
    sortAlphabetically = false,
    includeHidden = true,
  } = options;

  if (!rootNode) {
    return "";
  }

  const lines = [];
  lines.push(rootNode.name);

  if (rootNode.children && rootNode.children.length > 0) {
    let processedChildren = rootNode.children;

    if (!includeHidden) {
      processedChildren = processedChildren.filter(
        (child) => !child.name.startsWith(".")
      );
    }

    if (sortAlphabetically) {
      processedChildren = [...processedChildren].sort((a, b) => {
        // Directories first, then files, both alphabetically
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    }

    generateFormattedTreeRecursive(
      processedChildren,
      "",
      true,
      lines,
      1,
      maxDepth,
      showExtensions
    );
  }

  return lines.join("\n");
}

function generateFormattedTreeRecursive(
  nodes,
  prefix,
  isRoot,
  lines,
  depth,
  maxDepth,
  showExtensions
) {
  if (!nodes || nodes.length === 0 || depth > maxDepth) return;

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const connector = isLast ? "└── " : "├── ";

    let displayName = node.name;
    if (node.isDirectory) {
      displayName += "/";
    } else if (!showExtensions) {
      const lastDot = displayName.lastIndexOf(".");
      if (lastDot > 0) {
        displayName = displayName.substring(0, lastDot);
      }
    }

    lines.push(prefix + connector + displayName);

    if (node.children && node.children.length > 0 && depth < maxDepth) {
      const childPrefix = prefix + (isLast ? "    " : "│   ");
      generateFormattedTreeRecursive(
        node.children,
        childPrefix,
        false,
        lines,
        depth + 1,
        maxDepth,
        showExtensions
      );
    }
  });
}
