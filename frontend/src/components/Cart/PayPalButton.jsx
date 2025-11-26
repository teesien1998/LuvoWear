import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        shape: "pill",
      }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            { amount: { value: parseFloat(amount).toFixed(2) } },
          ],
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then(onSuccess);
      }}
      onError={onError}
    ></PayPalButtons>
  );
};

export default PayPalButton;
