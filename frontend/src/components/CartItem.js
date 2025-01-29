import React from 'react';
import { Button, Stack } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";

export function CartItem({ item, removeFromCart, setCartItems }) {
    const increaseCartQuantity = () => {
        setCartItems(prevItems =>
            prevItems.map(cartItem =>
                cartItem.product.id === item.product.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            )
        );
    };

    const decreaseCartQuantity = () => {
        setCartItems(prevItems =>
            prevItems.map(cartItem =>
                cartItem.product.id === item.product.id
                    ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
                    : cartItem
            ).filter(cartItem => cartItem.quantity > 0)
        );
    };

    return (
        <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
            <img
                src={item.product.image}
                style={{ width: "125px", height: "75px", objectFit: "cover" }}
                alt={item.product.name} // Add alt attribute for accessibility
            />
            <div className="me-auto">
                <div>
                    {item.product.name} {item.quantity > 1 && <span className="text-muted small">x{item.quantity}</span>}
                </div>
                <div className="text-muted" style={{ fontSize: ".75rem" }}>
                    {formatCurrency(item.product.price)}
                </div>
            </div>
            <div>{formatCurrency(item.product.price * item.quantity)}</div>
            <div className='d-flex align-items-center justify-content-center' style={{ gap: '.5rem' }}>
                <Button onClick={decreaseCartQuantity}>-</Button>
                <div><span className='fs-6'>{item.quantity}</span></div>
                <Button onClick={increaseCartQuantity}>+</Button>
            </div>
            <Button onClick={() => removeFromCart(item.product.id)} variant="outline-danger" size="sm">
                &times;
            </Button>
        </Stack>
    );
}
// import React from 'react';
// import { Button, Stack } from "react-bootstrap";
// import { formatCurrency } from "../utilities/formatCurrency";
// import ProductDataService from "../services/product-services";
//
// export function CartItem({ item, removeFromCart, token, setCartItems, cartItems }) {
//     async function increaseCartQuantity() {
//         const existingProductIndex = cartItems.findIndex((cartItem) => cartItem.product.id === item.product.id);
//         const updatedCartItems = [...cartItems];
//         const updatedCartItem = {
//             ...updatedCartItems[existingProductIndex],
//             quantity: updatedCartItems[existingProductIndex].quantity + 1,
//         };
//         await ProductDataService.updateCartItem(updatedCartItem.id, updatedCartItem, token);
//         updatedCartItems[existingProductIndex] = updatedCartItem;
//         setCartItems(updatedCartItems);
//
//     }
//
//     async function decreaseCartQuantity() {
//         const existingProductIndex = cartItems.findIndex((cartItem) => cartItem.product.id === item.product.id);
//
//         let updatedCartItems = [...cartItems];
//         const updatedCartItem = {
//             ...updatedCartItems[existingProductIndex],
//             quantity: Math.max(updatedCartItems[existingProductIndex].quantity - 1, 0),
//         };
//
//         if (updatedCartItem.quantity === 0) {
//             await ProductDataService.deleteCartItem(updatedCartItem.id, token);
//             updatedCartItems = updatedCartItems.filter(cartItem => cartItem.product.id !== item.product.id);
//
//         } else {
//             await ProductDataService.updateCartItem(updatedCartItem.id, updatedCartItem, token);
//             updatedCartItems[existingProductIndex] = updatedCartItem;
//
//         }
//         setCartItems(updatedCartItems);
//     }
//     return (
//         <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
//             <img
//                 src={item.product.image}
//                 style={{ width: "125px", height: "75px", objectFit: "cover" }}
//             />
//             <div className="me-auto">
//                 <div>
//                     {item.product.name} {item.quantity > 1 && <span
//                     className="text-muted small">x{item.quantity}</span>}
//                 </div>
//                 <div className="text-muted" style={{ fontSize: ".75rem" }}>
//                     {formatCurrency(item.product.price)}
//                 </div>
//             </div>
//             <div> {formatCurrency(item.product.price * item.quantity)}</div>
//             <div className='d-flex align-items-center justify-content-center'
//                  style={{gap: '.5rem'}}>
//                 <Button onClick={decreaseCartQuantity}>-</Button>
//                 <div>
//                     <span className='fs-6'>{item.quantity}</span>
//                 </div>
//                 <Button onClick={increaseCartQuantity}>+</Button>
//             </div>
//             <Button
//                 onClick={removeFromCart}
//                 variant="outline-danger"
//                 size="sm"
//             >
//                 &times;
//             </Button>
//         </Stack>
//     );
// }