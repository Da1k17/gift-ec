import React from 'react';
import Divider from "@material-ui/core/Divider";
import {TextDetail} from "../UIkit/index";
import {OrderedProducts} from "./index";

const datetimeToString = (date) => {
  return date.getFullYear() + "_"
          + ("00" + (date.getMonth() + 1)).slice(-2) + "_"
          + ("00" + date.getDate()).slice(-2) + " "
          + ("00" + date.getHours()).slice(-2) + ":"
          + ("00" + date.getMinutes()).slice(-2) + ":"
          + ("00" + date.getSeconds()).slice(-2)
}

const dateToString = (date) => {
  return date.getFullYear() + "_"
  + ("00" + (date.getMonth() + 1)).slice(-2) + "_"
  + ("00" + date.getDate()).slice(-2)
}

const OrderHistoryItem = (props) => {
  const products = props.order.products;
  const orderedDatetime = datetimeToString(props.order.updated_at.toDate());
  const shippingDate = dateToString(props.order.shipping_date.toDate());
  const price = "¥" + props.order.amount.toLocaleString();

  return (
    <div>
      <div className="module-spacer--samll"/>
      <TextDetail label={"注文ID"} value={props.order.id} />
      <TextDetail label={"注文日時"} value={orderedDatetime} />
      <TextDetail label={"発送予定日"} value={shippingDate} />
      <TextDetail label={"注文金額"} value={price} />

        {props.order.products.length > 0 && (
           <OrderedProducts products={products} />
         )}

      <div className="module-spacer--extra-extra-small"/>
      <Divider />
    </div>
  )
}

export default OrderHistoryItem;
