import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import constants from './constants';
import App from './App';

jest.mock('./layout/header/Header', () => ({
    __esModule: true,
    default: () => {
        const mockConstants = jest.requireActual('./constants').default;
        return <header role="banner">{mockConstants.titleApp}</header>;
    },
}));

jest.mock('./layout/footer/Footer', () => ({
    __esModule: true,
    default: () => {
        const mockConstants = jest.requireActual('./constants').default;
        return <footer role="contentinfo">{mockConstants.footer.rightsText}</footer>;
    },
}));

jest.mock('./router', () => ({
    BrowserRouter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Routes: ({ children }: { children: ReactNode }) => <>{children}</>,
    Route: ({ element }: { element: ReactNode }) => <>{element}</>,
    Navigate: () => null,
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/', state: null }),
}));

describe('App Component', () => {
    test('renders header, main content, and footer', () => {
        render(<App />);

        expect(screen.getByRole('banner')).toHaveTextContent(constants.titleApp);
        expect(screen.getByRole('main')).toHaveTextContent('Home Page');
        expect(screen.getByRole('contentinfo')).toHaveTextContent(constants.footer.rightsText);
    });
});
