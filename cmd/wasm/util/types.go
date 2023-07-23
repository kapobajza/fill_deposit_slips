package util

type DepositSlip struct {
	BankNumber   string
	Amount       string
	Municipality string
	RevenueType  string
	PaymentType  string
	DateFrom     string
	DateTo       string
	BudgetNumber string
	CallNumber   string
	Reason       string
}

type DepositSlipOutput struct {
	PioMio              DepositSlip
	ZdravstvoKanton     DepositSlip
	ZdravstvoFbih       DepositSlip
	NezaposlenostKanton DepositSlip
	NezaposlenostFbih   DepositSlip
}
