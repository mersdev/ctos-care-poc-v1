import React from 'react';

interface SectionSummaryProps {
  title: string;
  data?: {
    [key: string]: string;
  };
}

const SectionSummary: React.FC<SectionSummaryProps> = ({ title, data = {} }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <p key={key}><strong>{key}:</strong> {value}</p>
        ))}
      </div>
    </section>
  );
};

export default SectionSummary;
