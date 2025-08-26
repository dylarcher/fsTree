#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { generateMarkup } from "../src/generate/markup.js";
import { generateScript } from "../src/generate/script.js";
import { generateStyles } from "../src/generate/styles.js";

// Function to remove comments from different file types
function removeComments(content, type) {
	switch (type) {
		case "html":
			// Remove HTML comments: <!-- ... -->
			return content.replace(/<!--[\s\S]*?-->/g, "");
		case "css":
			// Remove CSS comments: /* ... */
			return content.replace(/\/\*[\s\S]*?\*\//g, "");
		case "js":
			// Remove single-line comments: // ...
			content = content.replace(/\/\/.*$/gm, "");
			// Remove multi-line comments: /* ... */
			content = content.replace(/\/\*[\s\S]*?\*\//g, "");
			return content;
		case "svg":
			// Remove HTML-style comments from SVG
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
		`This tool generates file hierarchy diagrams for directories, not individual files.`,
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
		.replace(/-/g, "")}`.trim(),
);

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

try {
	const iconsPath = path.resolve(
		path.dirname(import.meta.url.replace("file://", "")),
		"../res/sprite.svg",
	);
	const iconsContent = removeComments(
		fs.readFileSync(iconsPath, "utf8"),
		"svg",
	);

	const hierarchy = generateMarkup(rootDir);
	const htmlContent = removeComments(
		`
		<!DOCTYPE html>
		<html lang="en" dir="auto">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>File Hierarchy Diagram</title>
				<script src="https://d3js.org/d3.v7.min.js"></script>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
					rel="stylesheet"
				/>
				<link rel="stylesheet" href="styles.css" />
			</head>
			<body class="main-body">
				${iconsContent}
				<div class="container">
					<h1 class="main-title">
						Project File Structure for ${path.basename(rootDir)}
					</h1>
					<div id="diagram-container" class="diagram-container">
						<svg id="svg-container"></svg>
						${hierarchy}
					</div>
				</div>

				<div
					id="dependency-modal"
					class="modal-overlay hidden"
				>
					<div class="modal-content">
						<div class="modal-wrapper">
							<div class="modal-header">
								<div class="modal-header-content">
									<h2
										id="dependency-title"
										class="modal-title"
									>
										Dependencies
									</h2>
									<button
										id="close-dependency-modal"
										class="modal-close-btn"
									>
										&times;
									</button>
								</div>
							</div>

							<div id="dependency-container" class="modal-body">
								<div
									id="dependency-tree"
									class="dependency-tree-container"
								></div>
							</div>
						</div>
					</div>
				</div>
				<script src="main.js" type="module"></script>
			</body>
		</html>
`,
		"html",
	);

	fs.writeFileSync(path.join(outputDir, "index.html"), htmlContent);
	fs.writeFileSync(
		path.join(outputDir, "styles.css"),
		removeComments(generateStyles(), "css"),
	);
	fs.writeFileSync(
		path.join(outputDir, "main.js"),
		removeComments(generateScript(), "js"),
	);

	console.log("File hierarchy diagram generated successfully in .tmp/**!");
} catch (error) {
	console.error("Error generating file hierarchy diagram:", error);
}
