package main

import (
	"fmt"
	"syscall/js"

	util "github.com/golangbot/webassembly/cmd/wasm/util"
)

func getDepositSlipOutput() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 1 {
			return "Invalid no of arguments passed"
		}

		fileTxt := args[0].String()

		if depositSlipOutput, err := util.GetParsedDepositSlipOutput(fileTxt); err != nil {
			return fmt.Sprintf("An error occured: %s", err)
		} else {
			if outputMap, err := util.ConvertDepositSlipOutputToMap(depositSlipOutput); err != nil {
				return fmt.Sprintf("An error while converting struct to JSON: %s", err)
			} else {
				return outputMap
			}
		}
	})
}

func main() {
	js.Global().Set("getDepositSlipOutput", getDepositSlipOutput())
	<-make(chan bool)
}
