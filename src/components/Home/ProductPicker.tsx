import "./product.scss";

import React, { useRef, useState, useEffect } from "react";
import menus from "../../temp/menu.json";
import products from "../../temp/products.json";
import { updateProductSet } from "app/productSlice";
import { useAppDispatch } from "app/store";
import { useNavigate } from "react-router-dom";

type Menu = typeof menus[number];

export const ProductPicker = (props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function itemClick(item: Menu) {
    dispatch(updateProductSet({ idSelected: `${item.id}-0` }));
    scrollTo(0, 0);
    navigate("/product");
  }

  const hexArray = ["#d8ebf3", "#f0fcd2", "#fef3d1", "#d5f2d5", "#ffe4ee", "#fee9db"];

  return (
    <div className="home_product_picker">
      <div className="home_product_title">Trung tâm xét nghiệm</div>
      <div className="home_product_items">
        {menus.map((menu, index) => (
          <div
            className="home_product_item"
            key={index}
            onClick={() => {
              itemClick(menu);
            }}
          >
            <div className="home_product_handleimage" style={{ backgroundColor: hexArray[Math.floor(Math.random() * hexArray.length)] }}>
              <img
                className="home_product_image"
                src={
                  products.find((value) => {
                    return value.category_id == `${menu.id}-0`;
                  }).products[0].image
                }
              ></img>
            </div>
            <div className="home_product_name">{menu.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
