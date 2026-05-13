import constants from '../../constants';
import { Link } from '../../router';
import UserPanelContainer from './userPanel/UserPanelContainer';

const Header = () => {
    return (
        <header className="header">
            <div className="header_container">
                <div>
                    <h1 className="header-title">
                        <Link to={constants.routes.home} className="header-title__link">
                            <span className="header_logo">
                                <i className="fa-solid fa-utensils"></i>
                            </span>
                            {constants.titleApp}
                        </Link>
                    </h1>
                </div>
                <nav className="header-nav">
                    <Link to={constants.routes.ingredients} className="header-nav-link">
                        {constants.layout.header.ingredients}
                    </Link>
                </nav>
                <UserPanelContainer />
            </div>
        </header>
    );
};

export default Header;
