import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import List from "@material-ui/core/List";
import { getProductsInCart, getUsername } from '../reducks/users/selectors';
import {CartListItem} from "../components/Products/index";
import { GreyButton, PrimaryButton } from '../components/UIkit';
import {push} from "connected-react-router";
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    margin: "0 auto",
    maxWidth: 512,
    width: "100%"
  }
});

const CartList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const productsInCart = getProductsInCart(selector);
  const userName = getUsername(selector);

  const goToOrder = useCallback(() => {
    dispatch(push("/order/confirm"))
  }, []);

  const goToTakeOverAccount = useCallback(() => {
    dispatch(push("/takeoveraccount"))
  }, []);

  const backToHome = useCallback(() => {
    dispatch(push("/"))
  },[])

  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">
        ショッピンカート
      </h2>
      <List className={classes.root}>
        {productsInCart.length > 0 && (
          productsInCart.map(product => <CartListItem key={product.cartId} product={product} />)
        )}
      </List>
      <div>
        {/* アカウントが登録されているかどうかをみる */}
          {userName === "" ?
            <>
                <div className="module-spacer--meduim" />
                <div className="p-grid__column">
                    <PrimaryButton label={"アカウント登録をする"}  onClick={goToTakeOverAccount}/>
                    <div className="module-spacer--extra-extra-small" />
                    <GreyButton label={"ショッピングを続ける"} onClick={backToHome}/>
                </div>
            </>
          :
            <>
                <div className="module-spacer--meduim" />
                <div className="p-grid__column">
                    <PrimaryButton label={"レジへ進む"}  onClick={goToOrder}/>
                    <div className="module-spacer--extra-extra-small" />
                    <GreyButton label={"ショッピングを続ける"} onClick={backToHome}/>
                </div>
            </>
          }


      </div>
      {/* カスタマーデータがなければアカウント引き継ぎページ飛ばす */}
    </section>
  )
}

export default CartList
