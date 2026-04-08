import { render, screen } from '@testing-library/react';
import UserPanelContainer from './UserPanelContainer';

describe('UserPanelContainer', () => {
    test('shows user menu when user is marked as logged in', () => {
        render(<UserPanelContainer />);

        expect(screen.getByText('User Menu')).toBeInTheDocument();
    });
});
