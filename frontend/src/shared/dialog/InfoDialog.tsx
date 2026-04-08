import Button from '../button/Button';

interface InfoDialogProps {
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
}

const InfoDialog = ({ title, message, confirmLabel, onConfirm }: InfoDialogProps) => {
    return (
        <div className="dialog-backdrop" role="presentation">
            <div className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
                <h3 id="dialog-title">{title}</h3>
                <p>{message}</p>
                <Button type="primary" onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};

export default InfoDialog;
