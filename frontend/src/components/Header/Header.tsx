import constants from '../../constants';
import LoginContainer from '../LoginContainer';

const Header = () => {
    return (
        <header className="header">
            <div className="header_container">
                <div>
                    <h1 className="header-title">
                        <span className="header_logo">
                            <i className="fa-solid fa-utensils"></i>
                        </span>
                        {constants.titleApp}
                    </h1>
                </div>
                <LoginContainer />
            </div>
        </header>
    );
};
export default Header;
