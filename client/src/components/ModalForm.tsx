import Modal from "./ModalComp";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "./FormFields/ButtonComp";
import FormInput from "./FormFields/FormInput";

interface MyFormValues {
  name: string;
  email: string;
}

const MyFormModal = ({
  isOpen,
  onClose,
  title,
  initialValues,
  validationSchema,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValues: MyFormValues;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: MyFormValues) => void;
}) => {
  const handleSubmit = (values: MyFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} testId="my-form-modal">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form className="space-y-4">
            <FormInput
              name="name"
              labelName="Name"
              placeHolder="Enter your name"
              type="text"
              value={values.name}
              onChange={handleChange}
            />
            <FormInput
              name="email"
              labelName="Email"
              placeHolder="Enter your email"
              type="email"
              onChange={handleChange}
              value={values.email}
            />

            <div className="flex justify-end space-x-4">
              <Button type="submit" variant="primary">
                Submit
              </Button>
              <Button type="button" variant="danger" onClick={onClose}>
                Close
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default MyFormModal;
