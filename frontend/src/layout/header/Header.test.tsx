import { render, screen } from '@testing-library/react';
import Header from './Header';
import constants from '../../constants';

jest.mock('./userPanel/UserPanelContainer', () => ({
    __esModule: true,
    default: () => <div>User Panel Mock</div>,
}));

describe('Header', () => {
    test('shows application title and user panel container', () => {
        render(<Header />);

        expect(screen.getByRole('banner')).toHaveTextContent(constants.titleApp);
        expect(screen.getByText('User Panel Mock')).toBeInTheDocument();
    });
});
