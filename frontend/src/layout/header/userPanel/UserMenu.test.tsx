import { fireEvent, render, screen } from '@testing-library/react';
import UserMenu from './UserMenu';

describe('UserMenu', () => {
    test('calls logout handler', () => {
        const onLogout = jest.fn();
        render(<UserMenu onLogout={onLogout} />);

        fireEvent.click(screen.getByRole('button', { name: 'Wyloguj' }));

        expect(onLogout).toHaveBeenCalledTimes(1);
    });
});
