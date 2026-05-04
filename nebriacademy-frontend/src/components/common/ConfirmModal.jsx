import useModalStore from "../../store/modalStore";


const ConfirmModal = () => {
  const { isOpen, title, message, confirm, cancel } = useModalStore();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={cancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={cancel}>
            Cancelar
          </button>
          <button className="modal-btn confirm" onClick={confirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
