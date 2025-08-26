import fs from "fs";
import path from "path";

// Function to parse .gitignore file
function parseGitignore(gitignorePath) {
	if (!fs.existsSync(gitignorePath)) {
		return [];
	}

	const content = fs.readFileSync(gitignorePath, "utf8");
	const patterns = content
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith("#"));

	return patterns;
}

// Function to check if a file/folder should be ignored
function shouldIgnore(filePath, rootDir, gitignorePatterns) {
	const relativePath = path.relative(rootDir, filePath);
	const fileName = path.basename(filePath);

	for (const pattern of gitignorePatterns) {
		// Handle patterns that start with .* (like .*tmp, .*test)
		if (pattern.startsWith(".*")) {
			let namePattern = pattern.substring(2);
			// Handle escaped characters (.*\tmp becomes .tmp)
			namePattern = namePattern.replace(/\\(.)/g, "$1");
			const targetName = "." + namePattern;
			if (fileName === targetName) {
				return true;
			}
		}
		// Handle simple name matching (like test)
		else if (fileName.includes(pattern.replace(/\*/g, ""))) {
			return true;
		}
		// Handle path matching
		else if (relativePath.includes(pattern.replace(/\*/g, ""))) {
			return true;
		}
	}
	return false;
}

// Available color hues from CSS variables
const colorHues = [
	"Blue",
	"Cyan",
	"Green",
	"Orange",
	"Pink",
	"Purple",
	"Red",
	"Yellow",
	"Gold",
	"Maroon",
	"Olive",
	"Slate",
	"Violet",
	"Gray",
];

// Function to get a unique color for a file based on its position in directory
function getColorForFile(fileName, fileIndex, totalFiles) {
	// Ensure we cycle through colors if we have more files than colors
	const colorIndex = fileIndex % colorHues.length;
	return colorHues[colorIndex];
}

function getIconForFile(fileName) {
	const ext = path.extname(fileName).substring(1);
	const baseName = path
		.basename(fileName, path.extname(fileName))
		.toLowerCase();

	// Special files first
	if (baseName === "package" && ext === "json") {
		return "#_iconCog";
	}
	if (
		baseName === "readme" ||
		baseName === "changelog" ||
		baseName === "license"
	) {
		return "#_iconDocs";
	}
	if (baseName.includes("config") || baseName.includes("settings")) {
		return "#_iconCog";
	}

	// File extension mapping
	switch (ext) {
		case "html":
		case "htm":
			return "#_iconLink";
		case "css":
		case "scss":
		case "sass":
		case "less":
		case "stylus":
			return "#_iconStyle";
		case "js":
		case "ts":
		case "jsx":
		case "tsx":
		case "mjs":
		case "cjs":
			return "#_iconScript";
		case "json":
		case "config":
		case "conf":
		case "ini":
		case "yaml":
		case "yml":
		case "toml":
		case "env":
		case "gitignore":
		case "gitconfig":
		case "npmrc":
		case "babelrc":
		case "eslintrc":
		case "prettierrc":
			return "#_iconCog";
		case "md":
		case "txt":
		case "readme":
		case "rst":
		case "doc":
		case "docx":
		case "pdf":
			return "#_iconDocs";
		case "svg":
		case "ico":
			return "#_iconVector";
		case "png":
		case "jpg":
		case "jpeg":
		case "gif":
		case "webp":
		case "avif":
		case "bmp":
		case "tiff":
		case "heic":
		case "heif":
			return "#_iconPhoto";
		case "mp4":
		case "avi":
		case "mkv":
		case "webm":
		case "mov":
		case "wmv":
		case "flv":
		case "m4v":
			return "#_iconVideo";
		case "mp3":
		case "wav":
		case "flac":
		case "aac":
		case "ogg":
		case "wma":
		case "m4a":
			return "#_iconAudio";
		case "zip":
		case "rar":
		case "7z":
		case "tar":
		case "gz":
		case "bz2":
		case "xz":
			return "#_iconArchive";
		case "sql":
		case "db":
		case "sqlite":
		case "sqlite3":
		case "mdb":
		case "accdb":
			return "#_iconDatabase";
		case "csv":
		case "tsv":
		case "xlsx":
		case "xls":
		case "ods":
			return "#_iconChart";
		case "key":
		case "pem":
		case "p12":
		case "pfx":
		case "cert":
		case "crt":
		case "der":
			return "#_iconLock";
		default:
			return "#_iconFile";
	}
}

function generateList(dir, level = 0, rootDir = dir, gitignoreRules = []) {
	const files = fs.readdirSync(dir);
	let html = `<ul class="hierarchy-list" data-level="${level}">`;

	// Filter out ignored files
	const filteredFiles = files.filter((file) => {
		const fullPath = path.join(dir, file);
		return !shouldIgnore(fullPath, rootDir, gitignoreRules);
	});

	// Sort files for consistent color assignment
	filteredFiles.sort();

	for (let i = 0; i < filteredFiles.length; i++) {
		const file = filteredFiles[i];
		const fullPath = path.join(dir, file);
		const stats = fs.statSync(fullPath);
		const fileColor = getColorForFile(file, i, filteredFiles.length);

		if (stats.isDirectory()) {
			// Check if folder has any non-ignored contents
			const folderContents = fs.readdirSync(fullPath);
			const nonIgnoredContents = folderContents.filter((subFile) => {
				const subPath = path.join(fullPath, subFile);
				return !shouldIgnore(subPath, rootDir, gitignoreRules);
			});
			const isEmpty = nonIgnoredContents.length === 0;
			const emptyClass = isEmpty ? " empty-folder" : "";

			html += `
		<li data-id="${file.replace(/\./g, "-")}" class="folder${emptyClass}" aria-expanded="true" data-route="${file}/" data-color="${fileColor}">
		  <div class="node-content${emptyClass}">
			<svg class="icon icon-collapsed dir" aria-expanded="true" style="color: var(--color${fileColor})"><use xlink:href="#_iconFolder" /></svg>
			<svg class="icon icon-expanded dir" aria-expanded="true" style="color: var(--color${fileColor})"><use xlink:href="#_iconDir" /></svg>
			<span style="color: var(--color${fileColor})">${file}/</span>
		  </div>
		  ${generateList(fullPath, level + 1, rootDir, gitignoreRules)}
		</li>`;
		} else {
			html += `
		<li data-id="${file.replace(/\./g, "-")}" class="file" data-route="${file}" data-color="${fileColor}">
		  <div class="node-content">
			<svg class="icon" style="color: var(--color${fileColor})"><use xlink:href="${getIconForFile(file)}" /></svg>
			<span style="color: var(--color${fileColor})">${file}</span>
		  </div>
		</li>`;
		}
	}

	html += "</ul>";
	return html;
}
export function generateMarkup(rootDir) {
	// Get the mapesm project directory (where this script is running from)
	const mapesmDir = path.resolve(
		path.dirname(import.meta.url.replace("file://", "")),
		"../../",
	);

	// Combine gitignore rules from both mapesm project and target project
	const mapesmGitignoreRules = parseGitignore(
		path.join(mapesmDir, ".gitignore"),
	);
	const projectGitignoreRules = parseGitignore(
		path.join(rootDir, ".gitignore"),
	);
	const allGitignoreRules = [
		...mapesmGitignoreRules,
		...projectGitignoreRules,
	];

	const rootName = path.basename(rootDir);
	const rootColor = getColorForFile(rootName, 0, 1);
	return `
	<ul class="hierarchy-list" data-level="0">
		<li data-id="root" class="folder" aria-expanded="true" data-route="root/" data-color="${rootColor}">
			<div class="node-content">
				<svg class="icon icon-collapsed dir" aria-expanded="true" style="color: var(--color${rootColor})"><use xlink:href="#_iconFolder" /></svg>
				<svg class="icon icon-expanded dir" aria-expanded="true" style="color: var(--color${rootColor})"><use xlink:href="#_iconDir" /></svg>
				<span style="color: var(--color${rootColor})">${rootName}/</span>
			</div>
			${generateList(rootDir, 1, rootDir, allGitignoreRules)}
		</li>
	</ul>
	`;
}
