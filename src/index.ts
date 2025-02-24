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

  function setAppWidth() {
    const newWidth = layout.width * layout.scale + 32;
    newWidth > 600
      ? (container.style.width = `${newWidth}px`)
      : (container.style.width = "600px");
  }

  function onZoomIn() {
    layout.zoomIn();
    setAppWidth();
  }

  function onZoomOut() {
    layout.zoomOut();
    setAppWidth();
  }

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
  const play = document.querySelector( "[data-control='play']") as SVGCircleElement;
  const pause = document.querySelector( "[data-control='pause']") as SVGCircleElement;
  const zoomIn = document.querySelector( "[data-control='zoom-in']") as SVGCircleElement;
  const zoomOut = document.querySelector( "[data-control='zoom-out']") as SVGCircleElement;

  next.addEventListener("click", () => scrubberControls.next());
  prev.addEventListener("click", () => scrubberControls.prev());
  zoomIn.addEventListener("click", onZoomIn);
  zoomOut.addEventListener("click", onZoomOut);

  let playTimer: number | undefined;

  play.addEventListener("click", () => {
    play.parentElement!.style.display = "none";
    pause.parentElement!.style.display = "inline";
    if (scrubberControls.isAtEnd()) scrubberControls.reset();
    playTimer = setInterval(() => {
      if (scrubberControls.isAtEnd()) {
        clearInterval(playTimer);
        pause.parentElement!.style.display = "none";
        play.parentElement!.style.display = "inline";
      } else {
        scrubberControls.next();
      }
    }, 500);

  });
  pause.addEventListener("click", () => {
    pause.parentElement!.style.display = "none";
    play.parentElement!.style.display = "inline";
    clearInterval(playTimer);
  });

  onZoomIn();
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
