import { forwardRef } from "react";

const DropDown = forwardRef(function DropDown(
  {
    arrData,
    type = "pilih",
    label = "",
    forInput,
    isRequired = false,
    isDisabled = false,
    errorMessage,
    showLabel = true,
    ...props
  },
  ref
) {
  let placeholder = "";

  switch (type) {
    case "pilih":
      placeholder = <option value="">{"-- Pilih " + label + " --"}</option>;
      break;
    case "semua":
      placeholder = <option value="">-- Semua --</option>;
      break;
    default:
      break;
  }

  return (
    <div className="mb-4">
      {showLabel && (
        <label htmlFor={forInput} className="block text-lg font-medium text-white">
          {label}
          {isRequired && <span className="text-red-500"> *</span>}
          {errorMessage && <span className="text-sm text-red-500"> {errorMessage}</span>}
        </label>
      )}
      <select
        id={forInput}
        name={forInput}
        ref={ref}
        disabled={isDisabled}
        className="w-full p-2 mt-1 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out bg-white"
        {...props}
      >
        {placeholder}
        {arrData &&
          arrData.length > 0 &&
          arrData.map((data) => (
            <option key={data.Value} value={data.Value} className="text-black">
              {data.Text}
            </option>
          ))}
      </select>
    </div>
  );
});

export default DropDown;
