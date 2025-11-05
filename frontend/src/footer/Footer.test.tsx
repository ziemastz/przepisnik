import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import constants from '../constants';

describe('Footer', () => {
    test('should render rights text from constants', () => {
        render(<Footer />);
        expect(screen.getByText(constants.footer.rightsText)).toBeInTheDocument();
    });

    test('should render Liberapay donate link with correct attributes', () => {
        render(<Footer />);

        const liberapayLink = screen.getByRole('link', {
            name: /donate using liberapay/i,
        });
        expect(liberapayLink).toHaveAttribute('href', 'https://liberapay.com/Tozi/donate');
        expect(liberapayLink).toHaveAttribute('target', '_blank');
        expect(liberapayLink).toHaveAttribute('rel', 'noopener noreferrer');

        const liberapayImg = screen.getByAltText(/donate using liberapay/i);
        expect(liberapayImg).toHaveAttribute(
            'src',
            'https://liberapay.com/assets/widgets/donate.svg',
        );
    });

    test('should render Ko-fi donate link with correct attributes', () => {
        render(<Footer />);

        const kofiLink = screen.getByRole('link', {
            name: /buy me a coffee at ko-fi\.com/i,
        });
        expect(kofiLink).toHaveAttribute('href', 'https://ko-fi.com/P5P71NYXX8');
        expect(kofiLink).toHaveAttribute('target', '_blank');
        expect(kofiLink).toHaveAttribute('rel', 'noopener noreferrer');

        const kofiImg = screen.getByAltText(/buy me a coffee at ko-fi\.com/i);
        expect(kofiImg).toHaveAttribute('src', 'https://storage.ko-fi.com/cdn/kofi6.png?v=6');
        expect(kofiImg).toHaveAttribute('height', '30');
    });

    test('should render both donate images', () => {
        render(<Footer />);
        const images = screen.getAllByRole('img');
        expect(images.length).toBe(2);
    });
});
