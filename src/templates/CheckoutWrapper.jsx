import React from "react";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js/pure';
import {PaymentEdit} from "../components/Payment";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_live_51I8pT5AEMs7h09kaGUH7QvPjiiY2w84WyjpHSUb05CmsbHuYVdOiKEZmJGNG5oa331t9Bg7yzBAtfn2MrZJ7wgLD00ANO7LGnw');

const CheckoutWrapper = () => {
  return (
    <Elements stripe={stripePromise} >
      <PaymentEdit />
    </Elements>
  )
}

export default CheckoutWrapper
