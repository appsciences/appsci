const sections = [...document.querySelectorAll("[data-path]")];
const pathLabel = document.getElementById("cwd");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let selected = -1;

function select(index, move = false) {
  selected = (index + sections.length) % sections.length;
  sections.forEach((section, i) =>
    section.classList.toggle("cur", i === selected),
  );
  pathLabel.textContent = sections[selected].dataset.path;
  if (move) {
    sections[selected].scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
      block: "start",
    });
    sections[selected].focus({ preventScroll: true });
  }
}

document.addEventListener("keydown", (event) => {
  if (
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey ||
    event.target.closest(
      "a, button, input, textarea, select, summary, [contenteditable]",
    )
  )
    return;
  if (event.key === "j" || event.key === "k") {
    event.preventDefault();
    select(
      event.key === "j"
        ? selected + 1
        : selected < 0
          ? sections.length - 1
          : selected - 1,
      true,
    );
  } else if (/^[1-9]$/.test(event.key)) {
    event.preventDefault();
    select(Number(event.key) - 1, true);
  }
});

const observer = new IntersectionObserver(
  () => {
    const focusLine = window.innerHeight * 0.4;
    const active = sections.findIndex((section) => {
      const box = section.getBoundingClientRect();
      return box.top <= focusLine && box.bottom > focusLine;
    });
    if (active >= 0 && active !== selected) select(active);
  },
  { threshold: [0, 0.25, 0.5, 0.75, 1] },
);
sections.forEach((section) => observer.observe(section));
