interface CCRISDerivativesProps {
  data: {
    earliestKnownFacility: string
    securedFacilities: string[]
    unsecuredFacilities: string[]
  }
}

const CCRISDerivatives: React.FC<CCRISDerivativesProps> = ({ data }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">CCRIS Derivatives</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Earliest Known Facility</h3>
          <p>{data.earliestKnownFacility}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Secured Facilities</h3>
          <ul className="list-disc list-inside">
            {data.securedFacilities.map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Unsecured Facilities</h3>
          <ul className="list-disc list-inside">
            {data.unsecuredFacilities.map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CCRISDerivatives

