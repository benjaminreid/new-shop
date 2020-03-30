import React from "react";
import Head from "next/head";
import { loadStripe } from "@stripe/stripe-js";

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
          successUrl: "http://localhost:3000/success",
          cancelUrl: "http://localhost:3000/"
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
      stripe.current = await loadStripe("pk_test_0LgaoTtxkfBoQqTFB3rvGlvO");
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
    const stripe = require("stripe")("sk_test_5OLgl3WAkUxwrUB6O6U1F6m0");

    stripe.skus.list({ limit: 3 }, function(err, skus) {
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
