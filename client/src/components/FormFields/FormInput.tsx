import { IFormInput } from "../../interface/interface";
import { Field, ErrorMessage } from "formik";
const FormInput: React.FC<IFormInput> = ({
  name,
  labelName,
  placeHolder,
  type,
  onChange,
  value,
}) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2 text-left"
        htmlFor={name}
      >
        {labelName}
      </label>
      <Field
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={name}
        type={type}
        placeholder={placeHolder}
        data-testid={`${name}Input`}
        name={name}
        onChange={onChange}
        value={value}
      />
      <ErrorMessage
        name={name}
        component={"div"}
        className="text-red-500 text-sm mt-1 text-left"
      />
    </div>
  );
};
export default FormInput;
