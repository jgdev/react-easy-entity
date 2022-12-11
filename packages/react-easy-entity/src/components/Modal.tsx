import React from "react";

export type Props = React.InsHTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  entity?: any;
};

export const Modal = ({
  entity,
  open = false,
  onClose = () => {},
  onSubmit = () => {},
  children,
  ...props
}: Props) => {
  const title = (entity?.id && "Edit") || "Create";
  return (
    <div {...props} style={{ display: open ? "flex" : "none" }}>
      <div className="modal-header">{title}</div>
      <div className="modal-body">{children}</div>
      <div className="modal-footer">
        <button className="modal-button-save" type="submit" onClick={onSubmit}>
          Save
        </button>
        <button className="modal-button-close" onClick={onClose}>
          Cancel
        </button>
        <div className="clearfix" />
      </div>
    </div>
  );
};

export default Modal;
