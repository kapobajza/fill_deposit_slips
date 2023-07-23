export type DepositSlip = {
  BankNumber: string;
  Amount: string;
  Municipality: string;
  RevenueType: string;
  PaymentType: string;
  DateFrom: string;
  DateTo: string;
  BudgetNumber: string;
  CallNumber: string;
  Reason: string;
};

export type DepositSlipOutput = {
  PioMio: DepositSlip;
  ZdravstvoKanton: DepositSlip;
  ZdravstvoFbih: DepositSlip;
  NezaposlenostKanton: DepositSlip;
  NezaposlenostFbih: DepositSlip;
};
