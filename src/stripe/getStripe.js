import { loadStripe } from "@stripe/stripe-js";
let StripePromise;
const getStripe = () => {
  if (!StripePromise) {
    StripePromise = loadStripe('pk_test_51M8kcYDB8PJeqd28OUAR0a6cvTIBZ96k3z3NoxDLdRCnvpFFrrguNHQAa6DGQ8BnEOHlQrN2POrbO6KLAqLHNZ2p00LFdpMXwk');
  }
  return StripePromise;
};
export default getStripe
