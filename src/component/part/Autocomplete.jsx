import React, { useState, forwardRef, useImperativeHandle } from "react";

const Autocomplete = forwardRef(
  ({ placeholder = "Search...", fetchData, onSelect, renderLabel = (item) => item.label }, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
      const value = e.target.value;
      setInputValue(value);

      if (value.trim() === "") {
        setFilteredData([]);
        setIsDropdownVisible(false);
      } else {
        setIsLoading(true);
        fetchData(value)
          .then((data) => {
            setFilteredData(data);
            setIsDropdownVisible(true);
          })
          .finally(() => setIsLoading(false));
      }
    };

    useImperativeHandle(ref, () => ({
      resetInput: () => setInputValue(""),
    }));

    const handleSelect = (item) => {
      setInputValue(renderLabel(item));
      setIsDropdownVisible(false);
      if (onSelect) onSelect(item);
    };

    return (
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ref={ref}
        />
        {isLoading && <div className="absolute right-4 top-2 text-gray-500 text-sm">Loading...</div>}
        {isDropdownVisible && (
          <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto z-10">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                >
                  {renderLabel(item)}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
    );
  }
);

export default Autocomplete;
