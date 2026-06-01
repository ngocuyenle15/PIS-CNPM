import React, { useState, useEffect, useRef } from 'react';

/**
 * Custom SearchableSelect Dropdown Component
 *
 * @param {Array} options - List of select options (objects)
 * @param {String|Number} value - Selected option value (ID/Key)
 * @param {Function} onChange - Callback function triggered on option select
 * @param {String} placeholder - Placeholder text
 * @param {String} idKey - Unique key field in option object (default: 'id')
 * @param {String} nameKey - Display name field in option object (default: 'name')
 * @param {Boolean} disabled - Disable interaction
 */
function SearchableSelect({
  options = [],
  value = '',
  onChange,
  placeholder = 'Chọn...',
  idKey = 'id',
  nameKey = 'name',
  disabled = false,
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Reset search term when dropdown opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Helper to remove Vietnamese accents for fuzzy searching
  const removeAccents = (str) => {
    return str
      ? str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
      : '';
  };

  // Find currently selected option
  const selectedOption = options.find(opt => opt[idKey] === value);

  // Filter options based on search term
  const filteredOptions = options.filter(opt => {
    const name = opt[nameKey] ? String(opt[nameKey]) : '';
    const normName = removeAccents(name);
    const normSearch = removeAccents(searchTerm);
    return normName.includes(normSearch);
  });

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionVal) => {
    if (onChange) {
      onChange(optionVal);
    }
    setIsOpen(false);
  };

  return (
    <div className="searchable-select-container" ref={containerRef} style={{ zIndex: isOpen ? 100 : 1 }}>
      {/* Trigger Button */}
      <div
        className={`searchable-select-trigger ${disabled ? 'disabled' : ''} ${isOpen ? 'active' : ''}`}
        style={style}
        onClick={handleToggle}
      >
        <span className={selectedOption ? 'selected-text' : 'placeholder-text'}>
          {selectedOption ? selectedOption[nameKey] : placeholder}
        </span>
        <span className="searchable-select-arrow" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="searchable-select-dropdown">
          {/* Search Input */}
          <input
            type="text"
            className="searchable-select-search-input"
            placeholder="Gõ để tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on input click
          />

          {/* Options List */}
          <ul className="searchable-select-options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const optVal = opt[idKey];
                const isSelected = optVal === value;
                return (
                  <li
                    key={optVal}
                    className={`searchable-select-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(optVal)}
                  >
                    {opt[nameKey]}
                  </li>
                );
              })
            ) : (
              <li className="searchable-select-no-results">Không tìm thấy kết quả</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
