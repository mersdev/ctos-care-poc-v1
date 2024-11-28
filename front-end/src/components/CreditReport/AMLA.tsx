interface AMLAProps {
  data: {
    inquiries: number
    matches: {
      name: string
      icNumber: string
    }[]
  }
}

const AMLA: React.FC<AMLAProps> = ({ data }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">AMLA (Anti Money Laundering Act)</h2>
      <p><strong>Total Inquiries (past 24 months):</strong> {data.inquiries}</p>
      {data.matches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Matches in Money Laundering Database:</h3>
          <ul className="list-disc list-inside">
            {data.matches.map((match, index) => (
              <li key={index}>
                Name: {match.name}, IC Number: {match.icNumber}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default AMLA

