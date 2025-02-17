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

  zoomIn.addEventListener("click", () => layout.zoomIn());
  zoomOut.addEventListener("click", () => layout.zoomOut());

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
