import { MouseEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    useEffect(() => {
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflow;
        };
    }, []);

    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget && onCancel && !isLoading) {
            onCancel();
        }
    };

    return createPortal(
        <div className="dialog-backdrop" role="presentation" onClick={handleBackdropClick}>
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
        </div>,
        document.body,
    );
};

export default InfoDialog;
