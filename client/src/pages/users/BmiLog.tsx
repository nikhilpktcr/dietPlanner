import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import FormInput from "../../components/FormFields/FormInput";
import Button from "../../components/FormFields/ButtonComp";
import Spinner from "../../components/Spinner";
import Modal from "../../components/ModalComp";
import {
  useGetBmiLogsQuery,
  useCreateBmiLogMutation,
  useUpdateBmiLogMutation,
  useDeleteBmiLogMutation,
  BMILog,
  CreateBmiLogPayload,
} from "../../redux/services/bmiLogApi";

// Validation schema for BMI log form
const BmiLogSchema = Yup.object().shape({
  weightCm: Yup.number()
    .min(30, "Weight must be at least 30kg")
    .max(300, "Weight must be less than 300kg")
    .required("Weight is required"),
  heightCm: Yup.number()
    .min(100, "Height must be at least 100cm")
    .max(250, "Height must be less than 250cm")
    .required("Height is required"),
});

const BmiLogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<BMILog | null>(null);

  // RTK Query hooks
  const {
    data: bmiLogsData,
    isLoading,
    error,
    refetch,
  } = useGetBmiLogsQuery({
    page: currentPage,
    limit: 10,
    searchCategory: searchCategory || undefined,
  });

  const [createBmiLog, { isLoading: isCreating }] = useCreateBmiLogMutation();
  const [updateBmiLog, { isLoading: isUpdating }] = useUpdateBmiLogMutation();
  const [deleteBmiLog, { isLoading: isDeleting }] = useDeleteBmiLogMutation();

  // Helper functions
  const getBMICategoryColor = (category: string) => {
    switch (category) {
      case "under-weight":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "over-weight":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "obese":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBMICategoryLabel = (category: string) => {
    switch (category) {
      case "under-weight":
        return "Underweight";
      case "normal":
        return "Normal";
      case "over-weight":
        return "Overweight";
      case "obese":
        return "Obese";
      default:
        return category;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Form handlers
  const handleSubmit = async (values: CreateBmiLogPayload) => {
    try {
      if (editingLog) {
        await updateBmiLog({
          id: editingLog._id,
          payload: values,
        }).unwrap();
        toast.success("BMI log updated successfully!");
      } else {
        await createBmiLog(values).unwrap();
        toast.success("BMI log created successfully!");
      }
      setIsModalOpen(false);
      setEditingLog(null);
      refetch();
    } catch (error) {
      toast.error("Failed to save BMI log");
    }
  };

  const handleEdit = (log: BMILog) => {
    setEditingLog(log);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this BMI log?")) {
      try {
        await deleteBmiLog(id).unwrap();
        toast.success("BMI log deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete BMI log");
      }
    }
  };

  const openCreateModal = () => {
    setEditingLog(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLog(null);
  };

  // Get the actual logs data from the nested response structure
  const logsData = (bmiLogsData as any)?.response || bmiLogsData;
  const logs = logsData?.logs || [];
  const total = logsData?.total || 0;
  const totalPages = logsData?.totalPages || 0;

  // Calculate BMI trend
  const calculateTrend = () => {
    if (!logs || logs.length < 2) return null;

    const sortedLogs = [...logs].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const firstBMI = sortedLogs[0].bmi;
    const lastBMI = sortedLogs[sortedLogs.length - 1].bmi;
    const difference = lastBMI - firstBMI;

    return {
      difference: difference.toFixed(1),
      trend:
        difference > 0
          ? "increasing"
          : difference < 0
          ? "decreasing"
          : "stable",
    };
  };

  const trend = calculateTrend();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 text-center">
          <div className="text-red-600 mb-4 text-base sm:text-lg font-medium">
            Error loading BMI logs. Please try again.
          </div>
          <Button
            onClick={() => refetch()}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
          BMI Logs
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Track your BMI changes over time and monitor your health progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Total Entries
          </h3>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Latest BMI
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {logs?.[0]?.bmi || "N/A"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            BMI Trend
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {trend ? `${trend.difference}` : "N/A"}
          </p>
          {trend && (
            <p
              className={`text-sm font-medium ${
                trend.trend === "increasing"
                  ? "text-red-600"
                  : trend.trend === "decreasing"
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              {trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}
            </p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="">All Categories</option>
            <option value="under-weight">Underweight</option>
            <option value="normal">Normal</option>
            <option value="over-weight">Overweight</option>
            <option value="obese">Obese</option>
          </select>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          className="w-full sm:w-auto"
        >
          Add New Entry
        </Button>
      </div>

      {/* BMI Logs Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Weight (kg)
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Height (cm)
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  BMI
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs?.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {log.weightCm}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {log.heightCm}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {log.bmi}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getBMICategoryColor(
                        log.category
                      )}`}
                    >
                      {getBMICategoryLabel(log.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(log)}
                        variant="secondary"
                        className="text-xs px-2 py-1"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(log._id)}
                        variant="danger"
                        className="text-xs px-2 py-1"
                        disabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(!logs || logs.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No BMI logs yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start tracking your BMI by adding your first entry.
            </p>
            <Button onClick={openCreateModal} variant="primary">
              Add First Entry
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              variant="secondary"
              className="px-3 py-2"
            >
              Previous
            </Button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="secondary"
              className="px-3 py-2"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingLog ? "Edit BMI Log" : "Add New BMI Log"}
          </h2>

          <Formik
            initialValues={{
              weightCm: editingLog?.weightCm || 0,
              heightCm: editingLog?.heightCm || 0,
            }}
            validationSchema={BmiLogSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange }) => (
              <Form className="space-y-4">
                <FormInput
                  name="weightCm"
                  labelName="Weight (kg)"
                  placeHolder="Enter weight in kg"
                  type="number"
                  value={values.weightCm}
                  onChange={handleChange}
                />

                <FormInput
                  name="heightCm"
                  labelName="Height (cm)"
                  placeHolder="Enter height in cm"
                  type="number"
                  value={values.heightCm}
                  onChange={handleChange}
                />

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isCreating || isUpdating}
                    className="flex-1"
                  >
                    {isCreating || isUpdating
                      ? "Saving..."
                      : editingLog
                      ? "Update"
                      : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={closeModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};

export default BmiLogPage;
