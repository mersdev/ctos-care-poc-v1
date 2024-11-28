interface LegalCase {
  caseType: string
  status: string
  petitioner: string
  caseNumber: string
  petitionDate: string
  amount: number
  comments: string
}

interface LegalCasesDefendantProps {
  data: LegalCase[]
}

const LegalCasesDefendant: React.FC<LegalCasesDefendantProps> = ({ data }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Legal Cases (Subject as Defendant)</h2>
      {data.length > 0 ? (
        <div className="space-y-6">
          {data.map((legalCase, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="text-xl font-semibold">{legalCase.caseType}</h3>
              <p><strong>Status:</strong> {legalCase.status}</p>
              <p><strong>Petitioner:</strong> {legalCase.petitioner}</p>
              <p><strong>Case Number:</strong> {legalCase.caseNumber}</p>
              <p><strong>Petition Date:</strong> {legalCase.petitionDate}</p>
              <p><strong>Amount:</strong> RM {legalCase.amount.toLocaleString()}</p>
              <p><strong>Comments:</strong> {legalCase.comments}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No legal cases found where the subject is a defendant.</p>
      )}
    </section>
  )
}

export default LegalCasesDefendant

