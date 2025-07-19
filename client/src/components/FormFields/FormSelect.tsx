import React from "react";
import { IFormSelectData, IFormSelect } from "../../interface/interface";
import { ErrorMessage, useField } from "formik";
const FormSelect: React.FC<IFormSelect> = ({ name, labelName, data }) => {
  const [field] = useField(name);
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2 text-left"
        htmlFor={name}
      >
        {labelName}
      </label>
      <select
        id={name}
        {...field}
        name={name}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        data-testid={`${name}Input`}
      >
        <option key="select" value={undefined} selected>
          --Select--
        </option>
        {data?.map((item: IFormSelectData) => (
          <option key={item._id} value={item._id}>
            {item.name.charAt(0).toUpperCase() +
              item.name.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <ErrorMessage
        name={name}
        component={"div"}
        className="text-red-500 text-sm mt-1 text-left"
      />
    </div>
  );
};
export default FormSelect;
