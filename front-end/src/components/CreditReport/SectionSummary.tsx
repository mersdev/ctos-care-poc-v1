interface SectionSummaryProps {
  data: {
    [key: string]: string
  }
}

const SectionSummary: React.FC<SectionSummaryProps> = ({ data }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Section Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <p key={key}><strong>{key}:</strong> {value}</p>
        ))}
      </div>
    </section>
  )
}

export default SectionSummary

