import React, { useState } from 'react';
import './App.css';
import DynamicForm from './Components/DynamicForm';

interface FormOption {
  value: string;
  label: string;
}

const App: React.FC = () => {
  const [formType, setFormType] = useState<string>('User Information');
  const formOptions: FormOption[] = [
    { value: 'User Information', label: 'User Information' },
    { value: 'Address Information', label: 'Address Information' },
    { value: 'Payment Information', label: 'Payment Information' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="py-4 bg-orange-500 text-white text-center shadow-lg">
        <h1 className="text-2xl font-bold">Dynamic Form</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-gray-100">
        <div className="max-w-xl mx-auto">
          <label
            htmlFor="form-type"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Choose Form Type:
          </label>
          <select
            id="form-type"
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {formOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Dynamic Form Component */}
          <DynamicForm formType={formType} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 bg-gray-800 text-white text-center">
        <p className="text-sm">Dynamic Form Example © 2024</p>
      </footer>
    </div>
  );
};

export default App;

