import React from "react";
import { useField } from "formik";
interface TimeSlotSelectorProps {
  name: string;
  timeSlots: string[];
  label?: string;
}
const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  name,
  timeSlots,
  label = "Select a Time Slot",
}) => {
  const [field, meta, helpers] = useField(name);
  return (
    <div className="mb-4">
    <label
      className="block text-gray-700 text-sm font-bold mb-2 text-left"
      htmlFor={name}
    >
      {label}
    </label>
      <div className="flex flex-wrap gap-3">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            type="button"
            className={`px-4 py-2 border rounded-md text-sm ${
              field.value === slot
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-blue-100"
            }`}
            onClick={() => helpers.setValue(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
      {meta.touched && meta.error && (
        <span className="text-sm text-red-500">{meta.error}</span>
      )}
    </div>
  );
};
export default TimeSlotSelector;
