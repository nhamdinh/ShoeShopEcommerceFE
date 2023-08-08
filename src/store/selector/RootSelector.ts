export const getUserLogin = (state: any) => state.auth.isUserLogin;
export const getRegisterStep = (state: any) => state.auth.step;

// custom dialog for confirm
export const getDialogContent = (state: any) => state.dialog.content;
export const getDialogTitle = (state: any) => state.dialog.title;
export const getDialogStatus = (state: any) => state.dialog.isOpen;
export const getDialogConfirmText = (state: any) => state.dialog.confirmText;
export const getDialogCloseText = (state: any) => state.dialog.closeText;
export const getActionConfirm = (state: any) => state.dialog.actionConfirm;
export const getActionCancel = (state: any) => state.dialog.actionCancel;
export const getDialogType = (state: any) => state.dialog.type;

// custom modal
export const modalStatus = (state: any) => state.modal.isOpen;
export const modalTemplate = (state: any) => state.modal.template;
export const modalData = (state: any) => state.modal.data;
export const modalWidth = (state: any) => state.modal.width;
export const modalHandleAction = (state: any) => state.modal.handleAction;
