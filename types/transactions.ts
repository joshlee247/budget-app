    // "id": "8lWZBg4W6jFl4LqdGWM8IN5ZgJwgbQiW8kV3E",
    // "name": "Uber 072515 SF**POOL**",
    // "paymentChannel": "online",
    // "type": "online",
    // "accountId": "jjw7Qv3wpmcbL18ADgNXI8BwAd9oQpt6gPkEQ",
    // "amount": 6.33,
    // "pending": false,
    // "category": "Travel",
    // "date": "2024-08-05",
    // "image": "https://plaid-merchant-logos.plaid.com/uber_1060.png"

export interface Transaction {
    id: string,
    name: string,
    paymentChannel: string,
    type: string,
    accountId: string,
    amount: number,
    pending: boolean,
    category: string,
    date: string,
    image: string,
}