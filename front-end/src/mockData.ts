const mockData = {
  idVerification: {
    name: "John Smith",
    icNo: "123456-78-9012",
    dob: "01/01/1980",
    nationality: "Malaysian",
    address: "123 Main St, Kuala Lumpur, Malaysia"
  },
  creditInfoAtAGlance: {
    creditScore: 740,
    creditUtilization: 30,
    totalAccounts: 5,
    totalDebt: 25000,
    paymentHistory: 98,
    creditMix: 85
  },
  directorshipsBusinessInterests: [
    {
      name: "ABC Corporation",
      status: "Active",
      natureOfBusiness: "Technology",
      incorporationDate: "01/01/2010",
      ccmDate: "01/01/2010",
      position: "Director",
      appointedDate: "01/01/2010",
      address: "456 Tech St, Kuala Lumpur, Malaysia",
      paidUpShares: "1,000,000"
    },
    // Add more companies here...
  ],
  ctosScore: {
    score: 740,
    factors: [
      "Lack of recently established credit accounts",
      "No recent retail balance reported",
      "Too few loan and revolving/charge accounts with recent payment information"
    ]
  },
  ctosLitigationIndex: {
    index: 8712,
    description: "Civil Suit/Summon 1 > 96 months 2 Number of records"
  },
  bankingPaymentHistory: {
    accounts: [
      {
        bank: "Bank A",
        accountType: "Credit Card",
        status: "Active",
        paymentHistory: "Good"
      }
    ]
  },
  addressRecords: [
    {
      address: "123 Main St, Kuala Lumpur",
      dateReported: "2023-01-01",
      source: "Bank A"
    }
  ]
}

export default mockData
