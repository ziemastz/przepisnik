import { fireEvent, render, screen } from '@testing-library/react';
import UserMenu from './UserMenu';

const mockNavigate = jest.fn();

jest.mock('../../../router', () => ({
    useNavigate: () => mockNavigate,
}));

describe('UserMenu', () => {
    beforeEach(() => {
        mockNavigate.mockReset();
    });

    test('renders all menu buttons', () => {
        const onLogout = jest.fn();
        render(<UserMenu onLogout={onLogout} />);

        expect(screen.getByRole('button', { name: 'Moje przepisy' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '+ Przepis' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Wyloguj' })).toBeInTheDocument();
    });

    test('calls logout handler when logout button is clicked', () => {
        const onLogout = jest.fn();
        render(<UserMenu onLogout={onLogout} />);

        fireEvent.click(screen.getByRole('button', { name: 'Wyloguj' }));

        expect(onLogout).toHaveBeenCalledTimes(1);
    });

    test('navigates to my recipes when button is clicked', () => {
        const onLogout = jest.fn();
        render(<UserMenu onLogout={onLogout} />);

        fireEvent.click(screen.getByRole('button', { name: 'Moje przepisy' }));

        expect(mockNavigate).toHaveBeenCalledWith('/my-recipes');
    });

    test('navigates to recipe form when add recipe button is clicked', () => {
        const onLogout = jest.fn();
        render(<UserMenu onLogout={onLogout} />);

        fireEvent.click(screen.getByRole('button', { name: '+ Przepis' }));

        expect(mockNavigate).toHaveBeenCalledWith('/recipes/new');
    });
});
