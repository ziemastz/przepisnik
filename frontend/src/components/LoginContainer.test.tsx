import { render, screen } from '@testing-library/react';
import LoginContainer from './LoginContainer';

describe('LoginContainer', () => {
    test('shows user menu when user is marked as logged in', () => {
        render(<LoginContainer />);

        expect(screen.getByText('User Menu')).toBeInTheDocument();
    });
});
