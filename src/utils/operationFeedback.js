export function notifyOperation(type, message) {
  if (typeof window === 'undefined' || !message) return;
  window.dispatchEvent(new CustomEvent('operation-feedback', {
    detail: { type, message },
  }));
}
