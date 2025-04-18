import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label = "",
    forInput,
    type = "text",
    placeholder = "",
    isRequired = false,
    isDisabled = false,
    errorMessage,
    ...props
  },
  ref
) {
  return (
    <>
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
          {type === "textarea" ? (
            <textarea
              rows="5"
              id={forInput}
              name={forInput}
              className="form-control w-full p-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
              placeholder={placeholder}
              ref={ref}
              disabled={isDisabled}
              {...props}
            ></textarea>
          ) : (
            <input
              id={forInput}
              name={forInput}
              type={type}
              className="form-control w-full p-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
              placeholder={placeholder}
              ref={ref}
              disabled={isDisabled}
              {...props}
            />
          )}
        </div>
      )}
      {label === "" && (
        <>
          {type === "textarea" ? (
            <textarea
              rows="5"
              id={forInput}
              name={forInput}
              className="form-control w-full p-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
              placeholder={placeholder}
              ref={ref}
              disabled={isDisabled}
              {...props}
            ></textarea>
          ) : (
            <input
              id={forInput}
              name={forInput}
              type={type}
              className="form-control w-full p-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
              placeholder={placeholder}
              ref={ref}
              disabled={isDisabled}
              {...props}
            />
          )}
          {errorMessage && (
            <span className="text-sm text-red-500 mt-1">
              {placeholder.charAt(0).toUpperCase() +
                placeholder.substr(1).toLowerCase() +
                " " +
                errorMessage}
            </span>
          )}
        </>
      )}
    </>
  );
});

export default Input;
