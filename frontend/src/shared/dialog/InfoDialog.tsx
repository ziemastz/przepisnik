import Button from '../button/Button';

interface InfoDialogProps {
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

const InfoDialog = ({ title, message, confirmLabel, onConfirm, onCancel, isLoading }: InfoDialogProps) => {
    return (
        <div className="dialog-backdrop" role="presentation">
            <div className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
                <h3 id="dialog-title">{title}</h3>
                <p>{message}</p>
                <div className="dialog-buttons">
                    <Button type="primary" onClick={onConfirm} isDisabled={isLoading}>
                        {confirmLabel}
                    </Button>
                    {onCancel && (
                        <Button type="secondary" onClick={onCancel} isDisabled={isLoading}>
                            Anuluj
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfoDialog;
