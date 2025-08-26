export type TreeNode = {
    /**
     * - The file/directory name
     */
    name: string;
    /**
     * - The absolute path
     */
    path: string;
    /**
     * - Path relative to root
     */
    relativePath: string;
    /**
     * - Nesting level in the tree
     */
    level: number;
    /**
     * - Color identifier for styling
     */
    color: string;
    /**
     * - SVG icon reference
     */
    icon: string;
    /**
     * - Whether this is a directory
     */
    isDirectory: boolean;
    /**
     * - Route identifier for navigation
     */
    route: string;
    /**
     * - Unique identifier (sanitized name)
     */
    id: string;
    /**
     * - Child nodes (for directories)
     */
    children: TreeNode[] | undefined;
    /**
     * - Whether directory is empty
     */
    isEmpty: boolean | undefined;
};
export type DrawingConfig = {
    /**
     * - Radius for path corner curves
     */
    cornerRadius: number;
    /**
     * - Base horizontal line length
     */
    horizontalLength: number;
    /**
     * - Line stroke width
     */
    strokeWidth: number;
    /**
     * - Opacity for folder-to-folder lines
     */
    folderStrokeOpacity: number;
    /**
     * - Dash pattern for folder lines
     */
    strokeDasharray: string;
    /**
     * - Multiplier for child offset calculation
     */
    childOffsetMultiplier: number;
    /**
     * - Factor for horizontal offset
     */
    horizontalOffsetFactor: number;
    /**
     * - Delay before redrawing lines (ms)
     */
    redrawDelay: number;
};
export type ThemeConfig = {
    /**
     * - Theme mode: 'light', 'dark', or 'auto'
     */
    mode: string;
    /**
     * - Color palette override
     */
    colors: any;
    /**
     * - Layout configuration override
     */
    layout: any;
};
export type TreeOptions = {
    /**
     * - Root directory path
     */
    rootDir: string;
    /**
     * - Array of gitignore patterns
     */
    gitignorePatterns: string[];
    /**
     * - Whether to show hidden files
     */
    showHidden: boolean;
    /**
     * - Maximum depth to traverse
     */
    maxDepth: number;
    /**
     * - Custom ignore function
     */
    shouldIgnore: Function;
    /**
     * - Custom color generation function
     */
    colorGenerator: Function;
    /**
     * - Custom icon resolution function
     */
    iconResolver: Function;
};
export type GeneratorOptions = {
    /**
     * - Whether to inline CSS styles
     */
    inlineStyles: boolean;
    /**
     * - Whether to inline JavaScript
     */
    inlineScripts: boolean;
    /**
     * - Array of features to include
     */
    features: string[];
    /**
     * - Theme configuration
     */
    theme: ThemeConfig;
    /**
     * - Whether to minify output
     */
    minify: boolean;
    /**
     * - Additional CSS styles
     */
    customStyles: any;
    /**
     * - Additional JavaScript code
     */
    customScripts: any;
};
export type EventHandlers = {
    /**
     * - Called when node is toggled
     */
    onToggle: Function;
    /**
     * - Called when node is hovered
     */
    onHover: Function;
    /**
     * - Called when node is clicked
     */
    onClick: Function;
    /**
     * - Called after tree is rendered
     */
    onRender: Function;
    /**
     * - Called when an error occurs
     */
    onError: Function;
};
export type RenderContext = {
    /**
     * - Container element
     */
    container: HTMLElement;
    /**
     * - SVG element for lines
     */
    svg: SVGElement;
    /**
     * - Root tree node
     */
    rootNode: TreeNode;
    /**
     * - Drawing configuration
     */
    drawing: DrawingConfig;
    /**
     * - Event handler functions
     */
    handlers: EventHandlers;
    /**
     * - Cleanup function
     */
    cleanup: Function;
};
/**
 * Color identifier type
 */
export type ColorHue = "Blue" | "Cyan" | "Green" | "Orange" | "Pink" | "Purple" | "Red" | "Yellow" | "Gold" | "Maroon" | "Olive" | "Slate" | "Violet" | "Gray";
/**
 * - SVG icon reference like "#_iconFolder"
 */
export type IconReference = string;
/**
 * File extension mapping type
 */
export type ExtensionMap = {
    [x: string]: string;
};
/**
 * Special file configuration
 */
export type SpecialFileConfig = {
    /**
     * - Valid extensions for this special file
     */
    extensions: string[];
    /**
     * - Icon to use for this special file
     */
    icon: IconReference;
};
