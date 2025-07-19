import { render, screen, fireEvent } from "@testing-library/react";
import { Formik, Form } from "formik";
import FormInput from "../components/FormFields/FormInput";

describe("FormInput Component", () => {
  const initialValues = { email: "" };

  test("renders input with label and placeholder", () => {
    render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form>
          <FormInput
            name="email"
            labelName="Email Address"
            placeHolder="Enter your email"
            type="email"
            onChange={() => {}}
            value=""
          />
        </Form>
      </Formik>
    );

    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  test("updates value on change", () => {
    const handleChange = jest.fn();

    render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <Form>
          <FormInput
            name="email"
            labelName="Email Address"
            placeHolder="Enter your email"
            type="email"
            onChange={handleChange}
            value=""
          />
        </Form>
      </Formik>
    );

    const input = screen.getByTestId("emailInput");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    expect(handleChange).toHaveBeenCalled();
  });

  test("displays error message when validation fails", async () => {
    render(
      <Formik
        initialValues={initialValues}
        onSubmit={() => {}}
        validate={(values) => {
          const errors: { email?: string } = {};
          if (!values.email) {
            errors.email = "Email is required";
          }
          return errors;
        }}
      >
        {() => (
          <Form>
            <FormInput
              name="email"
              labelName="Email Address"
              placeHolder="Enter your email"
              type="email"
              onChange={() => {}}
              value=""
            />
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    );

    fireEvent.click(screen.getByText("Submit"));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });
});
