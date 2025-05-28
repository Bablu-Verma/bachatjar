/* eslint-disable @typescript-eslint/no-explicit-any */
export const validateField = (
    field: any,
    fieldName: string,
    options: {
      isOptional?: boolean;
      type?: "string" | "number" | "boolean" | "array" | "object";
      maxLength?: number;
      minLength?: number;
      regex?: RegExp;
    } = {}
  ) => {
    const { isOptional = false, type, maxLength, minLength, regex } = options;
  
    if (isOptional && (field === null || field === undefined)) {
      return null;
    }
  
    if (!isOptional && (field === null || field === undefined)) {
      return {
        success: false,
        message: `${fieldName} is required.`,
      };
    }
  
    if (type && typeof field !== type) {
      return {
        success: false,
        message: `${fieldName} must be of type ${type}.`,
      };
    }
  
    if (maxLength && field.length > maxLength) {
      return {
        success: false,
        message: `${fieldName} must not exceed ${maxLength} characters.`,
      };
    }
  
    if (minLength && field.length < minLength) {
      return {
        success: false,
        message: `${fieldName} must be at least ${minLength} characters long.`,
      };
    }
  
    if (regex && !regex.test(field)) {
      return {
        success: false,
        message: `${fieldName} is not in the correct format.`,
      };
    }
  
    return null;
  };