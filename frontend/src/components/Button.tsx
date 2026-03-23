interface ButtonProps {
    children: React.ReactNode;
    type?: 'primary' | 'secondary' | 'dashed' | 'link';
    isDisabled?: boolean;
    tooltip?: string;

    onClick?: () => void;
}

const Button = ({ children, type, isDisabled, tooltip, onClick }: ButtonProps) => {
    return (
        <button
            className={`button ${type}`}
            disabled={isDisabled}
            onClick={onClick}
            title={tooltip}
        >
            {children}
        </button>
    );
};

export default Button;
