import {
  DEFAULT_DRAWING_CONFIG,
  DEFAULT_GENERATOR_OPTIONS,
  DEFAULT_THEME_CONFIG,
  DEFAULT_TREE_OPTIONS,
} from "./configPresets.js";

/**
 * Configuration management for the file tree system
 */

/**
 * Merges user configuration with defaults
 */
export function mergeConfig(userConfig, defaultConfig) {
  if (!userConfig) return { ...defaultConfig };

  const merged = { ...defaultConfig };

  for (const [key, value] of Object.entries(userConfig)) {
    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        merged[key] = mergeConfig(value, defaultConfig[key] || {});
      } else {
        merged[key] = value;
      }
    }
  }

  return merged;
}

/**
 * Creates drawing configuration from user options
 */
export function createDrawingConfig(options = {}) {
  return mergeConfig(options, DEFAULT_DRAWING_CONFIG);
}

/**
 * Creates theme configuration from user options
 */
export function createThemeConfig(options = {}) {
  return mergeConfig(options, DEFAULT_THEME_CONFIG);
}

/**
 * Creates tree options from user input
 */
export function createTreeOptions(options = {}) {
  return mergeConfig(options, DEFAULT_TREE_OPTIONS);
}

/**
 * Creates generator options from user input
 */
export function createGeneratorOptions(options = {}) {
  return mergeConfig(options, DEFAULT_GENERATOR_OPTIONS);
}

/**
 * Validates configuration object
 */
export function validateConfig(config, schema) {
  const errors = [];

  for (const [key, validator] of Object.entries(schema)) {
    const value = config[key];

    if (validator.required && (value === null || value === undefined)) {
      errors.push(`${key} is required`);
      continue;
    }

    if (value !== null && value !== undefined) {
      if (validator.type && typeof value !== validator.type) {
        errors.push(`${key} must be of type ${validator.type}`);
      }

      if (validator.values && !validator.values.includes(value)) {
        errors.push(`${key} must be one of: ${validator.values.join(", ")}`);
      }

      if (validator.min !== undefined && value < validator.min) {
        errors.push(`${key} must be at least ${validator.min}`);
      }

      if (validator.max !== undefined && value > validator.max) {
        errors.push(`${key} must be at most ${validator.max}`);
      }
    }
  }

  return errors;
}

/**
 * Configuration schemas for validation
 */
export const CONFIG_SCHEMAS = {
  drawing: {
    cornerRadius: { type: "number", min: 0 },
    horizontalLength: { type: "number", min: 0 },
    strokeWidth: { type: "number", min: 0 },
    folderStrokeOpacity: { type: "number", min: 0, max: 1 },
    redrawDelay: { type: "number", min: 0 },
  },

  theme: {
    mode: { type: "string", values: ["light", "dark", "auto"] },
    colors: { type: "object" },
    layout: { type: "object" },
  },

  tree: {
    rootDir: { type: "string", required: true },
    showHidden: { type: "boolean" },
    maxDepth: { type: "number", min: 1 },
  },

  generator: {
    inlineStyles: { type: "boolean" },
    inlineScripts: { type: "boolean" },
    features: { type: "object" },
    minify: { type: "boolean" },
  },
};

/**
 * Creates and validates a complete configuration object
 */
export function createConfig(options = {}) {
  const config = {
    drawing: createDrawingConfig(options.drawing),
    theme: createThemeConfig(options.theme),
    tree: createTreeOptions(options.tree),
    generator: createGeneratorOptions(options.generator),
  };

  const allErrors = [];
  for (const [section, schema] of Object.entries(CONFIG_SCHEMAS)) {
    const errors = validateConfig(config[section], schema);
    allErrors.push(...errors.map((error) => `${section}.${error}`));
  }

  if (allErrors.length > 0) {
    throw new Error(
      `Configuration validation failed:\n${allErrors.join("\n")}`
    );
  }

  return config;
}

/**
 * Exports a configuration object as JSON
 */
export function exportConfig(config) {
  return JSON.stringify(config, null, 2);
}

/**
 * Imports a configuration object from JSON
 */
export function importConfig(jsonString) {
  try {
    const config = JSON.parse(jsonString);
    return createConfig(config);
  } catch (error) {
    throw new Error(`Failed to parse configuration: ${error.message}`);
  }
}
