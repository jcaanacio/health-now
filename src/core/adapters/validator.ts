import { IHealthNowValidator } from '../interfaces/validator';
import validator from 'validator';

export const healthNowValidator: IHealthNowValidator = {
  isEmail: function (email: string): boolean {
    return validator.isEmail(email);
  },
};
