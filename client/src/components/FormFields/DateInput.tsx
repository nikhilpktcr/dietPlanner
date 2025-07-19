import React from "react";
import { useField } from "formik";

interface DateInputProps {
  name: string;
  labelName: string;
  placeHolder: string;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  name,
  labelName,
  placeHolder,
  className = "",
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {labelName}
      </label>
      <input
        {...field}
        type="date"
        id={name}
        placeholder={placeHolder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
          meta.touched && meta.error ? "border-red-500" : ""
        }`}
        onChange={(e) => {
          helpers.setValue(e.target.value);
        }}
      />
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default DateInput;
