export function generateStyles() {
	return `
	:root {
	  --lightWhite: #f8f8ff;
	  --darkWhite: #dfe2e8;
	  --lightBlack: #2f4f4f;
	  --darkBlack: #1a3737;
	  --lightBlue: #6c8eef;
	  --darkBlue: #5469d4;
	  --lightCyan: #3a97d4;
	  --darkCyan: #067ab8;
	  --lightGold: #ffd700;
	  --darkGold: #daa520;
	  --lightGray: #8e8e8e;
	  --darkGray: #787878;
	  --lightGreen: #1ea672;
	  --darkGreen: #09825d;
	  --lightMaroon: #9c3f3f;
	  --darkMaroon: #741f1f;
	  --lightOlive: #808000;
	  --darkOlive: #556b2f;
	  --lightOrange: #e56f4a;
	  --darkOrange: #c44c34;
	  --lightPink: #f472b6;
	  --darkPink: #ec4899;
	  --lightPurple: #9c82db;
	  --darkPurple: #8260c3;
	  --lightRed: #ed5f74;
	  --darkRed: #cd3d64;
	  --lightSlate: #8792a2;
	  --darkSlate: #697386;
	  --lightViolet: #4a50aa;
	  --darkViolet: #6c68ee;
	  --lightYellow: #d97917;
	  --darkYellow: #bb5504;

	  --white: ghostwhite;
	  --black: darkslategray;
	  --blue: dodgerblue;
	  --cyan: turquoise;
	  --gold: goldenrod;
	  --gray: silver;
	  --green: mediumseagreen;
	  --maroon: indianred;
	  --olive: olive;
	  --orange: darkorange;
	  --pink: hotpink;
	  --purple: mediumpurple;
	  --red: crimson;
	  --slate: slategray;
	  --violet: mediumslateblue;
	  --yellow: gold;

	  @media (prefers-color-scheme: dark) {
	    --white: var(--darkWhite);
	    --black: var(--darkBlack);
	    --blue: var(--darkBlue);
	    --cyan: var(--darkCyan);
	    --gold: var(--darkGold);
	    --gray: var(--darkGray);
	    --green: var(--darkGreen);
	    --maroon: var(--darkMaroon);
	    --olive: var(--darkOlive);
	    --orange: var(--darkOrange);
	    --pink: var(--darkPink);
	    --purple: var(--darkPurple);
	    --red: var(--darkRed);
	    --slate: var(--darkSlate);
	    --violet: var(--darkViolet);
	    --yellow: var(--darkYellow);
	  }

	  @media (prefers-color-scheme: light) {
	    --white: var(--lightWhite);
	    --black: var(--lightBlack);
	    --blue: var(--lightBlue);
	    --cyan: var(--lightCyan);
	    --gold: var(--lightGold);
	    --gray: var(--lightGray);
	    --green: var(--lightGreen);
	    --maroon: var(--lightMaroon);
	    --olive: var(--lightOlive);
	    --orange: var(--lightOrange);
	    --pink: var(--lightPink);
	    --purple: var(--lightPurple);
	    --red: var(--lightRed);
	    --slate: var(--lightSlate);
	    --violet: var(--lightViolet);
	    --yellow: var(--lightYellow);
	  }
	}

	body {
	  font-family:
	    "Inter",
	    system-ui,
	    -apple-system,
	    BlinkMacSystemFont,
	    "Segoe UI",
	    Roboto,
	    Oxygen,
	    Ubuntu,
	    Cantarell,
	    "Open Sans",
	    "Helvetica Neue",
	    sans-serif;
	  background-color: #111827;
	  color: #f3f4f6;
	}

	.hierarchy-list {
	  width: max-content;
	  margin-inline: 0;
	}

	.hierarchy-list ul {
	  margin-block: 4rem;
	  margin-left: 4rem;
	  transform: translateX(3rem);
	  display: flex;
	  flex-flow: column wrap;
	  place-items: start;
	  place-content: center;
	  place-self: start;
	  padding: 0;
	  list-style: none;
	}

	.hierarchy-list ul ul {
	  transform: translateX(12rem);
	}

	.hierarchy-list ul ul ul {
	  transform: translateX(6rem);
	}

	.hierarchy-list li {
	  position: relative;
	  padding: 0.25rem 0.5rem;
	  margin-block: 0.25rem;
	  cursor: pointer;
	  transition: background-color 0.2s ease-in-out;
	  display: flex;
	  place-items: start;
	  place-content: start;
	  --branch-color: #4b5563;
	}
	.hierarchy-list li:hover > .node-content {
	  background-color: #374151;
	}
	.hierarchy-list .node-content {
	  background-color: #1f2937;
	  border: 1px solid #4b5563;
	  border-radius: 0.375rem;
	  padding: 0.5rem 1rem;
	  display: flex;
	  place-items: center;
	  place-content: start;
	  gap: 0.5rem;
	  transition: background-color 0.2s ease-in-out;
	  position: relative;
	  z-index: 4;
	}
	.hierarchy-list .node-content span {
	  user-select: none;
	}
	.hierarchy-list .node-content::before {
	  content: "";
	  display: block;
	  position: absolute;
	  left: -0.375rem;
	  top: 50%;
	  clip-path: inset(0 50% 0 0);
	  transform: translateY(-50%);
	  width: 0.5rem;
	  height: 0.5rem;
	  border-radius: 50%;
	  background: var(--branch-color);
	  transform: scale(0.8) translateY(-0.3125rem);
	  z-index: 3;
	}

	.hierarchy-list .folder .node-content::before {
	  background: var(--colorSlate);
	}

	.hierarchy-list .node-content:hover::before {
	  filter: brightness(1.2);
	  left: -0.3125rem;
	  transform: scale(1.2) translateY(-0.21875rem);
	  transform-origin: center;
	}

	.hierarchy-list .node-content::after {
	  content: "";
	  display: block;
	  position: absolute;
	  left: -0.75rem;
	  top: 50%;
	  clip-path: inset(0 50% 0 0);
	  transform: translateY(-50%);
	  width: 1.5rem;
	  height: 1.5rem;
	  background-color: #111827;
	  border-radius: 50%;
	  box-shadow: none;
	  filter: opacity(0.2);
	  z-index: 2;
	}

	.hierarchy-list .node-content:hover::after {
	  background-color: var(--colorWhite);
	  filter: opacity(0.08);
	}
	.hierarchy-list li[aria-expanded="false"] > ul {
	  display: none;
	}
	#svg-container {
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  pointer-events: none;
	  z-index: 1;
	}
	.icon {
	  width: 1.25rem;
	  height: 1.25rem;
	  flex-shrink: 0;
	  color: var(--colorWhite);
	}

	.dir,
	.folder {
	  color: var(--colorSlate);
	}

	.hierarchy-list .link .node-content::before {
	  background: var(--colorBlue);
	}

	.html,
	.link {
	  color: var(--colorBlue);
	}

	.hierarchy-list .style .node-content::before {
	  background: var(--colorCyan);
	}

	.css,
	.style {
	  color: var(--colorCyan);
	}

	.hierarchy-list .image .node-content::before {
	  background: var(--colorGreen);
	}

	.avif,
	.webp,
	.png,
	.image {
	  color: var(--colorGreen);
	}

	.hierarchy-list .vector .node-content::before {
	  background: var(--colorYellow);
	}

	.svg,
	.ico,
	.vector {
	  color: var(--colorYellow);
	}

	.hierarchy-list .docs .node-content::before {
	  background: var(--colorBlue);
	}

	.md,
	.docs {
	  color: var(--colorBlue);
	}

	.hierarchy-list .file .node-content::before {
	  background: var(--colorGray);
	}

	.yml,
	.cff,
	.file {
	  color: var(--colorGray);
	}

	.hierarchy-list .preset .node-content::before {
	  background: var(--colorViolet);
	}

	:is([class^="."], [class*="git"], [class$="config"], [class$="rc"]),
	.preset {
	  color: var(--colorViolet);
	}

	.hierarchy-list .config .node-content::before {
	  background: var(--colorRed);
	}

	.json,
	.config .yml,
	.webmanifest,
	.config {
	  color: var(--colorRed);
	}

	.hierarchy-list .script .node-content::before {
	  background: var(--colorOrange);
	}

	.sh,
	.js,
	.script {
	  color: var(--colorOrange);
	}

	/* Color system based on data-color attribute */
	.hierarchy-list li[data-color="Blue"] .icon,
	.hierarchy-list li[data-color="Blue"] span {
	  color: var(--colorBlue) !important;
	}
	.hierarchy-list li[data-color="Blue"] .node-content::before {
	  background: var(--colorBlue) !important;
	}

	.hierarchy-list li[data-color="Cyan"] .icon,
	.hierarchy-list li[data-color="Cyan"] span {
	  color: var(--colorCyan) !important;
	}
	.hierarchy-list li[data-color="Cyan"] .node-content::before {
	  background: var(--colorCyan) !important;
	}

	.hierarchy-list li[data-color="Green"] .icon,
	.hierarchy-list li[data-color="Green"] span {
	  color: var(--colorGreen) !important;
	}
	.hierarchy-list li[data-color="Green"] .node-content::before {
	  background: var(--colorGreen) !important;
	}

	.hierarchy-list li[data-color="Orange"] .icon,
	.hierarchy-list li[data-color="Orange"] span {
	  color: var(--colorOrange) !important;
	}
	.hierarchy-list li[data-color="Orange"] .node-content::before {
	  background: var(--colorOrange) !important;
	}

	.hierarchy-list li[data-color="Pink"] .icon,
	.hierarchy-list li[data-color="Pink"] span {
	  color: var(--colorPink) !important;
	}
	.hierarchy-list li[data-color="Pink"] .node-content::before {
	  background: var(--colorPink) !important;
	}

	.hierarchy-list li[data-color="Purple"] .icon,
	.hierarchy-list li[data-color="Purple"] span {
	  color: var(--colorPurple) !important;
	}
	.hierarchy-list li[data-color="Purple"] .node-content::before {
	  background: var(--colorPurple) !important;
	}

	.hierarchy-list li[data-color="Red"] .icon,
	.hierarchy-list li[data-color="Red"] span {
	  color: var(--colorRed) !important;
	}
	.hierarchy-list li[data-color="Red"] .node-content::before {
	  background: var(--colorRed) !important;
	}

	.hierarchy-list li[data-color="Yellow"] .icon,
	.hierarchy-list li[data-color="Yellow"] span {
	  color: var(--colorYellow) !important;
	}
	.hierarchy-list li[data-color="Yellow"] .node-content::before {
	  background: var(--colorYellow) !important;
	}

	.hierarchy-list li[data-color="Gold"] .icon,
	.hierarchy-list li[data-color="Gold"] span {
	  color: var(--colorGold) !important;
	}
	.hierarchy-list li[data-color="Gold"] .node-content::before {
	  background: var(--colorGold) !important;
	}

	.hierarchy-list li[data-color="Maroon"] .icon,
	.hierarchy-list li[data-color="Maroon"] span {
	  color: var(--colorMaroon) !important;
	}
	.hierarchy-list li[data-color="Maroon"] .node-content::before {
	  background: var(--colorMaroon) !important;
	}

	.hierarchy-list li[data-color="Olive"] .icon,
	.hierarchy-list li[data-color="Olive"] span {
	  color: var(--colorOlive) !important;
	}
	.hierarchy-list li[data-color="Olive"] .node-content::before {
	  background: var(--colorOlive) !important;
	}

	.hierarchy-list li[data-color="Slate"] .icon,
	.hierarchy-list li[data-color="Slate"] span {
	  color: var(--colorSlate) !important;
	}
	.hierarchy-list li[data-color="Slate"] .node-content::before {
	  background: var(--colorSlate) !important;
	}

	.hierarchy-list li[data-color="Violet"] .icon,
	.hierarchy-list li[data-color="Violet"] span {
	  color: var(--colorViolet) !important;
	}
	.hierarchy-list li[data-color="Violet"] .node-content::before {
	  background: var(--colorViolet) !important;
	}

	.hierarchy-list li[data-color="Gray"] .icon,
	.hierarchy-list li[data-color="Gray"] span {
	  color: var(--colorGray) !important;
	}
	.hierarchy-list li[data-color="Gray"] .node-content::before {
	  background: var(--colorGray) !important;
	}

	.node-content span {
	  color: var(--colorWhite);
	}
	.folder[aria-expanded="true"] .icon-collapsed {
	  display: none;
	}
	.folder[aria-expanded="true"] .icon-expanded {
	  display: inline;
	}
	.folder[aria-expanded="false"] .icon-collapsed {
	  display: inline;
	}
	.folder[aria-expanded="false"] .icon-expanded {
	  display: none;
	}
	.folder:not([aria-expanded]) .icon-collapsed {
	  display: inline;
	}
	.folder:not([aria-expanded]) .icon-expanded {
	  display: none;
	}

	.hierarchy-list .node-content.hierarchy-highlight {
	  background-color: #374151 !important;
	  border-color: #6b7280 !important;
	  transform: scale(1.02);
	  box-shadow: 0 0 1px 2px var(--branch-color);
	  outline: 1px dashed var(--branch-color);
	  outline-offset: -3px;
	  transition: all 0.2s ease-in-out;
	}

	.hierarchy-list .node-content.hierarchy-highlight::before {
	  filter: brightness(1.4) !important;
	  transform: scale(1.3) translateY(-0.21875rem) !important;
	  transition: all 0.2s ease-in-out;
	}

	.hierarchy-list .node-content.hierarchy-highlight::after {
	  background-color: rgba(17, 24, 39, 0.9) !important;
	  filter: brightness(1.2) !important;
	}

	/* Layout Styles - Replaces Tailwind Classes */
	.main-body {
	  padding: 1rem;
	}

	@media (min-width: 640px) {
	  .main-body {
	    padding: 2rem;
	  }
	}

	.container {
	  max-width: 72rem;
	  margin-left: auto;
	  margin-right: auto;
	}

	.main-title {
	  font-size: 1.5rem;
	  font-weight: 700;
	  text-align: center;
	  margin-bottom: 1.5rem;
	  color: white;
	}

	@media (min-width: 640px) {
	  .main-title {
	    font-size: 1.875rem;
	  }
	}

	.diagram-container {
	  position: relative;
	  padding: 1rem;
	  background-color: #111827;
	  border-radius: 0.5rem;
	  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	/* Modal Styles */
	.modal-overlay {
	  position: fixed;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  left: 0;
	  background-color: rgba(0, 0, 0, 0.5);
	  z-index: 50;
	}

	.modal-overlay.hidden {
	  display: none;
	}

	.modal-content {
	  position: absolute;
	  top: 1rem;
	  right: 1rem;
	  bottom: 1rem;
	  left: 1rem;
	  background-color: #111827;
	  border-radius: 0.5rem;
	  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
	  overflow: hidden;
	}

	.modal-wrapper {
	  display: flex;
	  height: 100%;
	}

	.modal-header {
	  position: absolute;
	  top: 0;
	  left: 0;
	  right: 0;
	  background-color: #1f2937;
	  padding: 1rem;
	  z-index: 10;
	}

	.modal-header-content {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}

	.modal-title {
	  font-size: 1.25rem;
	  font-weight: 600;
	  color: white;
	}

	.modal-close-btn {
	  color: #9ca3af;
	  font-size: 1.5rem;
	  background: none;
	  border: none;
	  cursor: pointer;
	  transition: color 0.2s ease;
	}

	.modal-close-btn:hover {
	  color: white;
	}

	.modal-body {
	  flex: 1;
	  padding-top: 4rem;
	  padding: 1rem;
	}

	.dependency-tree-container {
	  width: 100%;
	  height: 100%;
	  background-color: #111827;
	}
  `;
}
