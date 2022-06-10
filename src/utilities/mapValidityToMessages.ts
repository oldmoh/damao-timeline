export default (validity: ValidityState) => {
  if (validity.valid) return null

  if (validity.valueMissing)
    return {
      id: '',
      defaultMessage: 'Value is missing.',
    }
  if (validity.tooLong)
    return {
      id: '',
      defaultMessage: 'The length of the input is too long.',
    }
  if (validity.tooShort)
    return {
      id: '',
      defaultMessage: 'The length of the input is too short.',
    }
  if (validity.rangeOverflow)
    return {
      id: '',
      defaultMessage: 'The value is greater than the maximum.',
    }
  if (validity.rangeUnderflow)
    return {
      id: '',
      defaultMessage: 'The value is less than the minimum.',
    }
  if (validity.patternMismatch)
    return {
      id: '',
      defaultMessage: 'The value is incorrect.',
    }
  if (validity.typeMismatch)
    return {
      id: '',
      defaultMessage: 'The format is incorrect.',
    }

  return {
    id: '',
    defaultMessage: 'Unkown.',
  }
}
