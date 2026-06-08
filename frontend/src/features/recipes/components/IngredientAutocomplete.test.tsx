import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import IngredientAutocomplete from './IngredientAutocomplete';
import * as ingredientsApi from '../../../api/ingredientsApi';

jest.mock('../../../api/ingredientsApi', () => ({
    ingredientsApi: {
        searchIngredients: jest.fn(),
    },
}));

const searchMock = ingredientsApi.ingredientsApi.searchIngredients as jest.MockedFunction<
    typeof ingredientsApi.ingredientsApi.searchIngredients
>;

const defaultProps = {
    value: '',
    onChange: jest.fn(),
    onSelect: jest.fn(),
    placeholder: 'Nazwa składnika',
};

beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
});

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
});

describe('IngredientAutocomplete', () => {
    test('renders input with placeholder', () => {
        render(<IngredientAutocomplete {...defaultProps} />);
        expect(screen.getByPlaceholderText('Nazwa składnika')).toBeInTheDocument();
    });

    test('does not call API when value is empty', async () => {
        render(<IngredientAutocomplete {...defaultProps} value="" />);
        act(() => jest.runAllTimers());
        expect(searchMock).not.toHaveBeenCalled();
    });

    test('calls API after debounce when value is provided', async () => {
        searchMock.mockResolvedValue([{ id: '1', name: 'Mąka' }]);

        render(<IngredientAutocomplete {...defaultProps} value="mą" />);
        act(() => jest.runAllTimers());

        await waitFor(() => expect(searchMock).toHaveBeenCalledWith('mą'));
    });

    test('displays suggestions returned by API', async () => {
        searchMock.mockResolvedValue([
            { id: '1', name: 'Mąka' },
            { id: '2', name: 'Masło' },
        ]);

        render(<IngredientAutocomplete {...defaultProps} value="ma" />);
        act(() => jest.runAllTimers());

        expect(await screen.findByText('Mąka')).toBeInTheDocument();
        expect(await screen.findByText('Masło')).toBeInTheDocument();
    });

    test('calls onSelect and closes list when suggestion is clicked', async () => {
        const onSelect = jest.fn();
        searchMock.mockResolvedValue([{ id: '1', name: 'Mąka' }]);

        render(<IngredientAutocomplete {...defaultProps} value="mą" onSelect={onSelect} />);
        act(() => jest.runAllTimers());

        await screen.findByText('Mąka');

        fireEvent.mouseDown(screen.getByText('Mąka'));

        expect(onSelect).toHaveBeenCalledWith('Mąka');
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('navigates suggestions with ArrowDown/ArrowUp keys', async () => {
        searchMock.mockResolvedValue([
            { id: '1', name: 'Mąka' },
            { id: '2', name: 'Masło' },
        ]);

        render(<IngredientAutocomplete {...defaultProps} value="ma" />);
        act(() => jest.runAllTimers());

        await screen.findByText('Mąka');

        const input = screen.getByPlaceholderText('Nazwa składnika');
        const flourOption = screen.getByRole('option', { name: 'Mąka' });
        const butterOption = screen.getByRole('option', { name: 'Masło' });

        fireEvent.keyDown(input, { key: 'ArrowDown' });
        expect(flourOption).toHaveAttribute('aria-selected', 'true');

        fireEvent.keyDown(input, { key: 'ArrowDown' });
        expect(butterOption).toHaveAttribute('aria-selected', 'true');

        fireEvent.keyDown(input, { key: 'ArrowUp' });
        expect(flourOption).toHaveAttribute('aria-selected', 'true');
    });

    test('selects active suggestion on Enter and closes list', async () => {
        const onSelect = jest.fn();
        searchMock.mockResolvedValue([{ id: '1', name: 'Mąka' }]);

        render(<IngredientAutocomplete {...defaultProps} value="mą" onSelect={onSelect} />);
        act(() => jest.runAllTimers());

        await screen.findByText('Mąka');

        const input = screen.getByPlaceholderText('Nazwa składnika');
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        fireEvent.keyDown(input, { key: 'Enter' });

        expect(onSelect).toHaveBeenCalledWith('Mąka');
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('closes list on Escape key', async () => {
        searchMock.mockResolvedValue([{ id: '1', name: 'Mąka' }]);

        render(<IngredientAutocomplete {...defaultProps} value="mą" />);
        act(() => jest.runAllTimers());

        await screen.findByRole('listbox');

        const input = screen.getByPlaceholderText('Nazwa składnika');
        fireEvent.keyDown(input, { key: 'Escape' });

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('hides suggestions when API returns empty array', async () => {
        searchMock.mockResolvedValue([]);

        render(<IngredientAutocomplete {...defaultProps} value="xyz" />);
        act(() => jest.runAllTimers());

        await waitFor(() => expect(searchMock).toHaveBeenCalled());
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('hides suggestions when API throws an error', async () => {
        searchMock.mockRejectedValue(new Error('network error'));

        render(<IngredientAutocomplete {...defaultProps} value="err" />);
        act(() => jest.runAllTimers());

        await waitFor(() => expect(searchMock).toHaveBeenCalled());
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('input is disabled when disabled prop is true', () => {
        render(<IngredientAutocomplete {...defaultProps} disabled />);
        expect(screen.getByPlaceholderText('Nazwa składnika')).toBeDisabled();
    });

    test('input has aria-invalid when aria-invalid prop is true', () => {
        render(<IngredientAutocomplete {...defaultProps} aria-invalid />);
        expect(screen.getByPlaceholderText('Nazwa składnika')).toHaveAttribute('aria-invalid', 'true');
    });

    test('calls onChange when user types', () => {
        const onChange = jest.fn();
        render(<IngredientAutocomplete {...defaultProps} onChange={onChange} />);
        fireEvent.change(screen.getByPlaceholderText('Nazwa składnika'), {
            target: { value: 'sol' },
        });
        expect(onChange).toHaveBeenCalledWith('sol');
    });
});
