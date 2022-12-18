import React from "react";
import { ModalContainer } from "./ModalContainer";

export type Props = React.InsHTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  entity?: any;
  container?: any;
  containerProps?: any;
  loading?: boolean;
};

export const Modal = ({
  entity,
  open = false,
  onClose = () => {},
  container: Container = ModalContainer,
  containerProps = {},
  children,
  loading,
  ...props
}: Props) => {
  const title = (entity?.id && "Edit") || "Create";
  return (
    <div {...props} style={{ display: open ? "flex" : "none" }}>
      <Container className="modal-container" {...containerProps}>
        <div className="modal-header">{loading ? 'Loading ...' : title}</div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="modal-button-save" type="submit" disabled={loading}>
            Save
          </button>
          <button
            className="modal-button-close"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <div className="clearfix" />
        </div>
      </Container>
    </div>
  );
};

export default Modal;
