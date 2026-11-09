// Shared wafiservices portal UI (old Laravel partials), safe to import from client components.
// The server-only layout lives in ./portal-shell (import it from there).
export { DevicePhotoStep } from './device-photo-step';
export { FlashAlert } from './flash-alert';
export { PhoneInput, type PhoneInputHandle } from './phone-input';
export { RequestNumberModal } from './request-number-modal';
export { StepWizard, useJumpToFirstErrorOn, useWizard, WizardDots, WizardProgressText, WizardStep } from './step-wizard';
