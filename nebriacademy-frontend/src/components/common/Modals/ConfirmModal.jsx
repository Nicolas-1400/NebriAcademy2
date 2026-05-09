import useModalStore from "../../../store/modalStore";

const ConfirmModal = () => {
  const {
    isOpen,
    title,
    message,
    withInput,
    inputValue,
    setInputValue,
    confirm,
    cancel,
  } = useModalStore();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={cancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>

        {withInput && (
          <div className="modal-input-container">
            <textarea
              placeholder="Indica la razón (opcional)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={3}
            />
          </div>
        )}

        <div className="modal-actions">
          <button className="modal-button cancel" onClick={cancel}>
            Cancelar
          </button>
          <button className="modal-button confirm" onClick={confirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
