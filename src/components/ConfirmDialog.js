import './ConfirmDialog.css';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <h2>{title}</h2>
          <button type="button" className="confirm-dialog-close" onClick={onCancel}>
            ✕
          </button>
        </div>
        <div className="confirm-dialog-body">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-footer">
          <button type="button" className="button button-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={isDangerous ? 'button button-danger' : 'button'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
