// components/landing/UpdatesSection.tsx
import { getLandingUpdates } from '@/lib/landing/database';
import UpdateList from './UpdateList';

const UpdatesSection = async () => {
  const updates = await getLandingUpdates();

  return (
    <section id="updates" className="section-alt-bg py-16 sm:py-24">
      <div className="section-container max-w-3xl">
        <h2 className="section-title">Project Updates & News</h2>
        {updates.length > 0 ? (
          <UpdateList updates={updates} />
        ) : (
          <p className="text-dark-text-secondary text-center">No updates posted yet. Check back soon!</p>
        )}
      </div>
    </section>
  );
};
export default UpdatesSection;
