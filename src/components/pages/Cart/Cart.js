import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import Error from '../Error';
import Success from '../Success';
import CartItems from './CartItems';
import CartInfo from './CartInfo';
import { fetchPostCartSuccess } from '../../../store/SliceCart';
import { fetchPostOrder } from '../../../api/index';
import { nanoid } from 'nanoid';

export default function Cart({ setCart, setOwner }) {
  const { items, owner, loading, error, success } = useSelector(
    (state) => state.cart
  );
  const [isConfirmed, setConfirm] = useState(false);
  const [form, setForm] = useState({
    phone: owner.phone,
    address: owner.address,
  });
  const dispatch = useDispatch();

  /**
   * Проброс телефона/адреса из локалсториджа в форму
   **/
  useEffect(() => {
    setForm(owner);
  }, [owner]);

  /**
   * Debounce сохранения телефона/адреса из формы в локалсторидж
   **/
  useEffect(() => {
    const handler = setTimeout(() => {
      setOwner(form);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [form, setOwner]);

  /**
   * Снимаем success=true после "выхода" из корзины после успешного заказа
   **/
  useEffect(() => {
    return () => {
      success && dispatch(fetchPostCartSuccess(false));
    };
  }, [success, dispatch]);

  const handleRemoveProduct = (index) => {
    setCart((prevCart) => prevCart.filter((_, idx) => idx !== index));
  };

  const handleOrderSubmit = (event) => {
    event.preventDefault();
    if (!isConfirmed || !form?.phone || !form?.address || !items?.length)
      return;
    // console.log('handleOrderSubmit');
    dispatch(fetchPostOrder(setCart, setOwner));
  };

  const handleCheckboxChange = () => {
    // console.log('event.target.checked: ', event.target.checked);
    setConfirm(() => !isConfirmed);
  };

  const handleFormChange = (event) => {
    const { id, value } = event.target;
    // console.log({ id, value });
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
  };

  const cartTableItems = items?.map((item, index) => (
    <tr key={nanoid()}>
      <td>{index + 1}</td>
      <td>
        <Link to={`/catalog/${item.id}`}>{item.title}</Link>
      </td>
      <td>{item.size}</td>
      <td>{item.count}</td>
      <td>{item.price} руб.</td>
      <td>{item.price * item.count} руб.</td>
      <td>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => handleRemoveProduct(index)}
        >
          Удалить
        </button>
      </td>
    </tr>
  ));

  const totalCost = items?.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  const submitOrderDisable = !isConfirmed;
  const successText = 'Благодарим за заказ! Продолжим покупки?';
  const emptyCartText = 'В корзине нет товаров.';
  // console.log('CartContent_info: ', info);
  // console.log('CartContent_loading: ', loading);
  console.log('CartContent_success: ', success);
  return (
    <>
      {(loading && <Loader />) ||
        (success && <Success successText={successText} />) ||
        (error && <Error errorText={error} />) ||
        (cartTableItems?.length ? (
          <>
            <CartItems cartTableItems={cartTableItems} totalCost={totalCost} />
            <CartInfo
              form={form}
              submitOrderDisable={submitOrderDisable}
              handleFormChange={handleFormChange}
              handleOrderSubmit={handleOrderSubmit}
              handleCheckboxChange={handleCheckboxChange}
            />
          </>
        ) : (
          <Error errorText={emptyCartText} />
        ))}
    </>
  );
}
