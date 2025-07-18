// src/features/profile/pages/ProfilePage.tsx
import { Profile } from "@components/Profile";
import { CacheAdminPanel } from "@components/CacheAdminPanel";

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile & Settings</h1>
      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2rem",
        }}
      >
        <section>
          <h2>User Information</h2>
          <Profile />
        </section>
        <section>
          <h2>App Experience</h2>
          {/* Theme settings and notification management will go here */}
          <p>
            Theme and notification settings will be added here in the future.
          </p>
        </section>
        <section>
          <h2>Cache Management</h2>
          <CacheAdminPanel />
        </section>
      </div>
    </div>
  );
}
