import React from "react";
import Head from "next/head";
import getConfig from "next/config";
import { loadStripe } from "@stripe/stripe-js";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const Home = ({ skus }) => {
  const stripe = React.useRef(null);
  const [basket, setBasket] = React.useState({});
  const items = Object.values(basket);
  const basketCount = items.reduce((current, previous) => {
    return current + previous.quantity;
  }, 0);

  async function checkout() {
    if (stripe.current) {
      try {
        await stripe.current.redirectToCheckout({
          items,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}`
        });
      } catch (error) {
        alert(error);
      }
    }
  }

  function addToBasket(sku) {
    return () => {
      setBasket({
        ...basket,
        [sku.id]: {
          sku: sku.id,
          quantity: basket[sku.id] ? basket[sku.id].quantity + 1 : 1
        }
      });
    };
  }

  React.useEffect(() => {
    async function load() {
      stripe.current = await loadStripe(publicRuntimeConfig.STRIPE_PUBLIC);
    }

    load();
  });

  return (
    <div>
      <Head>
        <title>One Click Shop Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ position: "fixed", top: 0, right: 0 }}>
        Basket ({basketCount})
        <button onClick={checkout} disabled={basketCount === 0}>
          Checkout
        </button>
      </div>

      <ul>
        {skus.map(sku => (
          <li key={sku.id}>
            <p>{sku.attributes.name}</p>
            <div>
              <img src={sku.image} width="100" />
            </div>
            <button onClick={addToBasket(sku)}>Add to Basket</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function getSkus() {
  return new Promise(resolve => {
    const stripe = require("stripe")(serverRuntimeConfig.STRIPE_SECRET);

    stripe.skus.list({ limit: 20 }, function(err, skus) {
      resolve(skus);
    });
  });
}

export async function getStaticProps() {
  const skus = await getSkus();

  return {
    props: { skus: skus.data }
  };
}

export default Home;
