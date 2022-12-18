import React from "react";

export const ModalContainer = ({ children, formRef, ...props }) => {
  return (
    <form ref={formRef} {...props}>
      {children}
    </form>
  );
};
