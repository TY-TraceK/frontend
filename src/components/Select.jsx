import './Select.css';

import { useEffect, useRef, useState } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react';

function Select({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!selectRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`select relative ${isOpen ? 'open' : ''}`} ref={selectRef}>
      <button
        type="button"
        className="select-trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span>{value}</span>

        <span className="icon">
          <CaretDownIcon />
        </span>
      </button>

      {isOpen && (
        <ul className="select-options">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={option === value ? 'active' : ''}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
