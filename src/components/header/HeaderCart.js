import React from 'react';

export default function HeaderCart({ counter, handleNavigateCart }) {
  // console.log('CartHeader_props_counter', counter);
  return (
    <div
      className="header-controls-pic header-controls-cart"
      onClick={handleNavigateCart}
    >
      {counter ? (
        <div className="header-controls-cart-full">{counter}</div>
      ) : null}
      <div className="header-controls-cart-menu"></div>
    </div>
  );
}
