import { DepositSlip } from './go_types';

export type ChromeMessageRequest = {
  type: 'fill_form';
  data: DepositSlip;
};
