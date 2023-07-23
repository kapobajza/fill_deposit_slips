package util

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"
)

type DepositSlipType string

const (
	PioMio              = "PIO/MIO"
	ZdravstvoKanton     = "ZDRAVSTVO 89,8%"
	ZdravstvoFbih       = "ZDRAVSTVO 10,2%"
	NezaposlenostKanton = "NEZAPOSLENOST 70%"
	NezaposlenostFbih   = "NEZAPOSLENOST 30%"
)

const (
	layoutISO   = "2006-01-02 00:00:00"
	layoutBA    = "01.02.2006"
	layoutMonth = "1"
	layoutYear  = "06"
)

func getSvrha(month string, year string, extra string) string {
	return fmt.Sprintf("DOPRINOSI %s/%s %s", month, year, extra)
}

func GetParsedDepositSlipOutput(fileTxt string) (DepositSlipOutput, error) {
	fileLines := strings.Split(fileTxt, "\n")

	depositSlipOutput := DepositSlipOutput{}

	for i, line := range fileLines {
		if i < 2 || line == "" {
			continue
		}

		lines := strings.Split(line, "\t")

		amount, err := strconv.ParseFloat(lines[4], 32)

		if err != nil {
			return DepositSlipOutput{}, err
		}

		dateFrom := lines[10]
		dateTo := lines[11]
		var month string
		var year string

		if parsedDateFrom, err := time.Parse(layoutISO, dateFrom); err != nil {
			return DepositSlipOutput{}, err
		} else {
			dateFrom = parsedDateFrom.Format(layoutBA)
			month = parsedDateFrom.Format(layoutMonth)
			year = parsedDateFrom.Format(layoutYear)
		}

		if parsedDateTo, err := time.Parse(layoutISO, dateTo); err != nil {
			return DepositSlipOutput{}, err
		} else {
			dateTo = parsedDateTo.Format(layoutBA)
		}

		depositSlip := DepositSlip{
			BankNumber:   lines[2],
			Amount:       strings.ReplaceAll(fmt.Sprintf("%.2f", amount), ".", ","),
			PaymentType:  lines[8],
			RevenueType:  lines[9],
			DateFrom:     dateFrom,
			DateTo:       dateTo,
			Municipality: lines[12],
			BudgetNumber: lines[13],
			CallNumber:   lines[14],
		}

		lineLowerCase := strings.ToLower(line)

		switch true {
		case strings.Contains(lineLowerCase, strings.ToLower(PioMio)):
			depositSlip.Reason = getSvrha(month, year, fmt.Sprintf("DOP. ZA %s", PioMio))
			depositSlipOutput.PioMio = depositSlip

		case strings.Contains(lineLowerCase, strings.ToLower(ZdravstvoKanton)):
			depositSlip.Reason = getSvrha(month, year, ZdravstvoKanton)
			depositSlipOutput.ZdravstvoKanton = depositSlip

		case strings.Contains(lineLowerCase, strings.ToLower(ZdravstvoFbih)):
			depositSlip.Reason = getSvrha(month, year, ZdravstvoFbih)
			depositSlipOutput.ZdravstvoFbih = depositSlip

		case strings.Contains(lineLowerCase, strings.ToLower(NezaposlenostKanton)):
			depositSlip.Reason = getSvrha(month, year, NezaposlenostKanton)
			depositSlipOutput.NezaposlenostKanton = depositSlip

		case strings.Contains(lineLowerCase, strings.ToLower(NezaposlenostFbih)):
			depositSlip.Reason = getSvrha(month, year, NezaposlenostFbih)
			depositSlipOutput.NezaposlenostFbih = depositSlip
		}
	}

	return depositSlipOutput, nil
}

func ConvertDepositSlipOutputToMap(value DepositSlipOutput) (map[string]interface{}, error) {
	var outputMap map[string]interface{}

	if outputJson, err := json.Marshal(value); err != nil {
		return make(map[string]interface{}), err
	} else {
		err := json.Unmarshal(outputJson, &outputMap)
		return outputMap, err
	}
}
