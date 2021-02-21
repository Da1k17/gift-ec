import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {PrimaryButton, TextDetail} from "../components/UIkit/index";
import {getUsername, getPaymentMethodId} from "../reducks/users/selectors";
import {push} from "connected-react-router";

const UserMyPage = () => {
  const selector = useSelector(state => state);
  const dispatch = useDispatch();
  const username = getUsername(selector);
  const paymentId = getPaymentMethodId(selector);
  const unDonePaymentId = (paymentId !== "");


  const transition = useCallback((path) => {
    dispatch(push(path))
  }, [dispatch]);

  return (
    <section className="c-section-container">
      <h2 className="u-text__headline u-text-center">マイページ</h2>
      <div className="module-spacer--medium"/>
      <TextDetail label={"ユーザー名"} value={username} />
      <div className="module-spacer--medium"/>
      <div className="center">
        <PrimaryButton
            label={"カード情報の編集"}
            onClick={() => transition("/user/payment/edit")}
          />
          {
             unDonePaymentId && (
              <PrimaryButton
                  label={"購入画面に進む"}
                  onClick={() => transition("/order/confirm")}
              />
            )
          }
        <PrimaryButton
            label={"注文履歴の確認"}
            onClick={() => transition("/order/history")}
          />
      </div>
    </section>
  )
}

export default UserMyPage
