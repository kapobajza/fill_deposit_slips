package util

import (
	"os"
	"testing"
)

func TestGetParsedMap(t *testing.T) {
	fileBytes, err := os.ReadFile("input.txt")

	if err != nil {
		t.Error(err)
	}

	fileTxt := string(fileBytes)

	if depositSlipOutput, err := GetParsedDepositSlipOutput(fileTxt); err != nil {
		t.Error(err)
	} else {
		emptyDepositSlip := DepositSlip{
			BankNumber:   "",
			Amount:       "",
			Municipality: "",
			RevenueType:  "",
			PaymentType:  "",
			DateFrom:     "",
			DateTo:       "",
			BudgetNumber: "",
			CallNumber:   "",
		}

		switch true {
		case depositSlipOutput.PioMio == emptyDepositSlip:
			t.Error("depositSlipOutput.pioMio is empty")

		case depositSlipOutput.ZdravstvoKanton == emptyDepositSlip:
			t.Error("depositSlipOutput.zdravstvoKanton is empty")

		case depositSlipOutput.ZdravstvoFbih == emptyDepositSlip:
			t.Error("depositSlipOutput.zdravstvoFbih is empty")

		case depositSlipOutput.NezaposlenostKanton == emptyDepositSlip:
			t.Error("depositSlipOutput.nezaposlenostKanton is empty")

		case depositSlipOutput.NezaposlenostFbih == emptyDepositSlip:
			t.Error("depositSlipOutput.nezaposlenostFbih is empty")
		}
	}
}

func TestDeposlitSlipOutputToMapConversion(t *testing.T) {
	fileBytes, err := os.ReadFile("input.txt")

	if err != nil {
		t.Error(err)
	}

	fileTxt := string(fileBytes)

	if depositSlipOutput, err := GetParsedDepositSlipOutput(fileTxt); err != nil {
		t.Error(err)
	} else {
		_, err := ConvertDepositSlipOutputToMap(depositSlipOutput)

		if err != nil {
			t.Error(err)
		}
	}
}
