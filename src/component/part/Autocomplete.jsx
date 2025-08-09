import React, { useState, forwardRef, useImperativeHandle } from "react";

const Autocomplete = forwardRef(
  (
    {
      label = "",
      forInput,
      placeholder = "Search...",
      fetchData,
      onSelect,
      renderLabel = (item) => item.label,
      isRequired = false,
      isDisabled = false,
      errorMessage,
      ...props
    },
    ref
  ) => {
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
            setIsDropdownVisible(data.length > 0);
          })
          .finally(() => setIsLoading(false));
      }
    };

    const handleBlur = (e) => {
      setTimeout(() => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsDropdownVisible(false);
        }
      }, 100);
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
        {label !== "" && (
          <div className="mb-4">
            <label
              htmlFor={forInput}
              className="form-label text-lg font-medium text-white"
            >
              {label}
              {isRequired && <span className="text-red-500"> *</span>}
              {errorMessage && (
                <span className="text-sm text-red-500"> {errorMessage}</span>
              )}
            </label>
            <input
              id={forInput}
              name={forInput}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => {
                if (inputValue.trim() !== "" && filteredData.length > 0) {
                  setIsDropdownVisible(true);
                }
              }}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`form-control w-full p-2 rounded-md border ${
                errorMessage ? "border-red-500" : "border-gray-300"
              } text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out`}
              ref={ref}
              disabled={isDisabled}
              autoComplete="off"
              {...props}
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">
                Loading...
              </div>
            )}
            {isDropdownVisible && (
              <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto z-10">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect(item)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-black"
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
        )}

        {label === "" && (
          <>
            <input
              id={forInput}
              name={forInput}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => {
                if (inputValue.trim() !== "" && filteredData.length > 0) {
                  setIsDropdownVisible(true);
                }
              }}
              onBlur={handleBlur}
              placeholder={placeholder}
              className={`form-control w-full p-2 rounded-md border ${
                errorMessage ? "border-red-500" : "border-gray-300"
              } text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out`}
              ref={ref}
              disabled={isDisabled}
              autoComplete="off"
              {...props}
            />
            {errorMessage && (
              <span className="text-sm text-red-500 mt-1">
                {placeholder.charAt(0).toUpperCase() +
                  placeholder.substr(1).toLowerCase() +
                  " " +
                  errorMessage}
              </span>
            )}
            {isLoading && (
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">
                Loading...
              </div>
            )}
            {isDropdownVisible && (
              <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto z-10">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelect(item)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-black"
                    >
                      {renderLabel(item)}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No results found</li>
                )}
              </ul>
            )}
          </>
        )}
      </div>
    );
  }
);

export default Autocomplete;