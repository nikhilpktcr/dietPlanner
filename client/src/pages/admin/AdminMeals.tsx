import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import FormInput from "../../components/FormFields/FormInput";
import FormSelect from "../../components/FormFields/FormSelect";

import Button from "../../components/FormFields/ButtonComp";
import Spinner from "../../components/Spinner";
import Modal from "../../components/ModalComp";
import { Table as TableComp } from "../../components/Table/TableComp";
import {
  useGetMealsQuery,
  useCreateMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
  Meal,
  CreateMealPayload,
} from "../../redux/services/mealApi";

// Validation schema for meal form
const MealSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  type: Yup.string().oneOf(["veg", "non veg"]).required("Type is required"),
  mealType: Yup.string()
    .oneOf(["breakfast", "lunch", "dinner", "snacks"])
    .required("Meal type is required"),
  mealInGrams: Yup.number()
    .min(1, "Must be at least 1 gram")
    .max(10000, "Must be less than 10kg")
    .required("Weight is required"),
  description: Yup.string().required("Description is required"),
  calories: Yup.number()
    .min(1, "Must be at least 1 calorie")
    .max(10000, "Must be less than 10,000 calories")
    .required("Calories are required"),
  protein: Yup.number()
    .min(0, "Must be at least 0g")
    .max(1000, "Must be less than 1kg")
    .required("Protein is required"),
  carbs: Yup.number()
    .min(0, "Must be at least 0g")
    .max(1000, "Must be less than 1kg")
    .required("Carbs are required"),
  fats: Yup.number()
    .min(0, "Must be at least 0g")
    .max(1000, "Must be less than 1kg")
    .required("Fats are required"),
  tags: Yup.string()
    .oneOf(["weightLoss", "weightGain", "maintenance"])
    .required("Tags are required"),
  ingredients: Yup.array().min(1, "At least one ingredient is required"),
  status: Yup.string()
    .oneOf(["active", "in active", "deleted"])
    .required("Status is required"),
});

const AdminMeals: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTags, setSelectedTags] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [user, setUser] = useState<any>(null);

  // Get user data from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      setUser(null);
    }
  }, []);

  // RTK Query hooks
  const {
    data: mealsData,
    isLoading,
    error,
    refetch,
  } = useGetMealsQuery({
    search: searchTerm || undefined,
    mealType: selectedMealType || undefined,
    type: selectedType || undefined,
    tags: selectedTags || undefined,
    limit: "10",
    offset: ((currentPage - 1) * 10).toString(),
    status: "active",
  });

  const [createMeal, { isLoading: isCreating }] = useCreateMealMutation();
  const [updateMeal, { isLoading: isUpdating }] = useUpdateMealMutation();
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation();

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "in active":
        return "bg-yellow-100 text-yellow-800";
      case "deleted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "veg":
        return "bg-green-100 text-green-800";
      case "non veg":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Form handlers
  const handleSubmit = async (values: CreateMealPayload) => {
    try {
      if (editingMeal) {
        await updateMeal({
          id: editingMeal._id,
          payload: values,
        }).unwrap();
        toast.success("Meal updated successfully!");
      } else {
        await createMeal(values).unwrap();
        toast.success("Meal created successfully!");
      }
      setIsModalOpen(false);
      setEditingMeal(null);
      refetch();
    } catch (error) {
      toast.error("Failed to save meal");
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await deleteMeal(id).unwrap();
        toast.success("Meal deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete meal");
      }
    }
  };

  const openCreateModal = () => {
    setEditingMeal(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMeal(null);
  };

  // Table columns
  const mealColumns = [
    { key: "title", label: "Title", render: (meal: Meal) => meal.title },
    {
      key: "type",
      label: "Type",
      render: (meal: Meal) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
            meal.type
          )}`}
        >
          {meal.type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
        </span>
      ),
    },
    {
      key: "mealType",
      label: "Meal Type",
      render: (meal: Meal) => (
        <span className="capitalize">{meal.mealType}</span>
      ),
    },
    {
      key: "calories",
      label: "Calories",
      render: (meal: Meal) => `${meal.calories} cal`,
    },
    {
      key: "protein",
      label: "Protein",
      render: (meal: Meal) => `${meal.protein}g`,
    },
    {
      key: "status",
      label: "Status",
      render: (meal: Meal) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            meal.status
          )}`}
        >
          {meal.status === "in active" ? "Inactive" : meal.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (meal: Meal) => formatDate(meal.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (meal: Meal) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleEdit(meal)}
            variant="secondary"
            className="text-xs px-2 py-1"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(meal._id)}
            variant="danger"
            className="text-xs px-2 py-1"
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8 text-center">
          <div className="text-red-600 mb-4 text-base sm:text-lg font-medium">
            Error loading meals. Please try again.
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
          Meal Management
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Manage all meals in the system - create, edit, and delete meal entries
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Total Meals
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {mealsData?.meals?.length || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Vegetarian
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {mealsData?.meals?.filter((m) => m.type === "veg").length || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Non-Vegetarian
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {mealsData?.meals?.filter((m) => m.type === "non veg").length || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Active Meals
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {mealsData?.meals?.filter((m) => m.status === "active").length || 0}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search meals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          />

          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          >
            <option value="">All Meal Types</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          >
            <option value="">All Types</option>
            <option value="veg">Vegetarian</option>
            <option value="non veg">Non-Vegetarian</option>
          </select>

          <select
            value={selectedTags}
            onChange={(e) => setSelectedTags(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          >
            <option value="">All Tags</option>
            <option value="weightLoss">Weight Loss</option>
            <option value="weightGain">Weight Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          className="w-full sm:w-auto"
        >
          Add New Meal
        </Button>
      </div>

      {/* Meals Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {mealsData?.meals && mealsData.meals.length > 0 ? (
          <TableComp
            data={mealsData.meals}
            columns={mealColumns}
            className="w-full"
          />
        ) : (
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No meals found
            </h3>
            <p className="text-gray-500 mb-4">
              Start by adding your first meal to the system.
            </p>
            <Button onClick={openCreateModal} variant="primary">
              Add First Meal
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingMeal ? "Edit Meal" : "Add New Meal"}
          </h2>

          <Formik
            initialValues={{
              title: editingMeal?.title || "",
              type: editingMeal?.type || "veg",
              mealType: editingMeal?.mealType || "breakfast",
              mealInGrams: editingMeal?.mealInGrams || 0,
              description: editingMeal?.description || "",
              calories: editingMeal?.calories || 0,
              protein: editingMeal?.protein || 0,
              carbs: editingMeal?.carbs || 0,
              fats: editingMeal?.fats || 0,
              tags: editingMeal?.tags || "maintenance",
              ingredients: editingMeal?.ingredients || [""],
              status: editingMeal?.status || "active",
            }}
            validationSchema={MealSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    name="title"
                    labelName="Meal Title"
                    placeHolder="Enter meal title"
                    type="text"
                    value={values.title}
                    onChange={handleChange}
                  />

                  <FormSelect
                    name="type"
                    labelName="Type"
                    value={values.type}
                    onChange={handleChange}
                    options={[
                      { value: "veg", label: "Vegetarian" },
                      { value: "non veg", label: "Non-Vegetarian" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSelect
                    name="mealType"
                    labelName="Meal Type"
                    value={values.mealType}
                    onChange={handleChange}
                    options={[
                      { value: "breakfast", label: "Breakfast" },
                      { value: "lunch", label: "Lunch" },
                      { value: "dinner", label: "Dinner" },
                      { value: "snacks", label: "Snacks" },
                    ]}
                  />

                  <FormInput
                    name="mealInGrams"
                    labelName="Weight (grams)"
                    placeHolder="Enter weight in grams"
                    type="number"
                    value={values.mealInGrams}
                    onChange={handleChange}
                  />
                </div>

                <FormInput
                  name="description"
                  labelName="Description"
                  placeHolder="Enter meal description"
                  type="text"
                  value={values.description}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormInput
                    name="calories"
                    labelName="Calories"
                    placeHolder="Enter calories"
                    type="number"
                    value={values.calories}
                    onChange={handleChange}
                  />

                  <FormInput
                    name="protein"
                    labelName="Protein (g)"
                    placeHolder="Enter protein"
                    type="number"
                    value={values.protein}
                    onChange={handleChange}
                  />

                  <FormInput
                    name="carbs"
                    labelName="Carbs (g)"
                    placeHolder="Enter carbs"
                    type="number"
                    value={values.carbs}
                    onChange={handleChange}
                  />

                  <FormInput
                    name="fats"
                    labelName="Fats (g)"
                    placeHolder="Enter fats"
                    type="number"
                    value={values.fats}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSelect
                    name="tags"
                    labelName="Tags"
                    value={values.tags}
                    onChange={handleChange}
                    options={[
                      { value: "weightLoss", label: "Weight Loss" },
                      { value: "weightGain", label: "Weight Gain" },
                      { value: "maintenance", label: "Maintenance" },
                    ]}
                  />

                  <FormSelect
                    name="status"
                    labelName="Status"
                    value={values.status}
                    onChange={handleChange}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "in active", label: "Inactive" },
                      { value: "deleted", label: "Deleted" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  {values.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => {
                          const newIngredients = [...values.ingredients];
                          newIngredients[index] = e.target.value;
                          setFieldValue("ingredients", newIngredients);
                        }}
                        placeholder="Enter ingredient"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                      />
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => {
                          const newIngredients = values.ingredients.filter(
                            (_, i) => i !== index
                          );
                          setFieldValue("ingredients", newIngredients);
                        }}
                        className="px-3 py-2"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setFieldValue("ingredients", [...values.ingredients, ""]);
                    }}
                    className="mt-2"
                  >
                    Add Ingredient
                  </Button>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isCreating || isUpdating}
                    className="flex-1"
                  >
                    {isCreating || isUpdating
                      ? "Saving..."
                      : editingMeal
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

export default AdminMeals;
