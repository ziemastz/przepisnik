import { useNavigate } from '../../../router';
import Button from '../../../shared/button/Button';
import constants from '../../../constants';

interface UserMenuProps {
    onLogout: () => void;
}

const UserMenu = ({ onLogout }: UserMenuProps) => {
    const navigate = useNavigate();

    const handleMyRecipes = () => {
        navigate(constants.routes.myRecipes);
    };

    const handleAddRecipe = () => {
        navigate(constants.routes.recipeNew);
    };

    return (
        <div className="user-menu">
            <Button type="secondary" onClick={handleMyRecipes}>
                {constants.recipes.list.title}
            </Button>
            <Button type="secondary" onClick={handleAddRecipe}>
                {constants.layout.header.addRecipe}
            </Button>
            <Button type="secondary" onClick={onLogout}>
                {constants.layout.header.logout}
            </Button>
        </div>
    );
};

export default UserMenu;
