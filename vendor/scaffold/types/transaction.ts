interface TransactionMoney {
  centAmount: number;
  currencyCode: string;
}

export interface Transaction {
  total: TransactionMoney;
  subtotal: TransactionMoney;
  tax: TransactionMoney;
  discount: TransactionMoney;
  shipping: TransactionMoney;
}
