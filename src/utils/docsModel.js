/**
 * DOM manipulation and utility functions
 */

/**
 * Creates an SVG path element with specified attributes
 */
export function createSVGPath(
  d,
  stroke,
  strokeWidth = "0.72",
  fill = "none",
  additionalAttribs = {}
) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("stroke", stroke);
  path.setAttribute("stroke-width", strokeWidth);
  path.setAttribute("fill", fill);

  Object.entries(additionalAttribs).forEach(([key, value]) => {
    path.setAttribute(key, value);
  });

  return path;
}

/**
 * Gets computed style color for a node element
 */
export function getNodeColor(nodeElement) {
  const computedStyle = window.getComputedStyle(nodeElement);
  return computedStyle.color;
}

/**
 * Sets CSS custom property on an element
 */
export function setCSSProperty(element, property, value) {
  element.style.setProperty(property, value);
}

/**
 * Removes CSS property from an element
 */
export function removeCSSProperty(element, property) {
  element.style.removeProperty(property);
}

/**
 * Gets element's bounding client rect
 */
export function getElementRect(element) {
  return element.getBoundingClientRect();
}

/**
 * Adds event listener with cleanup tracking
 */
export function addEventListenerWithCleanup(
  element,
  eventType,
  handler,
  options = {}
) {
  element.addEventListener(eventType, handler, options);

  return () => {
    element.removeEventListener(eventType, handler, options);
  };
}

/**
 * Adds multiple event listeners and returns cleanup function
 */
export function addEventListeners(element, eventMap) {
  const cleanupFunctions = [];

  Object.entries(eventMap).forEach(([eventType, handler]) => {
    const cleanup = addEventListenerWithCleanup(element, eventType, handler);
    cleanupFunctions.push(cleanup);
  });

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}

/**
 * Queries all elements matching a selector
 */
export function queryAll(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Queries single element matching a selector
 */
export function query(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Finds the closest ancestor matching a selector
 */
export function closest(element, selector) {
  return element.closest(selector);
}

/**
 * Adds class to element
 */
export function addClass(element, className) {
  element.classList.add(className);
}

/**
 * Removes class from element
 */
export function removeClass(element, className) {
  element.classList.remove(className);
}

/**
 * Toggles class on element
 */
export function toggleClass(element, className) {
  element.classList.toggle(className);
}

/**
 * Checks if element has class
 */
export function hasClass(element, className) {
  return element.classList.contains(className);
}

/**
 * Sets attribute on element
 */
export function setAttribute(element, name, value) {
  element.setAttribute(name, value);
}

/**
 * Gets attribute from element
 */
export function getAttribute(element, name) {
  return element.getAttribute(name);
}

/**
 * Removes attribute from element
 */
export function removeAttribute(element, name) {
  element.removeAttribute(name);
}

/**
 * Sets transform style on element
 */
export function setTransform(element, transform) {
  element.style.transform = transform;
}

/**
 * Clears transform style on element
 */
export function clearTransform(element) {
  element.style.transform = "";
}

/**
 * Sets innerHTML for an element
 */
export function setInnerHTML(element, html) {
  element.innerHTML = html;
}

/**
 * Clears innerHTML for an element
 */
export function clearInnerHTML(element) {
  element.innerHTML = "";
}

/**
 * Creates a debounced version of a function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Executes a function with a delay
 */
export function delay(func, ms) {
  return setTimeout(func, ms);
}

/**
 * Removes all children from an element
 */
export function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Appends child element to parent
 */
export function appendChild(parent, child) {
  parent.appendChild(child);
}
