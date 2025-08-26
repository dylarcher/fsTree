import {
  COLOR_HUES,
  CONFIG_PATTERNS,
  FILE_EXTENSIONS,
  ICONS,
  SPECIAL_FILES,
} from "../shared/constants.js";
import {
  getBasename,
  getBasenameWithoutExtension,
  getExtension,
  getFilteredFiles,
  isDirectory,
  joinPath,
  sortFiles,
} from "../utils/fileSystem.js";

/**
 * Core business logic for building file tree structures
 */

/**
 * Gets a unique color for a file based on its position in directory
 */
export function getColorForFile(fileName, fileIndex, totalFiles) {
  
  const colorIndex = fileIndex % COLOR_HUES.length;
  return COLOR_HUES[colorIndex];
}

/**
 * Determines the appropriate icon for a file based on its name and extension
 */
export function getIconForFile(fileName) {
  const ext = getExtension(fileName).substring(1); 
  const baseName = getBasenameWithoutExtension(fileName).toLowerCase();

  
  for (const [specialName, config] of Object.entries(SPECIAL_FILES)) {
    if (
      baseName === specialName &&
      (config.extensions.includes(ext) || config.extensions.includes(""))
    ) {
      return config.icon;
    }
  }

  
  if (CONFIG_PATTERNS.some((pattern) => baseName.includes(pattern))) {
    return ICONS.COG;
  }

  
  if (FILE_EXTENSIONS[ext]) {
    return FILE_EXTENSIONS[ext];
  }

  
  return ICONS.FILE;
}

/**
 * Builds a file tree structure recursively
 */
export function buildFileTree(
  dirPath,
  level = 0,
  rootDir = dirPath,
  shouldIgnoreFunc = () => false
) {
  const files = getFilteredFiles(dirPath, shouldIgnoreFunc, rootDir);
  const sortedFiles = sortFiles(files);

  return sortedFiles.map((file, index) => {
    const fullPath = joinPath(dirPath, file);
    const color = getColorForFile(file, index, sortedFiles.length);
    const icon = getIconForFile(file);
    const isDir = isDirectory(fullPath);

    const node = {
      name: file,
      path: fullPath,
      relativePath: fullPath.replace(rootDir + "/", ""),
      level,
      color,
      icon,
      isDirectory: isDir,
      route: isDir ? `${file}/` : file,
      id: file.replace(/\./g, "-"),
    };

    
    if (isDir) {
      const children = buildFileTree(
        fullPath,
        level + 1,
        rootDir,
        shouldIgnoreFunc
      );
      node.children = children;
      node.isEmpty = children.length === 0;
    }

    return node;
  });
}

/**
 * Creates the root node for a file tree
 */
export function createRootNode(rootDir, shouldIgnoreFunc = () => false) {
  const rootName = getBasename(rootDir);
  const rootColor = getColorForFile(rootName, 0, 1);
  const children = buildFileTree(rootDir, 1, rootDir, shouldIgnoreFunc);

  return {
    name: rootName,
    path: rootDir,
    relativePath: "",
    level: 0,
    color: rootColor,
    icon: ICONS.FOLDER,
    isDirectory: true,
    route: "root/",
    id: "root",
    children,
    isEmpty: children.length === 0,
  };
}

/**
 * Flattens a file tree into a linear array
 */
export function flattenFileTree(tree) {
  const result = [];

  function traverse(nodes) {
    for (const node of nodes) {
      result.push(node);
      if (node.children) {
        traverse(node.children);
      }
    }
  }

  if (Array.isArray(tree)) {
    traverse(tree);
  } else {
    result.push(tree);
    if (tree.children) {
      traverse(tree.children);
    }
  }

  return result;
}

/**
 * Filters file tree nodes based on a predicate
 */
export function filterFileTree(tree, predicate) {
  function filter(nodes) {
    return nodes.filter(predicate).map((node) => ({
      ...node,
      children: node.children ? filter(node.children) : undefined,
    }));
  }

  if (Array.isArray(tree)) {
    return filter(tree);
  } else {
    const result = { ...tree };
    if (tree.children) {
      result.children = filter(tree.children);
    }
    return predicate(tree) ? result : null;
  }
}

/**
 * Counts total nodes in a file tree
 */
export function countNodes(tree) {
  let count = 0;

  function traverse(nodes) {
    for (const node of nodes) {
      count++;
      if (node.children) {
        traverse(node.children);
      }
    }
  }

  if (Array.isArray(tree)) {
    traverse(tree);
  } else {
    count = 1;
    if (tree.children) {
      traverse(tree.children);
    }
  }

  return count;
}
