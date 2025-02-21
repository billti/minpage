import {
  createPlayerControls,
  createScrubberControls,
  createZoomControls,
} from "./controls";
import "./index.css";
import { fillQubitLocations, Layout } from "./layout";
import { getMachine, MachineLayout } from "./loader";
import { addChildWithClass } from "./utils";

function render(container: HTMLDivElement, machineLayout: MachineLayout) {
  const toolstrip = addChildWithClass(container, "div", "minpage-toolstrip");
  const zones = addChildWithClass(container, "div", "minpage-zones");

  // Render the layout
  const qubits = fillQubitLocations(4, 6, 3);
  const layout = new Layout(machineLayout, qubits);

  const zoomControls = createZoomControls();
  zoomControls.classList.add("minpage-toolbar-left");

  const playerControls = createPlayerControls();
  const scrubberControls = createScrubberControls();

  toolstrip.appendChild(zoomControls);
  toolstrip.appendChild(scrubberControls);
  toolstrip.appendChild(playerControls);

  zones.appendChild(layout.container);

  // Wire up the controls
  container.tabIndex = 0;
  container.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        onNext();
        break;
      case "ArrowLeft":
        e.preventDefault();
        onPrev();
        break;
    }
  });

  const next = document.querySelector(
    "[data-control='next']"
  ) as SVGCircleElement;
  const prev = document.querySelector(
    "[data-control='prev']"
  ) as SVGCircleElement;
  const zoomIn = document.querySelector(
    "[data-control='zoom-in']"
  ) as SVGCircleElement;
  const zoomOut = document.querySelector(
    "[data-control='zoom-out']"
  ) as SVGCircleElement;
  const qubit = document.querySelector(".minpage-qubit") as SVGCircleElement;

  function setAppWidth() {
    const newWidth = layout.width * layout.scale + 32;
    newWidth > 600
      ? (container.style.width = `${newWidth}px`)
      : (container.style.width = "600px");
  }

  zoomIn.addEventListener("click", () => {
    layout.zoomIn();
    setAppWidth();
  });
  zoomOut.addEventListener("click", () => {
    layout.zoomOut();
    setAppWidth();
  });

  function onNext() {
    layout.renderGateOnQubit(2, "SX");
    layout.renderGateOnQubit(14, "RZ", "2.35");
    qubit
      .animate(
        [
          { cx: 5, cy: 65 },
          { cx: 15, cy: 45 },
        ],
        { duration: 250, fill: "forwards", easing: "ease" }
      )
      .finished.then((anim) => {
        anim.commitStyles();
        anim.cancel();
      });
  }

  function onPrev() {
    layout.clearGates();
    qubit
      .animate(
        [
          { cx: 15, cy: 45 },
          { cx: 5, cy: 65 },
        ],
        { duration: 250, fill: "forwards", easing: "ease" }
      )
      .finished.then((anim) => {
        anim.commitStyles();
        anim.cancel();
      });
  }

  next.addEventListener("click", onNext);
  prev.addEventListener("click", onPrev);
}

document.addEventListener("DOMContentLoaded", () => {
  const minpageApp = document.createElement("div");
  minpageApp.className = "minpage-app";

  // Set the theme if explicitly provided
  const urlParams = new URLSearchParams(window.location.search);
  const theme = urlParams.get("theme");
  if (theme) {
    minpageApp.setAttribute("data-theme", theme);
  }

  document.body.appendChild(minpageApp);
  render(minpageApp, getMachine());
});
