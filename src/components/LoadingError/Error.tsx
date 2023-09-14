import React from "react";

const Message = ({ variant, mess }: any) => {
  return (
    <div className={`alert ${variant}`}>
      {mess?.data?.message ?? "500 Internal Server Error"}
    </div>
  );
};

Message.defaultProps = {
  variant: "alert-info",
};

export default Message;
