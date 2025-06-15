import { EntryActions } from './EntryDetail/EntryActions';
import { EntryAnalytics } from './EntryDetail/EntryAnalytics';
import { EntryComments } from './EntryDetail/EntryComments';
import { EntryEvaluations } from './EntryDetail/EntryEvaluations';
import { EntryOriginalData } from './EntryDetail/EntryOriginalData';
import type { EntryDetailPageContentProps } from './EntryDetailPageContent.types';

const EntryDetailPageContent: React.FC<EntryDetailPageContentProps> = ({ entry }) => {
  const handleEdit = () => {
    // TODO: Implement edit functionality
    alert('Edit functionality to be implemented');
  };

  const handleFlag = () => {
    // TODO: Implement flag functionality
    alert('Flag functionality to be implemented');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Details for Entry: {entry.id}</h1>

      <EntryOriginalData entry={entry} />
      <EntryAnalytics entry={entry} />
      <EntryActions onEdit={handleEdit} onFlag={handleFlag} />
      {entry.comments && <EntryComments comments={entry.comments} />}
      {entry.evaluations && <EntryEvaluations evaluations={entry.evaluations} />}
    </div>
  );
};

export default EntryDetailPageContent;
