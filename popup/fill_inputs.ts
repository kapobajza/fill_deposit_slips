import { DepositSlip } from './go_types';

type SelectInputName = 'municipality' | 'payment_type' | 'type_of_revenue';

type SelectInputOrNode =
  | {
      type: 'select';
      input: HTMLSelectElement | null;
      name: SelectInputName;
    }
  | {
      type: 'node';
      input: NodeListOf<HTMLInputElement> | null;
    }
  | {
      type: 'input';
      input: HTMLInputElement | null;
    };

export function fillInputs(depositSlip: DepositSlip) {
  const inputs: Record<keyof DepositSlip, SelectInputOrNode> = {
    Reason: {
      input: document.getElementById('note') as HTMLInputElement,
      type: 'input',
    },
    Amount: {
      input: document.getElementById('amount') as HTMLInputElement,
      type: 'input',
    },
    DateFrom: {
      input: document.getElementById('taxation_date_from') as HTMLInputElement,
      type: 'input',
    },
    DateTo: {
      input: document.getElementById('taxation_date_to') as HTMLInputElement,
      type: 'input',
    },
    BankNumber: {
      input: document.querySelectorAll('[data-origin="beneficiary_account"]'),
      type: 'node',
    },
    BudgetNumber: {
      input: document.querySelectorAll('[data-origin="budgetary_unit"]'),
      type: 'node',
    },
    CallNumber: {
      input: document.querySelectorAll('[data-origin="payee_tax_ref_no"]'),
      type: 'node',
    },
    Municipality: {
      input: document.getElementById('municipality') as HTMLSelectElement,
      type: 'select',
      name: 'municipality',
    },
    PaymentType: {
      input: document.getElementById('payment_type') as HTMLSelectElement,
      type: 'select',
      name: 'payment_type',
    },
    RevenueType: {
      input: document.getElementById('type_of_revenue') as HTMLSelectElement,
      type: 'select',
      name: 'type_of_revenue',
    },
  };

  Object.keys(inputs).forEach((key) => {
    const inputKey = key as keyof DepositSlip;
    const selectInpurOrNode = inputs[inputKey];
    const value = depositSlip[inputKey];

    if (selectInpurOrNode?.input && value) {
      switch (selectInpurOrNode.type) {
        case 'input':
          selectInpurOrNode.input.value = value;
          break;

        case 'node':
          const values = (value as string).split('');
          for (let i = 0; i < selectInpurOrNode.input.length; i++) {
            const element = selectInpurOrNode.input[i];
            element.value = values[i];
          }
          break;

        case 'select':
          const options = selectInpurOrNode.input.options;
          for (let i = 0; i < options.length; i++) {
            const option = options[i];

            if (option.value.toLowerCase() === value.toLowerCase()) {
              const spanSelectPlaceholder = document.getElementById(`select2-${selectInpurOrNode.name}-container`);

              if (spanSelectPlaceholder) {
                spanSelectPlaceholder.innerHTML =
                  selectInpurOrNode.name === 'payment_type' ? option.innerHTML : option.value;
              }

              option.selected = true;
              break;
            }
          }
          break;
      }
    }
  });
}
