import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage', () => {
    test('renders home page placeholder', () => {
        render(<HomePage />);

        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
});
