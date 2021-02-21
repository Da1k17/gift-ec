import React from "react";
import {Route, Switch} from "react-router";
import {CartList,CheckoutWrapper, OrderComplete, OrderConfirm, OrderHistory, ProductDetail, ProductEdit, ProductList, Reset, SignIn, SignUp, TakeOverAccount, UserMyPage} from "./templates/index";
import Auth from "./Auth";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/signin" component={SignIn}/>
      <Route exact path="/signup" component={SignUp}/>
      <Route exact path="/signin/reset" component={Reset}/>

      <Auth>
          <Route exact path="/product/:id" component={ProductDetail}/>
          <Route exact path="(/)?" component={ProductList}/>
          <Route exact path="/cart" component={CartList} />
          <Route exact path="/user/payment/edit" component={CheckoutWrapper} />
          <Route path="/product/edit(/:id)?" component={ProductEdit}/>
          <Route exact path="/order/complete" component={OrderComplete} />
          <Route exact path="/order/confirm" component={OrderConfirm} />
          <Route exact path="/order/history" component={OrderHistory} />
          <Route exact path="/takeoveraccount" component={TakeOverAccount} />
          <Route exact path="/user/mypage" component={UserMyPage} />
      </Auth>
    </Switch>
  );
};

export default Router
