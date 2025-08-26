#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { generateCompletePage } from "../src/index.js";

function removeComments(content, type) {
  switch (type) {
    case "html":
      return content.replace(/<!--[\s\S]*?-->/g, "");
    case "css":
      return content.replace(/\/\*[\s\S]*?\*\//g, "");
    case "js":
      content = content.replace(/\/\/.*$/gm, "");
      content = content.replace(/\/\*[\s\S]*?\*\//g, "");
      return content;
    case "svg":
      return content.replace(/<!--[\s\S]*?-->/g, "");
    default:
      return content;
  }
}

const [, , projectPath] = process.argv;

if (!projectPath) {
  console.error("Please provide a relative path to the project workspace.");
  process.exit(1);
}

const rootDir = path.resolve(process.cwd(), projectPath);

if (!fs.existsSync(rootDir)) {
  console.error(`Error: Path '${rootDir}' does not exist.`);
  process.exit(1);
}

const stats = fs.statSync(rootDir);
if (!stats.isDirectory()) {
  console.error(`Error: '${rootDir}' is not a directory.`);
  console.error(
    `This tool generates file hierarchy diagrams for directories, not individual files.`
  );
  console.error(`Did you mean to run: mapesm ${path.dirname(projectPath)} ?`);
  process.exit(1);
}

const _cwd = process.cwd();
const outputDir = path.resolve(
  _cwd,
  `.tmp/demo-${_cwd.split(path.sep).pop()}__${new Date()
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/-/g, "")}`.trim()
);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  const title = `Project File Structure for ${path.basename(rootDir)}`;
  const htmlContent = removeComments(
    generateCompletePage(rootDir, { title }),
    "html"
  );

  fs.writeFileSync(path.join(outputDir, "index.html"), htmlContent);

  console.log("File hierarchy diagram generated successfully in .tmp/**!");
} catch (error) {
  console.error("Error generating file hierarchy diagram:", error);
}
