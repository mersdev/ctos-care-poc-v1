interface CCRISSubjectCommentsProps {
  data: string[]
}

const CCRISSubjectComments: React.FC<CCRISSubjectCommentsProps> = ({ data }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">CCRIS Subject Comments</h2>
      {data.length > 0 ? (
        <ul className="list-disc list-inside">
          {data.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>No CCRIS subject comments available.</p>
      )}
    </section>
  )
}

export default CCRISSubjectComments

