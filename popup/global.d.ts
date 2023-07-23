import { DepositSlipOutput } from './go_types';

declare global {
  class Go {
    importObject: WebAssembly.Imports;
    run: (instance: WebAssembly.Instance) => void;
  }

  function getDepositSlipOutput(txtFile: string): DepositSlipOutput | string;
}

export {};
