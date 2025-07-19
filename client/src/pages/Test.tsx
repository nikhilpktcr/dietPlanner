import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Button from "../components/FormFields/ButtonComp";
import { Card } from "../components/Card";
import Spinner from "../components/Spinner";
import Modal from "../components/ModalComp";
import ModalForm from "../components/ModalForm";
import FormInput from "../components/FormFields/FormInput";
import FormSelect from "../components/FormFields/FormSelect";
import FormMultiSelect from "../components/FormFields/FormMultiSelect";
import SlotSelect from "../components/FormFields/SlotSelect";
import CustomDatePicker from "../components/FormFields/DateInput";
import { Table } from "../components/Table/TableComp";
import { Pagination } from "../components/Table/Pagination";
import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";
import MainLayout from "../components/Layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const mockSelectData = [
  { _id: "1", name: "Option One" },
  { _id: "2", name: "Option Two" },
  { _id: "3", name: "Option Three" },
];
const mockTimeSlots = ["09:00", "10:00", "11:00", "12:00"];
const mockTableColumns = [
  { label: "Name", key: "name" as const },
  { label: "Email", key: "email" as const },
  { label: "Age", key: "age" as const },
];
const mockTableData = [
  { name: "Alice", email: "alice@example.com", age: 25 },
  { name: "Bob", email: "bob@example.com", age: 30 },
  { name: "Charlie", email: "charlie@example.com", age: 22 },
];

const Test = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  return (
    <div className="space-y-8 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test: All Components Demo</h1>

      {/* Header and Sidebar */}
      <div className="border rounded-lg overflow-hidden mb-6">
        <Header />
        <div className="flex">
          <Sidebar isOpen={true} />
          <div className="flex-1 p-4">Sidebar rendered standalone</div>
        </div>
      </div>

      {/* MainLayout (as a demo, not wrapping the page) */}
      <div className="border rounded-lg overflow-hidden mb-6">
        <MainLayout />
        <div className="p-2 text-sm text-gray-500">
          MainLayout rendered (Outlet not shown)
        </div>
      </div>

      {/* Card */}
      <Card
        title="Demo Card"
        subtitle="Card Subtitle"
        description="This is a description for the demo card."
        actions={<Button variant="primary">Action</Button>}
        footer={<span>Card Footer</span>}
        variant="elevated"
      >
        <div>Card children content</div>
      </Card>

      {/* Spinner */}
      <div className="my-4">
        <Spinner />
      </div>

      {/* ButtonComp */}
      <div className="flex gap-4 my-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="success">Success</Button>
      </div>

      {/* ModalComp */}
      <Button onClick={() => setModalOpen(true)} variant="primary">
        Open Modal
      </Button>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          This is a modal!{" "}
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </div>
      </Modal>

      {/* ModalForm */}
      <Button onClick={() => setModalFormOpen(true)} variant="primary">
        Open Modal Form
      </Button>
      <ModalForm
        isOpen={modalFormOpen}
        onClose={() => setModalFormOpen(false)}
        title="Demo Modal Form"
      />

      {/* Formik Form for FormInput, FormSelect, FormMultiSelect, SlotSelect, DateInput */}
      <Formik
        initialValues={{
          input: "",
          select: "",
          multi: [],
          slot: "",
          date: "",
        }}
        validationSchema={Yup.object({
          input: Yup.string().required("Required"),
          select: Yup.string().required("Required"),
          multi: Yup.array().min(1, "Select at least one option"),
          slot: Yup.string().required("Required"),
          date: Yup.date().required("Required"),
        })}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      >
        {({ values, handleChange }) => (
          <Form className="space-y-4 border p-4 rounded-lg">
            <FormInput
              name="input"
              labelName="Text Input"
              placeHolder="Type something..."
              type="text"
              value={values.input}
              onChange={handleChange}
            />
            <FormSelect
              name="select"
              labelName="Select Option"
              data={mockSelectData}
            />
            <FormMultiSelect
              name="multi"
              labelName="Multi Select"
              data={mockSelectData}
            />
            <SlotSelect
              name="slot"
              timeSlots={mockTimeSlots}
              label="Pick a Time Slot"
            />
            <Field
              name="date"
              label="Pick a Date"
              component={CustomDatePicker}
            />
            <Button type="submit" variant="primary">
              Submit Form
            </Button>
          </Form>
        )}
      </Formik>

      {/* TableComp and Pagination */}
      <div className="my-8">
        <Table
          data={mockTableData}
          columns={mockTableColumns}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ProtectedRoute (demo) */}
      <div className="border p-4 rounded-lg my-4">
        <div className="mb-2 font-semibold">ProtectedRoute Demo:</div>
        {/* Simulate allowedRoles and user in localStorage */}
        <ProtectedRoute allowedRoles={["admin", "user"]} />
        <div className="text-xs text-gray-500">
          (If not allowed, will redirect to /login)
        </div>
      </div>
    </div>
  );
};

export default Test;
