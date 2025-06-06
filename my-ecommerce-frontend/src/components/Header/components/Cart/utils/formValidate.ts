export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipcode: number;
  country: string;
  postalCode: number;
  phoneNumber: string;
}

export const validateAddressForm = (data: CheckoutFormData) => {
  const errors: { [key in keyof CheckoutFormData]?: string } = {};

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.firstName?.trim()) {
    errors.firstName = "First name is required";
  }

  if (!data.lastName?.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!data.address?.trim()) {
    errors.address = "Address is required";
  }

  if (!data.city?.trim()) {
    errors.city = "City is required";
  }

  if (!data.state?.trim()) {
    errors.state = "State is required";
  }

  if (!data.zipcode || !/^\d{4,10}$/.test(String(data.zipcode))) {
    errors.zipcode = "Invalid zipcode";
  }

  if (!data.country?.trim()) {
    errors.country = "Country is required";
  }

  if (!data.postalCode || !/^\d{4,10}$/.test(String(data.postalCode))) {
    errors.postalCode = "Invalid postal code";
  }

  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!/^[+\d]?(?:[\d-.\s()]*)$/.test(data.phoneNumber)) {
    errors.phoneNumber = "Invalid phone number";
  }

  return errors;
};
