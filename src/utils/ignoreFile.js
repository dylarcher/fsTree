import path from "path";
import {
  getBasename,
  getRelativePath,
  pathExists,
  readFileContent,
} from "./fileSystem.js";

/**
 * Utilities for handling .gitignore file parsing and pattern matching
 */

/**
 * Parses .gitignore file and returns array of patterns
 */
export function parseGitignore(gitignorePath) {
  if (!pathExists(gitignorePath)) {
    return [];
  }

  const content = readFileContent(gitignorePath);
  const patterns = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  return patterns;
}

/**
 * Checks if a file/folder should be ignored based on gitignore patterns
 */
export function shouldIgnore(filePath, rootDir, gitignorePatterns = []) {
  if (!gitignorePatterns.length) {
    return false;
  }

  const relativePath = getRelativePath(filePath, rootDir);
  const fileName = getBasename(filePath);

  for (const pattern of gitignorePatterns) {
    if (matchesPattern(pattern, fileName, relativePath)) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a filename or path matches a gitignore pattern
 */
function matchesPattern(pattern, fileName, relativePath) {
  if (pattern.startsWith(".*")) {
    let namePattern = pattern.substring(2);
    namePattern = namePattern.replace(/\\(.)/g, "$1");
    const targetName = "." + namePattern;
    if (fileName === targetName) {
      return true;
    }
  } else if (fileName.includes(pattern.replace(/\*/g, ""))) {
    return true;
  } else if (relativePath.includes(pattern.replace(/\*/g, ""))) {
    return true;
  }

  return false;
}

/**
 * Combines multiple gitignore pattern arrays
 */
export function combineGitignorePatterns(...patternArrays) {
  return patternArrays.flat();
}

/**
 * Gets gitignore patterns from both mapesm project and target project
 */
export function getAllGitignorePatterns(mapesmDir, projectDir) {
  const mapesmGitignoreRules = parseGitignore(
    path.join(mapesmDir, ".gitignore")
  );
  const projectGitignoreRules = parseGitignore(
    path.join(projectDir, ".gitignore")
  );

  return combineGitignorePatterns(mapesmGitignoreRules, projectGitignoreRules);
}

/**
 * Creates a shouldIgnore function with pre-bound patterns
 */
export function createIgnoreFilter(gitignorePatterns) {
  return (filePath, rootDir) =>
    shouldIgnore(filePath, rootDir, gitignorePatterns);
}
