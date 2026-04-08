import { fireEvent, render, screen } from '@testing-library/react';
import InfoDialog from './InfoDialog';

describe('InfoDialog', () => {
    test('renders title, message, and confirm button', () => {
        render(
            <InfoDialog
                title="Konto utworzone"
                message="Mozesz przejsc do logowania."
                confirmLabel="Przejdz do logowania"
                onConfirm={jest.fn()}
            />,
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Konto utworzone' })).toBeInTheDocument();
        expect(screen.getByText('Mozesz przejsc do logowania.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Przejdz do logowania' })).toBeInTheDocument();
    });

    test('calls confirm handler', () => {
        const onConfirm = jest.fn();

        render(
            <InfoDialog
                title="Konto utworzone"
                message="Mozesz przejsc do logowania."
                confirmLabel="Przejdz do logowania"
                onConfirm={onConfirm}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Przejdz do logowania' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
});
