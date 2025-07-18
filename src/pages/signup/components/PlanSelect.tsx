import React from 'react';

const plans = [
  { key: 'business' },
  { key: 'premium' },
  { key: 'custom' },
];

type PlanSelectProps = {
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  getPlanLabel: (planKey: string) => string;
};

const PlanSelect: React.FC<PlanSelectProps> = ({ selectedPlan, setSelectedPlan, getPlanLabel }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Plan</label>
    <select
      value={selectedPlan}
      onChange={(e) => setSelectedPlan(e.target.value)}
      required
      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
    >
      {plans.map((plan) => (
        <option key={plan.key} value={plan.key}>
          {getPlanLabel(plan.key)}
        </option>
      ))}
    </select>
  </div>
);

export default PlanSelect; 