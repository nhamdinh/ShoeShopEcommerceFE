import React from "react";

const Message = ({ variant, mess, messText }: any) => {
  return messText ? (
    <div className={`alert ${variant}`}>{messText}</div>
  ) : (
    <div className={`alert ${variant}`}>
      {mess?.data?.message ?? "500 Internal Server Error"}
    </div>
  );
};

Message.defaultProps = {
  variant: "alert-info",
};

export default Message;
