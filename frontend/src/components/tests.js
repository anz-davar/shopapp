import ProductDataService from "../services/product-services";
import {Offcanvas, Stack} from "react-bootstrap";
import {CartItem} from "./CartItem";
import {formatCurrency} from "../utilities/formatCurrency";
import Button from "react-bootstrap/Button";

export function ShoppingCart({isOpen, closeCart}) {


    return <>
        <Offcanvas show={isOpen} onHide={closeCart} placement='end'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>


                </Stack>
            </Offcanvas.Body>

        </Offcanvas>
    </>
}
