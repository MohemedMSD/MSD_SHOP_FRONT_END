import Stripe from "stripe";

const stripe = new Stripe('sk_test_51M8kcYDB8PJeqd28FNx1acD4JYEacqAHYWGGCGsN67V6WnTcWsGcNdlTvwUZTefdEdwNpBbYZ2CFCLn2nTCjW6vr00teNeAFmU');

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const params = {
        submit_type : 'pay',
        mode : 'payment',
        payment_method_types : ['card'],
        billing_address_collection : 'auto',
        shipping_options : [
            {shipping_rate : 'shr_1M8kvXDB8PJeqd289BhEM5SG'},
            {shipping_rate : 'shr_1M8kwZDB8PJeqd28v0ZQf6ID'}
        ],
        line_items: req.body.map((item)=>{
            return {
                price_data : {
                    currency : 'usd',
                    product_data : {
                        name : item.product.name,
                    },
                    unit_amount : item.product.price * 100,
                },
                adjustable_quantity : {
                    enabled : true,
                    minimum : 1
                },
                quantity : item.quantity
            }
        }),
        success_url: `${req.headers.origin}`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      };
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
