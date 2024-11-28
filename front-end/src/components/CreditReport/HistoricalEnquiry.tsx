interface HistoricalEnquiryProps {
  data: {
    financial: number
    nonFinancial: number
    lawyer: number
    others: number
  }
}

const HistoricalEnquiry: React.FC<HistoricalEnquiryProps> = ({ data }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Historical Enquiry</h2>
      <div className="grid grid-cols-2 gap-4">
        <p><strong>Financial:</strong> {data.financial}</p>
        <p><strong>Non-Financial:</strong> {data.nonFinancial}</p>
        <p><strong>Lawyer:</strong> {data.lawyer}</p>
        <p><strong>Others:</strong> {data.others}</p>
      </div>
    </section>
  )
}

export default HistoricalEnquiry

