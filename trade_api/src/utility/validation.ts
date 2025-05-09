import * as Joi from 'joi';

export function validateStringMinMaxRequired(value: string, min: number, max: number): Joi.ValidationError | null {
  const { error } = Joi.string().min(min).max(max).required().validate(value);
  return error ?? null;
}

export function validateNumberMinMax(value: number, min: number, max: number): Joi.ValidationError | null {
  const { error } = Joi.number().min(min).max(max).validate(value);
  return error ?? null;
}

export function validateStringMinMax(value: string, min: number, max: number): Joi.ValidationError | null {
  const { error } = Joi.string().min(min).max(max).validate(value);
  return error ?? null;
}

export function validateNumberMinMaxRequired(value: number, min: number, max: number): Joi.ValidationError | null {
  const { error } = Joi.number().min(min).max(max).required().validate(value);
  return error ?? null;
}


export function validateNumberRequired(value: number): Joi.ValidationError | null {
  const { error } = Joi.number().required().validate(value);
  return error ?? null;
}

export function validateStringRequired(value: string): Joi.ValidationError | null {
  const { error } = Joi.string().required().validate(value);
  return error ?? null;
}

export function validateNumber(value: number): Joi.ValidationError | null {
  const { error } = Joi.number().validate(value);
  return error ?? null;
}

export function validateString(value: string): Joi.ValidationError | null {
  const { error } = Joi.string().validate(value);
  return error ?? null;
}

export function validateIp(value: string): Joi.ValidationError | null {
  const { error } = Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'optional' }).required().validate(value);
  return error ?? null;
}

export function validateCoordinate(value: { latitude: number; longitude: number }): Joi.ValidationError | null {
 
  const { error } = Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  }).required().validate(value);
  return error ?? null;
}

export function checkStatus(status: number): number | string {
  switch (status) {
    case 1:
      return 1;
    case 0:
      return 'Please complete your KYC (Know Your Customer) process to continue.';
    case 2:
      return 'Kindly provide your bank details to proceed.';
    case 3:
      return 'Your bank verification is currently pending and awaiting approval from our administrators.';
    case 5:
      return 'Your account has been blocked.';
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}

//export all functions
// export { validateString,}
