import { CompaniesList } from "@features/dashboard/pages/root/CompaniesList";

export default function DashboardHomePage() {
  return (
    <div>
      <p>
        This is your protected dashboard. Below is the component demonstrating
        client-side caching.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <CompaniesList />
      </div>
    </div>
  );
}
