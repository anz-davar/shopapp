import { Offcanvas, Stack, Button } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";
import { CartItem } from "./CartItem";
// import ProductDataService from "../services/product-services";
// import {useNavigate} from "react-router-dom";
import { useHistory } from 'react-router-dom';
import CartServices from "../services/cart-services";

// export function ShoppingCart({ isOpen, closeCart, cartItems, setCartItems, token, cartId, selectedCustomer }) {
export function ShoppingCart({ isOpen, closeCart, cartItems, setCartItems, token, selectedCustomer, cart, setCart }) {
    // const navigate = useNavigate()
    const history = useHistory(); // Use useHistory


    async function removeFromCart(id) {
        setCartItems(prevCartItems => prevCartItems.filter(item => item.product.id !== id));
    }


// const payCart = async () => {
//   if (!selectedCustomer) {
//     alert('Please select a customer first!');
//     return;
//   }
//
//   try {
//     const cartItemsToSend = cartItems.map(item => ({
//       product_id: item.product.id, // Changed to product_id
//       quantity: item.quantity,
//       customer: selectedCustomer.id
//     }));
//
//     await CartServices.createCart(cartItemsToSend, token);
//     setCartItems([]); // Clear cart items on frontend
//     closeCart();
//     history.push('/products');
//   } catch (error) {
//     console.error("Error paying cart:", error);
//     alert("An error occurred while placing the order.");
//   }
// };

    const payCart = async () => {
  if (!selectedCustomer) {
    alert('Please select a customer first!');
    return;
  }

  try {
    const cartItemsToSend = cartItems.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      customer: selectedCustomer.id
    }));

    const response = await CartServices.createCart(cartItemsToSend, token);

    if (response.status === 201) { // Check for successful creation (HTTP status code 201)
      alert('Order placed successfully!'); // Alert success message
      setCartItems([]); // Clear cart items on frontend
      closeCart();
      history.push('/products');
    } else {
      console.error("Error creating cart:", response.data); // Log detailed error
      alert("An error occurred while placing the order. Please check the console for details."); // Informative error message
    }
  } catch (error) {
    console.error("Error paying cart:", error);
    alert("An unexpected error occurred. Please try again later."); // Generic error message for unexpected issues
  }
};

    return (
        <Offcanvas show={isOpen} onHide={closeCart} placement='end'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    {cartItems.length === 0 ? (
                        <span className="text-center">Cart is empty</span>
                    ) : (
                        <>
                            {cartItems.map(item => (item.quantity > 0 &&
                                <CartItem
                                    key={item.product.id}
                                    item={item}
                                    removeFromCart={() => removeFromCart(item.product.id)}
                                    token={token}
                                    setCartItems={setCartItems}
                                    cartItems={cartItems}
                                />
                            ))}
                            <div className='ms-auto fw-bold fs-5'>
                                Total {formatCurrency(cartItems.reduce((total, cartItem) => {
                                    return total + (cartItem?.product.price || 0) * cartItem.quantity
                                }, 0))}
                            </div>
                            <Button variant="warning" onClick={payCart} disabled={!selectedCustomer}>
                                Place order
                            </Button>
                        </>
                    )}
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
}