import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
    // Set the theme if explicitly provided
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get("theme");
    if (theme) {
      document.body.setAttribute("data-theme", theme);
    }
});
