import { render, screen } from '@testing-library/react';
import Header from './Header';
import constants from '../../constants';

describe('Header', () => {
    test('shows application title and user menu placeholder', () => {
        render(<Header />);

        expect(screen.getByRole('banner')).toHaveTextContent(constants.titleApp);
        expect(screen.getByText('User Menu')).toBeInTheDocument();
    });
});
