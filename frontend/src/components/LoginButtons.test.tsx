import { render, screen } from '@testing-library/react';
import LoginButtons from './LoginButtons';

describe('LoginButtons', () => {
    test('renders login call to action placeholder', () => {
        render(<LoginButtons />);

        expect(screen.getByText('Login Buttons')).toBeInTheDocument();
    });
});
