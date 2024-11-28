interface Cheque {
  date: string
  amount: number
  reason: string
}

interface DishonouredChequesProps {
  data: Cheque[]
}

const DishonouredCheques: React.FC<DishonouredChequesProps> = ({ data }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Dishonoured Cheques</h2>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Date</th>
              <th className="text-left">Amount (RM)</th>
              <th className="text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cheque, index) => (
              <tr key={index}>
                <td>{cheque.date}</td>
                <td>{cheque.amount.toLocaleString()}</td>
                <td>{cheque.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No dishonoured cheques reported.</p>
      )}
    </section>
  )
}

export default DishonouredCheques

