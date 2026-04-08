interface ButtonProps {
    children: React.ReactNode;
    type?: 'primary' | 'secondary' | 'dashed' | 'link';
    isDisabled?: boolean;
    tooltip?: string;
    htmlType?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
}

const Button = ({ children, type, isDisabled, tooltip, htmlType = 'button', onClick }: ButtonProps) => {
    return (
        <button
            type={htmlType}
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
