const INSPECTOR_STATE_EVENT = 'bhumivera:inspector-state';
const INSPECTOR_SIZE_THRESHOLD = 160;

let installed = false;
let inspectorDetected = false;

const detectInspector = () => {
  if (typeof window === 'undefined') return false;

  return (
    Math.abs(window.outerWidth - window.innerWidth) > INSPECTOR_SIZE_THRESHOLD ||
    Math.abs(window.outerHeight - window.innerHeight) > INSPECTOR_SIZE_THRESHOLD
  );
};

export const isInspectorDetected = () => inspectorDetected;

export const installRuntimeShield = () => {
  if (typeof window === 'undefined' || installed) return;
  installed = true;

  const updateInspectorState = () => {
    const active = detectInspector();
    if (active === inspectorDetected) return;

    inspectorDetected = active;
    window.dispatchEvent(new CustomEvent(INSPECTOR_STATE_EVENT, {
      detail: { active },
    }));
  };

  window.addEventListener('resize', updateInspectorState);
  window.addEventListener('orientationchange', updateInspectorState);
  updateInspectorState();
};
