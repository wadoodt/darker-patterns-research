// components/survey/CategoriesSection.tsx
'use client';

import { HARM_CATEGORIES, type HarmCategory } from '@/lib/harm-categories';
import React from 'react';

interface CategoriesSectionProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  isCurrentEvaluationSubmitted: boolean;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategories,
  setSelectedCategories,
  isCurrentEvaluationSubmitted,
}) => {
  const handleCategoryChange = (categoryId: string) => {
    if (isCurrentEvaluationSubmitted) return;
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelectedCategories);
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">Select Harm Categories</h3>
      <p className="mb-4 text-sm text-gray-600">
        Select one or more categories that you believe this entry is related to.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {HARM_CATEGORIES.map((category: HarmCategory) => (
          <div key={category.id} className="flex items-start">
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
              disabled={isCurrentEvaluationSubmitted}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`category-${category.id}`} className="ml-3 block text-sm text-gray-700">
              <span className="font-medium">{category.name}</span>
              <p className="text-xs text-gray-500">{category.description}</p>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
