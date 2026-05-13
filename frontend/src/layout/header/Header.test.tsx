import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import constants from '../../constants';

jest.mock('./userPanel/UserPanelContainer', () => ({
    __esModule: true,
    default: () => <div>User Panel Mock</div>,
}));

jest.mock('../../router', () => ({
    Link: ({ to, children, className }: { to: string; children: ReactNode; className?: string }) => (
        <a href={to} className={className}>
            {children}
        </a>
    ),
}));

describe('Header', () => {
    test('shows application title and user panel container', () => {
        render(<Header />);

        expect(screen.getByRole('banner')).toHaveTextContent(constants.titleApp);
        expect(screen.getByText('User Panel Mock')).toBeInTheDocument();
    });

    test('renders a link to the home page', () => {
        render(<Header />);

        const homeLink = screen.getByRole('link', { name: new RegExp(constants.titleApp, 'i') });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', constants.routes.home);
    });

    test('home link has the correct CSS class', () => {
        render(<Header />);

        const homeLink = screen.getByRole('link', { name: new RegExp(constants.titleApp, 'i') });
        expect(homeLink).toHaveClass('header-title__link');
    });
});
