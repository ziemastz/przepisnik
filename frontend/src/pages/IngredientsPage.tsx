import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { ingredientsApi, IngredientListResponse } from '../api/ingredientsApi';
import constants from '../constants';
import IngredientDialog from '../features/ingredients/IngredientDialog';
import '../styles/ingredients.css';

const IngredientsPage = () => {
    const { isAuthenticated } = useAuth();
    const [ingredients, setIngredients] = useState<IngredientListResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const fetchIngredients = useCallback((page: number, search: string) => {
        if (abortRef.current) {
            abortRef.current.abort();
        }
        abortRef.current = new AbortController();
        setLoading(true);
        setError(null);

        ingredientsApi
            .listIngredients(page, search || undefined)
            .then((data) => {
                setIngredients(data);
                setLoading(false);
            })
            .catch(() => {
                setError(constants.ingredients.list.loadError);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchIngredients(0, '');
        setCurrentPage(0);
        setInputValue('');
        setActiveSearch('');
    }, [fetchIngredients]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        setActiveSearch(trimmed);
        setCurrentPage(0);
        fetchIngredients(0, trimmed);
    };

    const handleClear = () => {
        setInputValue('');
        setActiveSearch('');
        setCurrentPage(0);
        fetchIngredients(0, '');
    };

    const handleNextPage = () => {
        if (ingredients && currentPage < ingredients.totalPages - 1) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchIngredients(nextPage, activeSearch);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            fetchIngredients(prevPage, activeSearch);
        }
    };

    const handleAddClick = () => {
        setEditingId(null);
        setShowDialog(true);
    };

    const handleEditClick = (id: string) => {
        setEditingId(id);
        setShowDialog(true);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
        setEditingId(null);
    };

    const handleDialogSave = () => {
        handleDialogClose();
        fetchIngredients(currentPage, activeSearch);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        
        setDeleting(true);
        try {
            await ingredientsApi.deleteIngredient(deleteId);
            setDeleteId(null);
            fetchIngredients(currentPage, activeSearch);
        } catch (err) {
            setError(constants.ingredients.list.deleteError);
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteId(null);
    };

    const formatBTW = (value: number | null | undefined): string => {
        if (value === null || value === undefined) {
            return constants.ingredients.list.noData;
        }
        return value.toFixed(2);
    };

    const isEmpty = !loading && !error && (!ingredients || ingredients.items.length === 0);
    const showPagination = ingredients && ingredients.totalPages > 1;

    return (
        <div className="ingredients-page">
            <div className="ingredients-header">
                <h1>{constants.ingredients.list.title}</h1>
                {isAuthenticated && (
                    <button
                        className="button primary"
                        onClick={handleAddClick}
                        aria-label={constants.ingredients.list.addButton}
                    >
                        {constants.ingredients.list.addButton}
                    </button>
                )}
            </div>

            <form className="ingredients-search-form" onSubmit={handleSearch} role="search">
                <div className="ingredients-search-input-wrapper">
                    <input
                        type="search"
                        className="ingredients-search-input"
                        placeholder={constants.ingredients.list.searchPlaceholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        aria-label={constants.ingredients.list.searchPlaceholder}
                    />
                    {inputValue && (
                        <button
                            type="button"
                            className="ingredients-search-clear"
                            onClick={handleClear}
                            aria-label={constants.ingredients.list.clearButton}
                        >
                            ×
                        </button>
                    )}
                </div>
                <button type="submit" className="button primary ingredients-search-btn">
                    {constants.ingredients.list.searchButton}
                </button>
            </form>

            {loading && (
                <p className="ingredients-status-text">{constants.ingredients.list.loading}</p>
            )}
            {error && (
                <p className="ingredients-error">{error}</p>
            )}
            {isEmpty && (
                <p className="ingredients-status-text">
                    {activeSearch ? constants.ingredients.list.emptySearch : constants.ingredients.list.empty}
                </p>
            )}

            {!loading && !error && ingredients && ingredients.items.length > 0 && (
                <>
                    <div className="ingredients-table-wrapper">
                        <table className="ingredients-table">
                            <thead>
                                <tr>
                                    <th rowSpan={2}>{constants.ingredients.list.ingredientColumn}</th>
                                    <th colSpan={3} className="btw-group-header">{constants.ingredients.list.btw}</th>
                                    {isAuthenticated && (
                                        <th
                                            rowSpan={2}
                                            className="actions-header"
                                            aria-label={constants.ingredients.list.actionsColumn}
                                        />
                                    )}
                                </tr>
                                <tr>
                                    <th className="btw-header">{constants.ingredients.list.protein}</th>
                                    <th className="btw-header">{constants.ingredients.list.fat}</th>
                                    <th className="btw-header">{constants.ingredients.list.carbohydrates}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredients.items.map((ingredient) => (
                                    <tr key={ingredient.id} className="ingredient-row">
                                        <td className="ingredient-name">{ingredient.name}</td>
                                        <td className="btw-cell">{formatBTW(ingredient.protein)}</td>
                                        <td className="btw-cell">{formatBTW(ingredient.fat)}</td>
                                        <td className="btw-cell">{formatBTW(ingredient.carbohydrates)}</td>
                                        {isAuthenticated && (
                                            <td className="actions-cell">
                                                <button
                                                    className="button text-button"
                                                    onClick={() => handleEditClick(ingredient.id)}
                                                    aria-label={constants.ingredients.list.editButton}
                                                >
                                                    {constants.ingredients.list.editButton}
                                                </button>
                                                <button
                                                    className="button text-button text-button--danger"
                                                    onClick={() => handleDeleteClick(ingredient.id)}
                                                    aria-label={constants.ingredients.list.deleteButton}
                                                >
                                                    {constants.ingredients.list.deleteButton}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {showPagination && (
                        <div className="pagination">
                            <button
                                className="button"
                                onClick={handlePrevPage}
                                disabled={currentPage === 0}
                                aria-label={constants.ingredients.list.paginationPrev}
                            >
                                {constants.ingredients.list.paginationPrev}
                            </button>
                            <span className="pagination-info">
                                {currentPage + 1} {constants.ingredients.list.paginationOf} {ingredients.totalPages}
                            </span>
                            <button
                                className="button"
                                onClick={handleNextPage}
                                disabled={currentPage >= ingredients.totalPages - 1}
                                aria-label={constants.ingredients.list.paginationNext}
                            >
                                {constants.ingredients.list.paginationNext}
                            </button>
                        </div>
                    )}
                </>
            )}

            {showDialog && (
                <IngredientDialog
                    ingredientId={editingId}
                    onClose={handleDialogClose}
                    onSave={handleDialogSave}
                />
            )}

            {deleteId && (
                <div className="modal-overlay" onClick={handleCancelDelete}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <h2>{constants.ingredients.list.deleteDialogTitle}</h2>
                        <p>
                            {constants.ingredients.list.deleteDialogMessage.replace(
                                '{name}',
                                ingredients?.items.find((i) => i.id === deleteId)?.name || ''
                            )}
                        </p>
                        <div className="modal-actions">
                            <button
                                className="button secondary"
                                onClick={handleCancelDelete}
                                disabled={deleting}
                            >
                                {constants.titleApp}
                            </button>
                            <button
                                className="button danger"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? constants.ingredients.list.deleting : constants.ingredients.list.deleteConfirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IngredientsPage;
