import { createPlayerControls, createScrubberControls, createZoomControls } from "./controls";
import "./index.css";
import { fillQubitLocations, Layout } from "./layout";

const machineLayout = {
  cols: 16,
  readoutRows: 2,
  interactionRows: 1,
  storageRows: 16,
}

function render() {
  // Render the layout
  const qubits = fillQubitLocations(4, 6, 3);
  const layout = new Layout(machineLayout, qubits);

  const zoomControls = createZoomControls();
  zoomControls.classList.add("minpage-toolbar-left");

  const playerControls = createPlayerControls();
  const scrubberControls = createScrubberControls()

  const toolstrip = document.body.querySelector(".minpage-toolstrip") as HTMLDivElement;
  toolstrip.appendChild(zoomControls);
  toolstrip.appendChild(scrubberControls);
  toolstrip.appendChild(playerControls);


  const zones = document.body.querySelector(".minpage-zones") as HTMLDivElement;
  zones.appendChild(layout.container);

  // Wire up the controls
  const app: HTMLDivElement = document.getElementById("app") as HTMLDivElement;
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
    const newWidth = (layout.width * layout.scale) + 32;
    newWidth > 600 ? app.style.width = `${newWidth}px` : app.style.width = "600px";
  }

  zoomIn.addEventListener("click", () => {
    layout.zoomIn();
    setAppWidth();
  });
  zoomOut.addEventListener("click", () => {
    layout.zoomOut();
    setAppWidth();
  });

  next.addEventListener("click", () => {
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
  });
  prev.addEventListener("click", () => {
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
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Set the theme if explicitly provided
  const urlParams = new URLSearchParams(window.location.search);
  const theme = urlParams.get("theme");
  if (theme) {
    document.body.setAttribute("data-theme", theme);
  }
  render();
});
