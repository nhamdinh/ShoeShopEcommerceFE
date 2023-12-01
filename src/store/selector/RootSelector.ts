export const getUserInfo = (state: any) => state.auth.userInfo;
export const getCartInfo = (state: any) => state.cart.cart;
export const getProductsCart = (state: any) => state.cart.productsCart;
export const getDataProducts = (state: any) => state.cart.dataProducts;

/* order */

export const getCheckedCarts = (state: any) => state.order.checkedCarts;
export const getCheckoutCartsParam = (state: any) =>
  state.order.checkoutCartsParam;

/* order */
// custom dialog for confirm
// custom dialog for confirm
export const getDialogContent = (state: any) => state.dialog.content;
export const getDialogTitle = (state: any) => state.dialog.title;
export const getDialogStatus = (state: any) => state.dialog.isOpen;
export const getDialogMaskClosable = (state: any) => state.dialog.maskClosable;
export const getDialogConfirmText = (state: any) => state.dialog.confirmText;
export const getDialogCloseText = (state: any) => state.dialog.closeText;
export const getActionConfirm = (state: any) => state.dialog.actionConfirm;
export const getActionCancel = (state: any) => state.dialog.actionCancel;
export const getActionAfterClose = (state: any) =>
  state.dialog.actionAfterClose;
export const getDialogType = (state: any) => state.dialog.type;

// custom modal
export const modalStatus = (state: any) => state.modal.isOpen;
export const modalTemplate = (state: any) => state.modal.template;
export const modalData = (state: any) => state.modal.data;
export const modalWidth = (state: any) => state.modal.width;
export const modalHandleAction = (state: any) => state.modal.handleAction;
// toastDialog
export const getToastOpen = (state: any) => state.toastR.isOpen;
export const getToastContent = (state: any) => state.toastR.content;
export const getToastStep = (state: any) => state.toastR.step;
