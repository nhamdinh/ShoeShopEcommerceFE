import React from "react";

const Message = ({ variant, mess }:any) => {
  return <div className={`alert ${variant}`}>{mess}</div>;
};

Message.defaultProps = {
  variant: "alert-info",
};

export default Message;
