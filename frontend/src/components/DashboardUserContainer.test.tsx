import { render, screen } from '@testing-library/react';
import DashboardUserContainer from './DashboardUserContainer';

describe('DashboardUserContainer', () => {
    test('shows user menu when user is marked as logged in', () => {
        render(<DashboardUserContainer />);

        expect(screen.getByText('User Menu')).toBeInTheDocument();
    });
});
