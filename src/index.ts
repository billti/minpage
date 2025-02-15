import "./index.css";

function render() {
  const app: HTMLDivElement = document.getElementById("app") as HTMLDivElement;

  const next = document.querySelector(
    "[data-control='next']"
  ) as SVGCircleElement;
  const prev = document.querySelector(
    "[data-control='prev']"
  ) as SVGCircleElement;
  const qubit = document.querySelector(".minpage-qubit") as SVGCircleElement;

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
