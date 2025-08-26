import fs from "fs";
import path from "path";

/**
 * File system utilities for directory traversal and file operations
 */

/**
 * Checks if a path exists
 */
export function pathExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Reads directory contents
 */
export function readDirectory(dirPath) {
  try {
    return fs.readdirSync(dirPath);
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

/**
 * Gets file/directory stats
 */
export function getStats(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (error) {
    console.error(`Error getting stats for ${filePath}:`, error);
    return null;
  }
}

/**
 * Reads file content as UTF-8 string
 */
export function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return "";
  }
}

/**
 * Gets the relative path from root directory
 */
export function getRelativePath(filePath, rootDir) {
  return path.relative(rootDir, filePath);
}

/**
 * Joins path segments
 */
export function joinPath(...segments) {
  return path.join(...segments);
}

/**
 * Gets the basename of a path
 */
export function getBasename(filePath) {
  return path.basename(filePath);
}

/**
 * Gets the file extension (with dot)
 */
export function getExtension(filePath) {
  return path.extname(filePath);
}

/**
 * Gets the basename without extension
 */
export function getBasenameWithoutExtension(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Gets the directory name of a path
 */
export function getDirname(filePath) {
  return path.dirname(filePath);
}

/**
 * Resolves a path to an absolute path
 */
export function resolvePath(...segments) {
  return path.resolve(...segments);
}

/**
 * Normalizes a path
 */
export function normalizePath(filePath) {
  return path.normalize(filePath);
}

/**
 * Checks if a path is a directory
 */
export function isDirectory(filePath) {
  const stats = getStats(filePath);
  return stats ? stats.isDirectory() : false;
}

/**
 * Checks if a path is a file
 */
export function isFile(filePath) {
  const stats = getStats(filePath);
  return stats ? stats.isFile() : false;
}

/**
 * Filters files based on a predicate function
 */
export function filterFiles(files, predicate) {
  return files.filter(predicate);
}

/**
 * Sorts files alphabetically
 */
export function sortFiles(files) {
  return [...files].sort();
}

/**
 * Gets all files in a directory that are not ignored
 */
export function getFilteredFiles(dirPath, shouldIgnoreFunc, rootDir) {
  const files = readDirectory(dirPath);
  return filterFiles(files, (file) => {
    const fullPath = joinPath(dirPath, file);
    return !shouldIgnoreFunc(fullPath, rootDir);
  });
}
