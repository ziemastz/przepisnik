import { useNavigate } from '../../../router';
import Button from '../../../shared/button/Button';

interface UserMenuProps {
    onLogout: () => void;
}

const UserMenu = ({ onLogout }: UserMenuProps) => {
    const navigate = useNavigate();

    const handleMyRecipes = () => {
        navigate('/my-recipes');
    };

    const handleAddRecipe = () => {
        navigate('/recipes/new');
    };

    return (
        <div className="user-menu">
            <Button type="secondary" onClick={handleMyRecipes}>
                Moje przepisy
            </Button>
            <Button type="secondary" onClick={handleAddRecipe}>
                + Przepis
            </Button>
            <Button type="secondary" onClick={onLogout}>
                Wyloguj
            </Button>
        </div>
    );
};

export default UserMenu;
