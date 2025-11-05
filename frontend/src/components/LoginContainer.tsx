import LoginButtons from './LoginButtons';
import UserMenu from './UserMenu';

const LoginContainer = () => {
    // Temporary hardcoded login state
    const isLoggedIn = true;

    return isLoggedIn ? <UserMenu /> : <LoginButtons />;
};
export default LoginContainer;
