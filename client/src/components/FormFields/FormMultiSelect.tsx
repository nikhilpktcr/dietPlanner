import React, { useState } from "react";
import { useField, useFormikContext, ErrorMessage } from "formik";
import { IFormSelect } from "../../interface/interface";

const FormCustomMultiSelect: React.FC<IFormSelect> = ({
  name,
  labelName,
  data,
}) => {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string) => {
    const currentValues: string[] = field.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFieldValue(name, newValues);
  };

  const isSelected = (value: string) => field.value?.includes(value);

  return (
    <div className="mb-4 relative">
      <label
        className="block text-gray-700 text-sm font-bold mb-2 text-left"
        htmlFor={name}
      >
        {labelName}
      </label>

      <div
        className="border rounded px-3 py-2 cursor-pointer bg-white shadow"
        onClick={toggleDropdown}
        data-testid={`${name}Dropdown`}
      >
        {field.value?.length
          ? data
              .filter((item) => field.value.includes(item._id))
              .map((item) => item.name)
              .join(", ")
          : "--Multi-Select--"}
      </div>

      {isOpen && (
        <div className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-y-auto">
          {data.map((item) => (
            <div
              key={item._id}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                isSelected(item._id) ? "bg-blue-100 font-semibold" : ""
              }`}
              onClick={() => handleSelect(item._id)}
            >
              {item.name.charAt(0).toUpperCase() +
                item.name.slice(1).toLowerCase()}
            </div>
          ))}
        </div>
      )}

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1 text-left"
      />
    </div>
  );
};

export default FormCustomMultiSelect;
