function isSubmitterInput(target: EventTarget | null) {
  if (!(target instanceof HTMLInputElement)) return false;
  const type = target.type || "text";
  return ["submit", "button", "reset", "checkbox", "radio", "file", "image"].includes(
    type,
  );
}

export function installAdminTypingGuards() {
  function onKeyDown(event: KeyboardEvent) {
    const target = event.target;

    if (event.key === "Enter" && target instanceof HTMLInputElement && !isSubmitterInput(target)) {
      event.preventDefault();
      return;
    }

    if (event.key !== "Backspace" || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    if (!(target instanceof HTMLElement)) return;
    const editable =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable;
    if (!editable) {
      event.preventDefault();
    }
  }

  window.addEventListener("keydown", onKeyDown, true);
  return () => window.removeEventListener("keydown", onKeyDown, true);
}
