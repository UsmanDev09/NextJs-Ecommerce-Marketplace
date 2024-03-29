import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

import  Product  from "../model/product";

import "../styles/globals.css";
import { Navbar } from "../components/Navbar/Navbar";
import  Footer  from "../components/Footer/Footer";
import  Category  from "../model/category";
import CategoryAPI from "../api/category/category";
import ProductAPI from "../api/product/product";

function MyApp({ Component, pageProps, arrayOfCategories }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("cart"))
        setCart(JSON.parse(localStorage.getItem("cart") || "{}"));
        calculateSubTotal()
    } catch (error) {
      localStorage.clear();
    }

  }, []);

  const calculateSubTotal =  async () => {
    const newCart = await JSON.parse(localStorage.getItem("cart") || "{}")
    let subtotal = 0;
    for (let i = 0; i < Object.keys(newCart).length; i++) {
      subtotal +=
        newCart[Object.keys(newCart)[i]].price *
        newCart[Object.keys(newCart)[i]].quantity;
    }
    setSubTotal(subtotal);
  }
  const saveCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    let subtotal = 0;
    for (let i = 0; i < Object.keys(cart).length; i++) {
      subtotal +=
        newCart[Object.keys(cart)[i]].price *
        newCart[Object.keys(cart)[i]].quantity;
    }
    setSubTotal(subtotal);
  };

  const removeProductFromCart = (id) => {
    let newCart = cart;

    delete newCart[id];

    setCart(newCart);
    saveCart(newCart);
  }
  const addToCart = (
    id,
    product,
    quantity,
    price,
    name
  ) => {
    let newCart = cart;

    if (id in cart) newCart[id].quantity = newCart[id].quantity + 1;
    else newCart[id] = { product, price, quantity, name };

    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (id) => {
    let newCart = cart;
    if (id in cart) newCart[id].quantity = newCart[id].quantity - 1;

    if (newCart[id].quantity <= 0) delete newCart[id];

    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const searchHandler = async (searchValue, categoryId) => {
    if (categoryId !== null) {
      setSearching(true);
      setSearchResults([]);
      const response = await ProductAPI.getAllProducts(categoryId)
      const products = await response.json();
      products.forEach((product) => {
        if (product.name === searchValue)
          setSearchResults([...searchResults, product]);
      });
    }
  };

  return (
   <>
    <div className="h-auto">
      <Navbar
        pageProps={pageProps}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        removeProductFromCart={removeProductFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        searchHandler={searchHandler}
        categories={arrayOfCategories}
      />
    </div>
      <Component
        searchResults={searchResults}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        removeProductFromCart={removeProductFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        {...pageProps}
        categories={arrayOfCategories}
      />
      <Footer />
      </>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  try {
    const response = await CategoryAPI.getAllCategories()
    const categories = await response.json();
    const arrayOfCategories = Object.entries(categories).map((e) => ( { [e[0]]: e[1] } ))
    let pageProps = {};
    if (Component.getInitialProps)
      pageProps = await Component.getInitialProps(ctx);

    return { pageProps, arrayOfCategories };
  } catch (error) {
    return {
      props: { errCode: 500, message: error },
    };
  }
};

export default MyApp;
