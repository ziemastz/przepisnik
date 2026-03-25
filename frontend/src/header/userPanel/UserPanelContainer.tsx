import constants from '../../constants';
import Button from '../../shared/button/Button';
import UserMenu from './UserMenu';

const UserPanelContainer = () => {
    // Temporary hardcoded login state
    const isLoggedIn = true;

    const loginConatiner = (
        <>
            <Button type="primary">Log In</Button>
            <Button type="secondary">Register</Button>
        </>
    );

    const userMenuContainer =
    <>
        <div className='login-item'>{constants.dashboardUser.welcomeText}</div>
        <div className='login-item'><UserMenu /></div>
    </>
    const container = isLoggedIn ? userMenuContainer : loginConatiner;

    return <div className="login-container">{container}</div>;
};
export default UserPanelContainer;
