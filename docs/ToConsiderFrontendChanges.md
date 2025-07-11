Frontend Architecture
App Router Structure
src/app/
├── (info)/ # Static info pages
│ ├── about/
│ ├── privacy/
│ └── terms/
├── (survey)/ # Survey flow
│ ├── demographics/
│ ├── instructions/
│ ├── evaluation/
│ └── completion/
├── admin/ # Admin dashboard
│ ├── overview/
│ ├── entries/
│ ├── evaluations/
│ └── statistics/
├── login/
├── signup/
├── layout.tsx # Root layout
└── page.tsx # Landing page
Component Organization
src/components/
├── ui/ # Base components (ShadCN)
│ ├── button.tsx
│ ├── card.tsx
│ ├── dialog.tsx
│ └── ...
├── common/ # Shared components
│ ├── Header.tsx
│ ├── Footer.tsx
│ ├── LoadingSpinner.tsx
│ └── ErrorBoundary.tsx
├── auth/ # Authentication
│ ├── LoginForm.tsx
│ └── SignupForm.tsx
├── survey/ # Survey specific
│ ├── DemographicsForm.tsx
│ ├── EvaluationCard.tsx
│ └── ProgressIndicator.tsx
└── admin/ # Admin specific
├── DashboardStats.tsx
├── EntriesTable.tsx
└── ExportDialog.tsx

// Component with proper TypeScript interface
interface ComponentProps {
data: DataType[];
onAction?: (item: DataType) => void;
className?: string;
loading?: boolean;
}

export function MyComponent({
data,
onAction,
className,
loading = false
}: ComponentProps) {
// Local state
const [selectedItem, setSelectedItem] = useState<DataType | null>(null);

// Custom hooks
const { user } = useAuth();

// Event handlers
const handleItemClick = useCallback((item: DataType) => {
setSelectedItem(item);
onAction?.(item);
}, [onAction]);

// Loading state
if (loading) {
return <Skeleton className="h-32" />;
}

return (
<div className={cn("my-component", className)}>
{data.map(item => (
<div
key={item.id}
onClick={() => handleItemClick(item)}
className="cursor-pointer hover:bg-gray-100" >
{item.name}
</div>
))}
</div>
);
}
