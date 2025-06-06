import { CheckoutFormData } from "../../../utils/formValidate";

interface OrderAddressInterface {
  orderAddress: CheckoutFormData;
}

const OrderAddress: React.FC<OrderAddressInterface> = ({ orderAddress }) => {
  const {
    email,
    firstName,
    lastName,
    address,
    city,
    state,
    zipcode,
    country,
    postalCode,
    phoneNumber,
  } = orderAddress;
  return (
    <div className="text-left space-y-1 text-sm text-slate-500">
      <div>
        <span className="font-medium">Name: </span>
        {firstName} {lastName}
      </div>
      <div>
        <span className="font-medium">Email: </span>
        {email}
      </div>
      <div>
        <span className="font-medium">Address: </span>
        {address}
      </div>
      <div>
        <span className="font-medium">City: </span>
        {city}
      </div>
      <div>
        <span className="font-medium">State: </span>
        {state}
      </div>
      <div>
        <span className="font-medium">Zipcode: </span>
        {zipcode}
      </div>
      <div>
        <span className="font-medium">Country: </span>
        {country}
      </div>
      <div>
        <span className="font-medium">Postal Code: </span>
        {postalCode}
      </div>
      <div>
        <span className="font-medium">Phone: </span>
        {phoneNumber}
      </div>
    </div>
  );
};

export default OrderAddress;
