const toast = document.querySelector(".toast");
let toastTimer;

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
};

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    if (!value) return;
    const link = new URL(value, window.location.href).href;
    try {
      await navigator.clipboard.writeText(link);
      showToast("Owlbear-Installationslink kopiert.");
    } catch {
      window.prompt("Diesen Installationslink kopieren:", link);
    }
  });
});
