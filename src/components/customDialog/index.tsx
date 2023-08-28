import "./style.scss";
import { Button, Modal } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getActionCancel,
  getActionConfirm,
  getDialogCloseText,
  getDialogConfirmText,
  getDialogContent,
  getDialogStatus,
  getDialogTitle,
  getDialogType,
  getActionAfterClose,
  getDialogMaskClosable,
} from "../../store/selector/RootSelector";
import { closeDialog } from "../../store/components/customDialog/dialogSlice";

export default function CustomDialog() {
  const isOpen = useSelector(getDialogStatus);
  const maskClosable = useSelector(getDialogMaskClosable);
  const type = useSelector(getDialogType);
  const dialogContent = useSelector(getDialogContent);
  const dialogTitle = useSelector(getDialogTitle);
  const dialogConfirmText = useSelector(getDialogConfirmText);
  const dialogCloseText = useSelector(getDialogCloseText);
  const dialogActionConfirm = useSelector(getActionConfirm);
  const dialogActionCancel = useSelector(getActionCancel);
  const dialogActionAfterClose = useSelector(getActionAfterClose);

  const dispatch = useDispatch<any>();
  const handleClose = () => {
    if (type === "info") {
      dialogActionConfirm();
    }
    dispatch(closeDialog());
  };

  const handleConfirm = () => {
    dialogActionConfirm();
    dispatch(closeDialog());
  };

  const handleCancel = () => {
    dialogActionCancel();
    dispatch(closeDialog());
  };
  const handleAfterClose = () => {
    dialogActionAfterClose();
  };
  return (
    <Modal
      title=""
      open={isOpen}
      onCancel={handleClose}
      closable={false}
      okText="Confirm"
      cancelText="Cancel"
      footer={null}
      maskClosable={maskClosable}
      centered={true}
      className="custom-dialog"
      afterClose={handleAfterClose}
    >
      {type === "info" ? (
        <div className="dialog-info">
          <div className="content">{dialogContent}</div>
          <div className="footer" onClick={handleConfirm}>
            {dialogConfirmText}
          </div>
        </div>
      ) : type === "logout" ? (
        <div className="dialog-confirm-logout">
          <div className="body-wrapper">
            <div className="title">{dialogTitle}</div>
            <div className="content">{dialogContent}</div>
          </div>
          <div className="row-wrapper">
            <div className="base-btn" onClick={handleCancel}>
              <div className="btn-text color-cancel">{dialogCloseText}</div>
            </div>
            <div className="base-btn" onClick={handleConfirm}>
              <div className="btn-text">{dialogConfirmText}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="dialog-confirm">
          <div className="title">{dialogTitle}</div>
          <div className="content">{dialogContent}</div>
          <div className="btns">
            <Button className="bt-cancel" onClick={handleCancel}>
              {dialogCloseText}
            </Button>
            <Button className="bt-confirm" onClick={handleConfirm}>
              {dialogConfirmText}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
