document.addEventListener("DOMContentLoaded", () => {
  const diagramContainer = document.getElementById("diagram-container");
  const svg = document.getElementById("svg-container");

  function drawLines() {
    setTimeout(() => {
      svg.innerHTML = "";
      svg.setAttribute("width", diagramContainer.scrollWidth);
      svg.setAttribute("height", diagramContainer.scrollHeight);

      const containerRect = diagramContainer.getBoundingClientRect();
      function getNodeColor(nodeElement) {
        const computedStyle = window.getComputedStyle(nodeElement);
        return computedStyle.color;
      }

      const allListItems = document.querySelectorAll(".hierarchy-list li");
      allListItems.forEach((li) => {
        li.style.removeProperty("--branch-color");
      });

      document
        .querySelectorAll(".hierarchy-list .node-content")
        .forEach((nodeContent) => {
          nodeContent.style.transform = "";
        });

      document.querySelectorAll(".hierarchy-list li").forEach((parentLi) => {
        const childUl = parentLi.querySelector(":scope > ul");
        const isExpanded = parentLi.getAttribute("aria-expanded") === "true";
        if (childUl && isExpanded) {
          const parentContent = parentLi.querySelector(
            ":scope > .node-content"
          );
          const parentRect = parentContent.getBoundingClientRect();
          const pX = parentRect.right - containerRect.left;
          const pY = parentRect.top - containerRect.top + parentRect.height / 2;
          const childLis = childUl.querySelectorAll(":scope > li");
          const childCount = childLis.length;

          childLis.forEach((childLi, index) => {
            const childColor = getNodeColor(childLi);
            childLi.style.setProperty("--branch-color", childColor);

            const childContent = childLi.querySelector(
              ":scope > .node-content"
            );
            const childRect = childContent.getBoundingClientRect();
            let xOffset = 0;
            if (childCount > 1) {
              xOffset = (childCount - 1 - index) * 12;
            }

            let cX, cY;
            cX = childRect.left - containerRect.left - 6 + xOffset;
            cY = childRect.top - containerRect.top + childRect.height / 2;
            if (xOffset > 0) {
              childContent.style.transform = `translateX(${xOffset}px)`;
            }
            const horizontalLength = 30 + xOffset * 0.5;
            const cornerRadius = 24;
            const midX = pX + horizontalLength;

            let d;
            if (Math.abs(pY - cY) <= cornerRadius * 2) {
              d = `M ${pX} ${pY} L ${cX} ${cY}`;
            } else if (pY < cY) {
              const horizontalEnd = Math.min(midX + cornerRadius, cX);
              d = `
									M ${pX} ${pY}
									L ${midX - cornerRadius} ${pY}
									Q ${midX} ${pY} ${midX} ${pY + cornerRadius}
									L ${midX} ${cY - cornerRadius}
									Q ${midX} ${cY} ${horizontalEnd} ${cY}
									L ${cX} ${cY}
								`;
            } else {
              const horizontalEnd = Math.min(midX + cornerRadius, cX);
              d = `
									M ${pX} ${pY}
									L ${midX - cornerRadius} ${pY}
									Q ${midX} ${pY} ${midX} ${pY - cornerRadius}
									L ${midX} ${cY + cornerRadius}
									Q ${midX} ${cY} ${horizontalEnd} ${cY}
									L ${cX} ${cY}
								`;
            }
            const path = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );
            path.setAttribute("d", d);
            const isFolderToFolder =
              parentLi.classList.contains("folder") &&
              childLi.classList.contains("folder");

            if (isFolderToFolder) {
              path.setAttribute("stroke", "slategray");
              path.setAttribute("stroke-dasharray", "3, 3");
              path.setAttribute("stroke-opacity", "0.8");
            } else {
              path.setAttribute("stroke", childColor);
              path.setAttribute("stroke-opacity", "0.8");
            }

            path.setAttribute("stroke-width", "2");
            path.setAttribute("fill", "none");

            path.setAttribute(
              "data-parent-id",
              parentLi.getAttribute("data-id")
            );
            path.setAttribute("data-child-id", childLi.getAttribute("data-id"));

            svg.appendChild(path);
          });
        }
      });

      addHoverListeners();
    }, 100);
  }
  function updateAriaExpanded() {
    const allFolders = document.querySelectorAll(".hierarchy-list li.folder");
    allFolders.forEach((folder) => {
      const icon = folder.querySelector(":scope > .node-content > svg");
      const isExpanded = folder.getAttribute("aria-expanded") !== "false";
      folder.setAttribute("aria-expanded", isExpanded.toString());
      if (icon) {
        icon.setAttribute("aria-expanded", isExpanded.toString());
      }
    });
  }
  function toggleNode(event) {
    const targetLi = event.currentTarget.closest("li");

    if (targetLi && targetLi.classList.contains("folder")) {
      const isCurrentlyExpanded =
        targetLi.getAttribute("aria-expanded") !== "false";
      const newExpandedState = !isCurrentlyExpanded;

      targetLi.setAttribute("aria-expanded", newExpandedState.toString());
      const icon = targetLi.querySelector(":scope > .node-content > svg");
      if (icon) {
        icon.setAttribute("aria-expanded", newExpandedState.toString());
      }
      drawLines();
    } else if (targetLi && !targetLi.classList.contains("folder")) {
      event.preventDefault();
      event.stopPropagation();
      showDependencyDiagram(targetLi);
    }
  }
  const allFolders = document.querySelectorAll(".hierarchy-list li.folder");
  updateAriaExpanded();
  document.querySelectorAll(".node-content").forEach((node) => {
    node.addEventListener("click", toggleNode);
  });

  function highlightHierarchyPath(targetLi) {
    const parentsToHighlight = [];
    let currentElement = targetLi;

    while (
      currentElement &&
      currentElement !== document.querySelector(".hierarchy-list")
    ) {
      if (currentElement.tagName === "LI") {
        parentsToHighlight.push(currentElement);
      }
      currentElement = currentElement.parentElement?.closest("li");
    }

    parentsToHighlight.forEach((li) => {
      const nodeContent = li.querySelector(":scope > .node-content");
      if (nodeContent) {
        nodeContent.classList.add("hierarchy-highlight");
      }
    });

    const highlightedIds = parentsToHighlight.map((li) =>
      li.getAttribute("data-id")
    );

    svg.querySelectorAll("path").forEach((path) => {
      const parentId = path.getAttribute("data-parent-id");
      const childId = path.getAttribute("data-child-id");

      const isParentInChain = highlightedIds.includes(parentId);
      const isChildInChain = highlightedIds.includes(childId);

      if (isParentInChain && isChildInChain) {
        path.style.strokeOpacity = "1";
        path.style.filter = "brightness(1.2) opacity(1)";
        path.style.strokeWidth = "1.2";
      }
    });
  }

  function clearHierarchyHighlight() {
    document
      .querySelectorAll(".node-content.hierarchy-highlight")
      .forEach((node) => {
        node.classList.remove("hierarchy-highlight");
      });

    svg.querySelectorAll("path").forEach((path) => {
      path.style.removeProperty("stroke-opacity");
      path.style.removeProperty("filter");
      path.style.removeProperty("stroke-width");
    });
  }

  function addHoverListeners() {
    document.querySelectorAll(".node-content").forEach((node) => {
      const li = node.closest("li");

      node.removeEventListener("mouseenter", node.hierarchyEnterHandler);
      node.removeEventListener("mouseleave", node.hierarchyLeaveHandler);

      node.hierarchyEnterHandler = () => highlightHierarchyPath(li);
      node.hierarchyLeaveHandler = () => clearHierarchyHighlight();

      node.addEventListener("mouseenter", node.hierarchyEnterHandler);
      node.addEventListener("mouseleave", node.hierarchyLeaveHandler);
    });
  }

  addHoverListeners();

  function getFileNameFromRoute(route) {
    const parts = route.split("/");
    return parts[parts.length - 1];
  }

  function getDirectoryFromRoute(route) {
    const parts = route.split("/");
    return parts.slice(0, -1).join("/");
  }

  function isSpecialFile(filename) {
    const baseName = filename.split(".")[0].toLowerCase();
    return ["index", "main", "root", "default", "home"].includes(baseName);
  }

  function analyzeDependencies(selectedFile) {
    const allFiles = Array.from(
      document.querySelectorAll(".hierarchy-list li:not(.folder)")
    );
    const selectedRoute = selectedFile.getAttribute("data-route");
    const selectedFileName = getFileNameFromRoute(selectedRoute);
    const selectedDir = getDirectoryFromRoute(selectedRoute);

    const dependencies = mockDependencyAnalysis(
      selectedRoute,
      selectedFileName,
      selectedDir,
      allFiles
    );

    return dependencies;
  }

  function mockDependencyAnalysis(
    selectedRoute,
    selectedFileName,
    selectedDir,
    allFiles
  ) {
    const dependencies = {
      name: selectedFileName,
      path: selectedRoute,
      children: [],
    };

    allFiles.forEach((fileNode) => {
      const fileRoute = fileNode.getAttribute("data-route");
      const fileName = getFileNameFromRoute(fileRoute);
      const fileDir = getDirectoryFromRoute(fileRoute);

      if (fileRoute === selectedRoute) return;

      let isImported = false;
      let relationship = "direct";

      if (
        selectedFileName.endsWith(".js") ||
        selectedFileName.endsWith(".ts") ||
        selectedFileName.endsWith(".mjs") ||
        selectedFileName.endsWith(".jsx") ||
        selectedFileName.endsWith(".tsx")
      ) {
        if (fileDir === selectedDir) {
          if (
            fileName.includes("util") ||
            fileName.includes("helper") ||
            fileName.includes("config")
          ) {
            isImported = Math.random() > 0.3;
            relationship = "utility";
          } else if (fileName.startsWith("_") || fileName.includes("private")) {
            isImported = Math.random() > 0.4;
            relationship = "private";
          } else {
            isImported = Math.random() > 0.6;
            relationship = "local";
          }
        } else if (
          fileName.startsWith("index.") &&
          fileDir.startsWith(selectedDir)
        ) {
          isImported = Math.random() > 0.2;
          relationship = "module-index";
        } else if (
          (fileName.includes("util") ||
            fileName.includes("lib") ||
            fileName.includes("helper")) &&
          selectedDir.startsWith(fileDir)
        ) {
          isImported = Math.random() > 0.4;
          relationship = "shared-utility";
        } else if (
          fileName.includes("component") ||
          fileName.includes("Component") ||
          fileName.endsWith(".tsx")
        ) {
          if (
            fileDir.includes("component") ||
            selectedDir.includes("component")
          ) {
            isImported = Math.random() > 0.5;
            relationship = "component";
          }
        } else if (
          fileName.endsWith(".css") ||
          fileName.endsWith(".scss") ||
          fileName.endsWith(".sass")
        ) {
          if (
            fileDir === selectedDir ||
            fileDir.includes("styles") ||
            fileDir.includes("css")
          ) {
            isImported = Math.random() > 0.7;
            relationship = "stylesheet";
          }
        }
      }

      if (isSpecialFile(selectedFileName)) {
        if (fileDir === selectedDir) {
          isImported = Math.random() > 0.3;
          relationship = "local-import";
        } else if (fileDir.startsWith(selectedDir + "/")) {
          if (fileName.startsWith("index.")) {
            isImported = Math.random() > 0.2;
            relationship = "submodule";
          } else {
            isImported = Math.random() > 0.6;
            relationship = "child-module";
          }
        }

        const parentDirName = selectedDir.split("/").pop();
        if (
          parentDirName &&
          (fileName.toLowerCase().includes(parentDirName.toLowerCase()) ||
            fileName.split(".")[0].toLowerCase() ===
              parentDirName.toLowerCase())
        ) {
          isImported = Math.random() > 0.1;
          relationship = "directory-match";
        }

        const selectedBaseName = selectedFileName.split(".")[0].toLowerCase();
        const fileBaseName = fileName.split(".")[0].toLowerCase();
        if (selectedBaseName === fileBaseName && fileDir !== selectedDir) {
          isImported = Math.random() > 0.3;
          relationship = "name-match";
        }
      }

      if (
        selectedFileName.endsWith(".css") ||
        selectedFileName.endsWith(".scss") ||
        selectedFileName.endsWith(".sass")
      ) {
        if (
          fileName.endsWith(".js") ||
          fileName.endsWith(".ts") ||
          fileName.endsWith(".jsx") ||
          fileName.endsWith(".tsx")
        ) {
          if (fileDir === selectedDir) {
            isImported = Math.random() > 0.2;
            relationship = "local-style";
          } else if (fileName.startsWith("index.") || isSpecialFile(fileName)) {
            isImported = Math.random() > 0.4;
            relationship = "global-style";
          }
        }
      }

      if (
        selectedFileName.endsWith(".json") &&
        (selectedFileName.includes("config") ||
          selectedFileName.includes("package") ||
          selectedFileName.includes("tsconfig"))
      ) {
        if (fileName.endsWith(".js") || fileName.endsWith(".ts")) {
          if (
            fileDir.startsWith(selectedDir) ||
            selectedDir.startsWith(fileDir)
          ) {
            isImported = Math.random() > 0.3;
            relationship = "configuration";
          }
        }
      }

      if (
        selectedFileName.endsWith(".d.ts") ||
        selectedFileName.includes("types")
      ) {
        if (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) {
          isImported = Math.random() > 0.5;
          relationship = "type-definition";
        }
      }

      if (isImported) {
        dependencies.children.push({
          name: fileName,
          path: fileRoute,
          relationship: relationship,
          directory: fileDir,
          fileType: getFileType(fileName),
        });
      }
    });

    dependencies.children.sort((a, b) => {
      const relationshipPriority = {
        "module-index": 1,
        "directory-match": 2,
        "name-match": 3,
        "local-import": 4,
        utility: 5,
        component: 6,
        stylesheet: 7,
        configuration: 8,
        "shared-utility": 9,
        local: 10,
      };

      return (
        (relationshipPriority[a.relationship] || 99) -
        (relationshipPriority[b.relationship] || 99)
      );
    });

    return dependencies;
  }

  function getFileType(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const typeMap = {
      js: "javascript",
      ts: "typescript",
      jsx: "react",
      tsx: "react-typescript",
      css: "stylesheet",
      scss: "sass",
      sass: "sass",
      html: "markup",
      json: "data",
      md: "documentation",
      yml: "config",
      yaml: "config",
    };
    return typeMap[ext] || "unknown";
  }

  function showDependencyDiagram(selectedFile) {
    const modal = document.getElementById("dependency-modal");
    const title = document.getElementById("dependency-title");
    const container = document.getElementById("dependency-tree");

    const selectedRoute = selectedFile.getAttribute("data-route");
    const fileName = getFileNameFromRoute(selectedRoute);

    title.textContent = `Dependencies: ${fileName}`;
    modal.classList.remove("hidden");

    container.innerHTML = "";

    const dependencyData = analyzeDependencies(selectedFile);

    createDependencyTree(container, dependencyData);
  }

  function createDependencyTree(container, data) {
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tree = d3.tree().size([height, width]);

    const root = d3.hierarchy(data);
    const treeData = tree(root);

    const links = g
      .selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .style("fill", "none")
      .style("stroke", (d) => {
        switch (d.target.data.relationship) {
          case "module-index":
          case "submodule":
            return "#8b5cf6";
          case "directory-match":
          case "name-match":
            return "#06b6d4";
          case "utility":
          case "shared-utility":
            return "#f59e0b";
          case "component":
            return "#3b82f6";
          case "stylesheet":
          case "local-style":
          case "global-style":
            return "#ec4899";
          case "configuration":
            return "#ef4444";
          default:
            return "#6b7280";
        }
      })
      .style("stroke-width", (d) => {
        const importantRelationships = [
          "module-index",
          "directory-match",
          "name-match",
          "local-import",
        ];
        return importantRelationships.includes(d.target.data.relationship)
          ? "3px"
          : "2px";
      })
      .style("stroke-opacity", 0.8)
      .style("stroke-dasharray", (d) => {
        return d.target.data.relationship === "configuration" ||
          d.target.data.relationship === "type-definition"
          ? "5,5"
          : "none";
      });

    const nodes = g
      .selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodes
      .append("circle")
      .attr("r", (d) => (d.depth === 0 ? 8 : 6))
      .style("fill", (d) => {
        if (d.depth === 0) return "#10b981";
        switch (d.data.relationship) {
          case "module-index":
          case "submodule":
            return "#8b5cf6";
          case "directory-match":
          case "name-match":
            return "#06b6d4";
          case "utility":
          case "shared-utility":
            return "#f59e0b";
          case "component":
            return "#3b82f6";
          case "stylesheet":
          case "local-style":
          case "global-style":
            return "#ec4899";
          case "configuration":
            return "#ef4444";
          case "type-definition":
            return "#a855f7";
          case "local-import":
          case "local":
            return "#22c55e";
          case "child-module":
            return "#84cc16";
          default:
            return "#6b7280";
        }
      })
      .style("stroke", "#fff")
      .style("stroke-width", "2px");

    nodes
      .filter((d) => d.depth > 0 && d.data.fileType)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("fill", "#fff")
      .style("font-size", "8px")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .text((d) => {
        const typeMap = {
          javascript: "JS",
          typescript: "TS",
          react: "RX",
          "react-typescript": "TX",
          stylesheet: "CS",
          sass: "SC",
          markup: "HT",
          data: "JS",
          documentation: "MD",
          config: "CF",
        };
        return typeMap[d.data.fileType] || "??";
      });

    nodes
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.depth === 0 ? -15 : 15))
      .style("text-anchor", (d) => (d.depth === 0 ? "end" : "start"))
      .style("fill", "#f3f4f6")
      .style("font-size", "11px")
      .style("font-family", "Inter, sans-serif")
      .style("font-weight", (d) => (d.depth === 0 ? "600" : "400"))
      .text((d) => d.data.name);

    const linkLabels = g
      .selectAll(".link-label")
      .data(treeData.links().filter((d) => d.target.data.relationship))
      .enter()
      .append("text")
      .attr("class", "link-label")
      .attr("x", (d) => (d.source.y + d.target.y) / 2)
      .attr("y", (d) => (d.source.x + d.target.x) / 2 - 8)
      .style("text-anchor", "middle")
      .style("fill", "#9ca3af")
      .style("font-size", "9px")
      .style("font-family", "Inter, sans-serif")
      .style("opacity", 0.8)
      .text((d) => {
        const labelMap = {
          "module-index": "index",
          "directory-match": "dir-match",
          "name-match": "name",
          "local-import": "local",
          "shared-utility": "shared",
          "type-definition": "types",
          "child-module": "child",
          "global-style": "global",
          "local-style": "style",
        };
        return (
          labelMap[d.target.data.relationship] || d.target.data.relationship
        );
      });

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(20, 20)`);

    const legendData = [
      { color: "#8b5cf6", label: "Index/Module", type: "module-index" },
      { color: "#06b6d4", label: "Name Match", type: "name-match" },
      { color: "#f59e0b", label: "Utility", type: "utility" },
      { color: "#3b82f6", label: "Component", type: "component" },
      { color: "#ec4899", label: "Stylesheet", type: "stylesheet" },
      { color: "#ef4444", label: "Config", type: "configuration" },
    ];

    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 16})`);

    legendItems
      .append("circle")
      .attr("r", 4)
      .attr("cx", 6)
      .attr("cy", 0)
      .style("fill", (d) => d.color);

    legendItems
      .append("text")
      .attr("x", 16)
      .attr("y", 0)
      .attr("dy", "0.35em")
      .style("fill", "#d1d5db")
      .style("font-size", "10px")
      .style("font-family", "Inter, sans-serif")
      .text((d) => d.label);
  }

  document
    .getElementById("close-dependency-modal")
    .addEventListener("click", () => {
      document.getElementById("dependency-modal").classList.add("hidden");
    });

  document.getElementById("dependency-modal").addEventListener("click", (e) => {
    if (e.target.id === "dependency-modal") {
      document.getElementById("dependency-modal").classList.add("hidden");
    }
  });

  drawLines();
  window.addEventListener("resize", drawLines);
});
