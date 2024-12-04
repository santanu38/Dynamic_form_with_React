import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import Table from "./Table";

interface Field {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface FormResponse {
  fields: Field[];
}

interface DynamicProps {
  formType: string;
}
interface Alert {
  message: string;
  type: "success" | "error" | "warning" | "update"; // Different message types
}

const API_RESPONSES: Record<string, FormResponse> = {
  'User Information': {
    fields: [
      { name: 'firstName', type: 'text', label: 'First Name', required: true },
      { name: 'lastName', type: 'text', label: 'Last Name', required: true },
      { name: 'age', type: 'number', label: 'Age', required: false },
    ],
  },
  'Address Information': {
    fields: [
      { name: 'street', type: 'text', label: 'Street', required: true },
      { name: 'city', type: 'text', label: 'City', required: true },
      { name: 'state', type: 'dropdown', label: 'State', options: ['California', 'Texas', 'New York'], required: true },
      { name: 'zipCode', type: 'text', label: 'Zip Code', required: false },
    ],
  },
  'Payment Information': {
    fields: [
      { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
      { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
      { name: 'cvv', type: 'password', label: 'CVV', required: true },
      { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true },
    ],
  },
};

const DynamicForm: React.FC<DynamicProps> = ({ formType }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedData, setSubmittedData] = useState<Record<string, string>[][]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [editIndex, setEditIndex] = useState<{ tableIndex: number, entryIndex: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ tableIndex: number, entryIndex: number } | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);

  useEffect(() => {
    const apiResponse = API_RESPONSES[formType];
    if (apiResponse) {
      setFields(apiResponse.fields);
      setFormData({});
      setErrors({});
      setEditIndex(null); // Clear edit mode when form type changes
    }
  }, [formType]);

  const validateInput = (name: string, value: string, type: string): string | null => {
    if (type === "text" && name !== "street" && name !== "zipCode" && name !== "cardNumber") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return "Only alphabetic characters are allowed.";
      }
    }

    if (type === "number" || name === "age" || name === "zipCode" || name === "cardNumber" ) {
      if (!/^\d+$/.test(value)) {
        return "Only numeric values are allowed.";
      }
    }

    if (name === "street") {
      if (!/^[a-zA-Z0-9\s,]+$/.test(value)) {
        return "Street should contain only letters, numbers, spaces, and commas.";
      }
    }

    return null;
  };

  const handleInputChange = (name: string, value: string, type: string) => {
    const errorMessage = validateInput(name, value, type);
    if (errorMessage) {
      setErrors({ ...errors, [name]: errorMessage });
    } else {
      const { [name]: removed, ...rest } = errors;
      setErrors(rest);
    }

    setFormData({ ...formData, [name]: value });
    calculateProgress();
  };

  const calculateProgress = () => {
    const requiredFields = fields.filter((field) => field.required); // Get required fields
    const filledFields = requiredFields.filter((field) => formData[field.name]); // Check if required fields are filled
  
    // Prevent division by zero
    const progress = requiredFields.length === 0 ? 0 : (filledFields.length / requiredFields.length) * 100;
  
    setProgress(progress); // Set progress to the percentage value
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for required fields that are empty
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });
  
    // Check if there are existing errors or new validation errors
    const hasErrors = Object.keys(newErrors).length > 0 || Object.keys(errors).length > 0;
    setErrors(newErrors);
  
    if (hasErrors) {
      setAlert({message:"Please fix the errors before submitting.",type:"error"});
      return;
    }
  
    if (editIndex) {
      const { tableIndex, entryIndex } = editIndex;
      const updatedData = [...submittedData];
      updatedData[tableIndex][entryIndex] = formData;
      setSubmittedData(updatedData);
      setEditIndex(null);
      setAlert({message:"Form successfully updated!",type:"update"}); // Add success message for update
    } else {
      setSubmittedData([...submittedData, [formData]]);
      setAlert({message:"Form successfully submitted!",type:"success"}); // Add success message for new submission
    }
  
    setFormData({});
    setTimeout(() => setAlert(null), 3000);
    setProgress(0);

  };
  
  

  const handleDelete = (tableIndex: number, entryIndex: number) => {
    setConfirmDelete({ tableIndex, entryIndex });
  };

  const confirmDeleteEntry = () => {
    if (confirmDelete) {
      const { tableIndex, entryIndex } = confirmDelete;
      const updatedData = submittedData[tableIndex].filter((_, i) => i !== entryIndex);
      const updatedSubmittedData = [...submittedData];
      updatedSubmittedData[tableIndex] = updatedData;
      setSubmittedData(updatedSubmittedData);
      setConfirmDelete(null);
      setAlert({message:"Entry deleted successfully!",type:"warning"});
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null); // Close the confirmation without deleting
  };

  const handleEdit = (tableIndex: number, entryIndex: number) => {
    const entryToEdit = submittedData[tableIndex][entryIndex];
    setFormData(entryToEdit);
    setEditIndex({ tableIndex, entryIndex });
  };
  
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <ProgressBar progress={progress} />
     
        {/* {dynamic form creation} */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "dropdown" ? (
              <select
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value, "text")}
              >
                <option value="">Select</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                className={`border ${errors[field.name] ? "border-red-500" : "border-gray-300"} rounded-md p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none`}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value, field.type)}
              />
            )}
            {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
          </div>
        ))}

        <button
          type="submit"
          className={` py-2 px-4 ${
            editIndex ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            editIndex ? "focus:ring-yellow-400" : "focus:ring-blue-400"
          }`}
        >
         {editIndex ? "Update" : "Submit"}
         </button>

      </form>
      
       {/* Dynamic Alert Message */}
      {alert && (
          <div
            className={`mt-3 mb-4 p-3 rounded-md text-sm font-medium ${
            alert.type === "success"
              ? "bg-green-100 text-green-700 "
             : alert.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
              {alert.message}
            </div>
            
        )}
      
    {/* {Table component to show data} */}
      {submittedData.length > 0 && (
        <div className="mt-8 overflow-x-auto max-h-40">
          {submittedData.map((data, tableIndex) => (
            <div key={tableIndex} className="mb-6">
              <Table
                data={data}
                fields={fields}
                onDelete={(entryIndex) => handleDelete(tableIndex, entryIndex)}
                onEdit={(entryIndex) => handleEdit(tableIndex, entryIndex)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Deleting */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <p className="text-lg font-semibold">Are you sure you want to delete this entry?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={confirmDeleteEntry}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Confirm Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;






