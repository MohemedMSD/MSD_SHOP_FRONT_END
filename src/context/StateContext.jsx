import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";

import Axios from "../assets/constants/axios/axios";
const Context = createContext();

const StateContext = ({ children }) => {

  const [user, _setUser] = useState(
		JSON.parse(localStorage.getItem('user')) || null
	);

  const [showCart, setshowCart] = useState(false);

  const [baseUrl, setbaseUrl] = useState('')

  const [cardItems, setcardItems] = useState([]);
  
  const [Notifications, setNotifications] = useState([])
  const [Orders, setOrders] = useState([]);

  const [FilteredOrders, setFilteredOrders] = useState([]);

  const [totalPrice, settotalPrice] = useState(0);
  const [totalQuantity, settotalQuantity] = useState(0);

  const [isAddingOnCart, setisAddingOnCart] = useState(false)

  const [qty, setqty] = useState(1);

	// set user to local storage
	const setUser = (user, baseUrl) => {

		if (user) {

			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('token', user.token);
      const now = new Date;
      const expirationTime = now.getTime() + (1 * 24 * 60 * 60 * 1000)
			localStorage.setItem('expirationTime', expirationTime);

      if (baseUrl) {
        localStorage.setItem('baseUrl', baseUrl)
      }

		} else {

			localStorage.removeItem('user');
			localStorage.removeItem('token');
			localStorage.removeItem('expirationTime');
      localStorage.removeItem('baseUrl')

		}

		_setUser(user);

	};

  const incQty = (ProductQty) => {

    if (qty + 1 <= ProductQty) {
      setqty((preqty) => preqty + 1);
    }

  };

  const decQty = () => {
    setqty((preqty) => {
      if (preqty - 1 < 1) return 1;
      return preqty - 1;
    });
  };

  const removeProductInCart = (id) => {

    let newCartItem = cardItems?.filter((item) => {
      return item.id !== id;
    });

    const ProductRemoved = cardItems?.find((item) => item.id === id);

    setcardItems(newCartItem);
    settotalQuantity(
      (pretotalQuantity) => pretotalQuantity - ProductRemoved?.quantity
    );

    settotalPrice(
      (pretotalPrice) =>
        pretotalPrice -
        parseInt(ProductRemoved?.product.price * ProductRemoved?.quantity)
    );

    Axios.delete('/card/' + id)
    .catch(rej => console.log(rej)) 

  };

  const toggleCartChangeQty = (id, value, ProductQty) => {
    
    let newCardItems = cardItems?.map((item) => {

      if (item.id === id) {

        if (value === "plus") {

          if (item.quantity + 1 <= ProductQty) {

            item.quantity = item.quantity + 1;
            
            settotalPrice(
              (pretotalPrice) => pretotalPrice + parseInt(item.product.price)
            );
  
            settotalQuantity((pretotalQuantity) => pretotalQuantity + 1);

            
            Axios.put('/card/' + item.id, {
              quantity : item.quantity
            }, {
              headers : {
                'Content-Type' : 'text/json'
              }
            })
            .catch(rej => console.log(rej)) 

          }

        } else if (value === "minus") {

          if (item.quantity - 1 < 1) {

            item.quantity = 1;

          } else {

            item.quantity = item.quantity - 1;

            settotalPrice((pretotalPrice) => {

              if (pretotalPrice - parseInt(item.product.price) < 0) return pretotalPrice;
              return pretotalPrice - parseInt(item.product.price);

            });

            settotalQuantity((pretotalQuantity) => {

              if (pretotalQuantity - 1 < 0) return pretotalQuantity;
              return pretotalQuantity - 1;

            });

          }

          Axios.put('/card/' + item.id, {
            quantity : item.quantity
          }, {
            headers : {
              'Content-Type' : 'text/json'
            }
          })
          .catch(rej => console.log(rej)) 

        }

      }

      return item;

    });
    setcardItems(newCardItems);
  };

  const AddOn = (product, quantity) => {

    const checkProductIfExists = cardItems?.find(
      (item) => item.product.id === product.id
    );

    if (checkProductIfExists) {
      
      const updateCardItems = cardItems.map((item) => {
        
        if (item.id === checkProductIfExists.id) {

          if (item.product.quantity >= item.quantity + quantity) {

            setisAddingOnCart(true)

            Axios.put('/card/' + checkProductIfExists.id, {
              quantity : checkProductIfExists.quantity + quantity
            }, {
              headers : {
                'Content-Type' : 'text/json'
              }
            })
            .then((res) => {

              setisAddingOnCart(false)

              toast.success(`${product.name} added in your cart`);

              settotalPrice(
                (pretotalPrice) =>
                  pretotalPrice + parseInt(product.price) * parseInt(quantity)
              );
          
              settotalQuantity((pretotalQuantity) => pretotalQuantity + quantity);

            })
            .catch(rej => console.log(rej)) 

            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }

        }

        return item

      });

      setcardItems(updateCardItems);
      
    } else if(product.quantity >= quantity){
      
      setisAddingOnCart(true)
      Axios.post('/card',{
        product_id : product.id,
        quantity : quantity
      }, {
        headers : {
          'Content-Type' : 'text/json'
        }
      })
      .then((res) => {


        if (res.status === 200) {
          
          setisAddingOnCart(false)
          setcardItems([...cardItems, res.data.card]);

          toast.success(`${product.name} added in your cart`);

          settotalPrice(
            (pretotalPrice) =>
              pretotalPrice + parseInt(product.price) * parseInt(quantity)
          );
      
          settotalQuantity((pretotalQuantity) => pretotalQuantity + quantity);

        }

      })
      .catch((rej) => {
        setisAddingOnCart(false)
      })

      
    }

    
    // toast.success(`${product.name} added in your cart`);
  };

  const getCardItems = () => {
    Axios.get('/card')
    .then((res)=>{
      
      if (res.status === 200) {
        
        setcardItems(res.data.card)

      }

    })
    .catch((rej) => console.log(rej))
  } 
  
  const makeOrder = (card_Items) => {

    const products = card_Items.map((item) => {
      return {
        id : item.product.id,
        quantity : item.quantity
      }
    })

    Axios.post('/orders', {products : products})
    .then((res) => {
      setcardItems([])
      settotalPrice(0)
      settotalQuantity(0)
    })
    .catch((rej) => console.log(rej))

  }

  return (
    <Context.Provider
      value={{
        user,
        showCart,
        cardItems,
        totalPrice,
        totalQuantity,
        qty,
        Notifications,
        Orders,
        FilteredOrders,
        isAddingOnCart,
        baseUrl,
        setUser,
        setqty,
        incQty,
        decQty,
        AddOn,
        setshowCart,
        toggleCartChangeQty,
        removeProductInCart,
        setcardItems,
        settotalQuantity,
        settotalPrice,
        getCardItems,
        setNotifications,
        setOrders,
        setFilteredOrders,
        setisAddingOnCart,
        makeOrder,
        setbaseUrl
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StateContext;

export const useStateContext = () => useContext(Context);
