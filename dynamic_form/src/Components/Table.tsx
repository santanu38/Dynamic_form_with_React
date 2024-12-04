import React from "react";

// Define the Field type
interface Field {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

// Define TableProps
interface TableProps {
  data: Record<string, string>[]; // Data passed from the parent (DynamicForm)
  fields: Field[]; // Fields for dynamic form
  onDelete: (index: number) => void;
  onEdit: (index: number, updatedData: Record<string, string>) => void;
}

const Table: React.FC<TableProps> = ({ data, fields, onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {fields.map((field) => (
              <th key={field.name} className="px-4 py-2 border-b text-left">
                {field.label}
              </th>
            ))}
            <th className="px-4 py-2 border-b text-left">Actions</th>
          </tr>
        </thead>
      </table>

      <div
         className="overflow-y-auto"
        // Adjust this value as needed for scroll height
      >
        <table className="min-w-full border-collapse">
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {fields.map((field) => (
                  <td key={field.name} className="px-4 py-2 border-b">
                    {row[field.name] || "N/A"}
                  </td>
                ))}
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => onEdit(index, row)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 mb-1 mt-1 hover:bg-slate-600blue-500"
                  >
                   ✏️
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;




