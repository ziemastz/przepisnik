import { useEffect, useRef, useState } from 'react';
import { ingredientsApi, IngredientSuggestion } from '../../../api/ingredientsApi';

interface IngredientAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (name: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    'aria-invalid'?: boolean;
}

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 1;

const IngredientAutocomplete = ({
    value,
    onChange,
    onSelect,
    disabled,
    placeholder,
    className,
    'aria-invalid': ariaInvalid,
}: IngredientAutocompleteProps) => {
    const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (value.trim().length < MIN_QUERY_LENGTH) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const results = await ingredientsApi.searchIngredients(value.trim());
                setSuggestions(results);
                setIsOpen(results.length > 0);
                setActiveIndex(-1);
            } catch {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, DEBOUNCE_MS);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (name: string) => {
        onSelect(name);
        setIsOpen(false);
        setSuggestions([]);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleSelect(suggestions[activeIndex].name);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setActiveIndex(-1);
        }
    };

    return (
        <div ref={wrapperRef} className="ingredient-autocomplete-wrapper">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={className}
                aria-invalid={ariaInvalid}
                aria-autocomplete="list"
                aria-expanded={isOpen}
                autoComplete="off"
                disabled={disabled}
            />
            {isOpen && (
                <ul
                    className="ingredient-suggestions"
                    role="listbox"
                >
                    {suggestions.map((s, index) => (
                        <li
                            key={s.id}
                            role="option"
                            aria-selected={index === activeIndex}
                            className={`ingredient-suggestion-item${index === activeIndex ? ' ingredient-suggestion-item--active' : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelect(s.name);
                            }}
                        >
                            {s.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default IngredientAutocomplete;
