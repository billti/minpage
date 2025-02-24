import {
  createPlayerControls,
  createScrubberControls,
  createZoomControls,
} from "./controls";
import "./index.css";
import { Layout } from "./layout";
import { getMachine, getSampleTrace, MachineLayout, Trace } from "./loader";
import { addChildWithClass } from "./utils";

function render(container: HTMLElement, machineLayout: MachineLayout, trace: Trace) {
  const toolstrip = addChildWithClass(container, "div", "minpage-toolstrip");

  const zoomControls = createZoomControls();
  const playerControls = createPlayerControls();
  const scrubberControls = createScrubberControls();
  scrubberControls.setRange(trace.steps.length);

  toolstrip.appendChild(zoomControls);
  toolstrip.appendChild(scrubberControls.element);
  toolstrip.appendChild(playerControls);

  // Render the layout
  const zones = addChildWithClass(container, "div", "minpage-zones");
  const layout = new Layout(machineLayout, trace);
  zones.appendChild(layout.container);

  scrubberControls.setNavHandler((step: number) => layout.gotoStep(step));

  // Wire up the controls
  container.tabIndex = 0;
  container.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        scrubberControls.next();
        break;
      case "ArrowLeft":
        e.preventDefault();
        scrubberControls.prev();
        break;
      case "ArrowUp":
        e.preventDefault();
        onZoomIn();
        break;
      case "ArrowDown":
        e.preventDefault();
        onZoomOut();
        break;
    }
  });

  const next = document.querySelector( "[data-control='next']") as SVGCircleElement;
  const prev = document.querySelector( "[data-control='prev']") as SVGCircleElement;
  const zoomIn = document.querySelector( "[data-control='zoom-in']") as SVGCircleElement;
  const zoomOut = document.querySelector( "[data-control='zoom-out']") as SVGCircleElement;
  const qubit = document.querySelector(".minpage-qubit") as SVGCircleElement;

  function setAppWidth() {
    const newWidth = layout.width * layout.scale + 32;
    newWidth > 600
      ? (container.style.width = `${newWidth}px`)
      : (container.style.width = "600px");
  }

  function onNext() {
    layout.renderGateOnQubit(2, "SX");
    layout.renderGateOnQubit(14, "RZ", "2.35");
    qubit
      .animate(
        [
          { transform: "translate(5px, 65px)" },
          { transform: "translate(15px, 45px)" },
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
          { transform: "translate(15px, 45px)" },
          { transform: "translate(5px, 65px)" },
        ],
        { duration: 250, fill: "forwards", easing: "ease" }
      )
      .finished.then((anim) => {
        anim.commitStyles();
        anim.cancel();
      });
  }

  function onZoomIn() {
    layout.zoomIn();
    setAppWidth();
  }

  function onZoomOut() {
    layout.zoomOut();
    setAppWidth();
  }

  next.addEventListener("click", () => scrubberControls.next());
  prev.addEventListener("click", () => scrubberControls.prev());
  zoomIn.addEventListener("click", onZoomIn);
  zoomOut.addEventListener("click", onZoomOut);
}

document.addEventListener("DOMContentLoaded", () => {
  const minpageApp = addChildWithClass(document.body, "div", "minpage-app");

  // Set the theme if explicitly provided
  const urlParams = new URLSearchParams(window.location.search);
  const theme = urlParams.get("theme");
  if (theme) {
    document.body.setAttribute("data-theme", theme);
  }

  const trace = getSampleTrace();
  render(minpageApp, getMachine(), trace);
});
