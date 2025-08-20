export interface CategoriesSectionProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  isUIBlocked: boolean;
  isRevealed: boolean;
  researcherCategories?: string[];
}
