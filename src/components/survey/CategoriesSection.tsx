// components/survey/CategoriesSection.tsx
'use client';

import { HARM_CATEGORIES, type HarmCategory } from '@/lib/harm-categories';
import React from 'react';
import { CategoriesSectionProps } from './CategoriesSection.types';
import { CheckCircle } from 'lucide-react';

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategories,
  setSelectedCategories,
  isUIBlocked,
  isRevealed,
  researcherCategories = [],
}) => {
  const handleCategoryChange = (categoryId: string) => {
    if (isUIBlocked) return;
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
        {HARM_CATEGORIES.map((category: HarmCategory) => {
          const isResearcherChoice = isRevealed && researcherCategories.includes(category.id);
          return (
            <div key={category.id} className="flex items-start">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                disabled={isUIBlocked}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`category-${category.id}`} className="ml-3 block text-sm text-gray-700">
                <span className="flex items-center font-medium">
                  {category.name}
                  {isResearcherChoice && (
                    <span className="ml-2 flex items-center text-xs text-green-600">
                      <CheckCircle size={14} className="mr-1" />
                      Researcher
                    </span>
                  )}
                </span>
                <p className="text-xs text-gray-500">{category.description}</p>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSection;
