import Button from '../../../shared/button/Button';

interface UserMenuProps {
    onLogout: () => void;
}

const UserMenu = ({ onLogout }: UserMenuProps) => {
    return (
        <div className="user-menu">
            <Button type="secondary" onClick={onLogout}>
                Wyloguj
            </Button>
        </div>
    );
};

export default UserMenu;
