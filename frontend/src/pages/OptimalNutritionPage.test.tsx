import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import OptimalNutritionPage from './OptimalNutritionPage';
import constants from '../constants';

jest.mock('../router', () => ({
    Link: ({ to, children, className }: { to: string; children: ReactNode; className?: string }) => (
        <a href={to} className={className}>
            {children}
        </a>
    ),
}));

describe('OptimalNutritionPage', () => {
    test('renders the main title and key sections', () => {
        render(<OptimalNutritionPage />);

        expect(
            screen.getByRole('heading', { level: 1, name: /zasady żywienia optymalnego/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { level: 2, name: /zastosowania diety i przykłady efektów/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { level: 2, name: /parametr żo - obliczenia i przykłady/i }),
        ).toBeInTheDocument();
    });

    test('renders back link to home page', () => {
        render(<OptimalNutritionPage />);

        const backLink = screen.getByRole('link', { name: /wróć do strony głównej/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', constants.routes.home);
    });
});
