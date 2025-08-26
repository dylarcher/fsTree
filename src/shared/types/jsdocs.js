/**
 * Type definitions and interfaces for the file tree system
 */

/**
 * @typedef {Object} TreeNode
 * @property {string} name - The file/directory name
 * @property {string} path - The absolute path
 * @property {string} relativePath - Path relative to root
 * @property {number} level - Nesting level in the tree
 * @property {string} color - Color identifier for styling
 * @property {string} icon - SVG icon reference
 * @property {boolean} isDirectory - Whether this is a directory
 * @property {string} route - Route identifier for navigation
 * @property {string} id - Unique identifier (sanitized name)
 * @property {TreeNode[]|undefined} children - Child nodes (for directories)
 * @property {boolean|undefined} isEmpty - Whether directory is empty
 */

/**
 * @typedef {Object} DrawingConfig
 * @property {number} cornerRadius - Radius for path corner curves
 * @property {number} horizontalLength - Base horizontal line length
 * @property {number} strokeWidth - Line stroke width
 * @property {number} folderStrokeOpacity - Opacity for folder-to-folder lines
 * @property {string} strokeDasharray - Dash pattern for folder lines
 * @property {number} childOffsetMultiplier - Multiplier for child offset calculation
 * @property {number} horizontalOffsetFactor - Factor for horizontal offset
 * @property {number} redrawDelay - Delay before redrawing lines (ms)
 */

/**
 * @typedef {Object} ThemeConfig
 * @property {string} mode - Theme mode: 'light', 'dark', or 'auto'
 * @property {Object} colors - Color palette override
 * @property {Object} layout - Layout configuration override
 */

/**
 * @typedef {Object} TreeOptions
 * @property {string} rootDir - Root directory path
 * @property {string[]} gitignorePatterns - Array of gitignore patterns
 * @property {boolean} showHidden - Whether to show hidden files
 * @property {number} maxDepth - Maximum depth to traverse
 * @property {Function} shouldIgnore - Custom ignore function
 * @property {Function} colorGenerator - Custom color generation function
 * @property {Function} iconResolver - Custom icon resolution function
 */

/**
 * @typedef {Object} GeneratorOptions
 * @property {boolean} inlineStyles - Whether to inline CSS styles
 * @property {boolean} inlineScripts - Whether to inline JavaScript
 * @property {string[]} features - Array of features to include
 * @property {ThemeConfig} theme - Theme configuration
 * @property {boolean} minify - Whether to minify output
 * @property {Object} customStyles - Additional CSS styles
 * @property {Object} customScripts - Additional JavaScript code
 */

/**
 * @typedef {Object} EventHandlers
 * @property {Function} onToggle - Called when node is toggled
 * @property {Function} onHover - Called when node is hovered
 * @property {Function} onClick - Called when node is clicked
 * @property {Function} onRender - Called after tree is rendered
 * @property {Function} onError - Called when an error occurs
 */

/**
 * @typedef {Object} RenderContext
 * @property {HTMLElement} container - Container element
 * @property {SVGElement} svg - SVG element for lines
 * @property {TreeNode} rootNode - Root tree node
 * @property {DrawingConfig} drawing - Drawing configuration
 * @property {EventHandlers} handlers - Event handler functions
 * @property {Function} cleanup - Cleanup function
 */

/**
 * Color identifier type
 * @typedef {'Blue'|'Cyan'|'Green'|'Orange'|'Pink'|'Purple'|'Red'|'Yellow'|'Gold'|'Maroon'|'Olive'|'Slate'|'Violet'|'Gray'} ColorHue
 */

/**
 * Icon identifier type
 * @typedef {string} IconReference - SVG icon reference like "#_iconFolder"
 */

/**
 * File extension mapping type
 * @typedef {Object.<string, IconReference>} ExtensionMap
 */

/**
 * Special file configuration
 * @typedef {Object} SpecialFileConfig
 * @property {string[]} extensions - Valid extensions for this special file
 * @property {IconReference} icon - Icon to use for this special file
 */

export {};
