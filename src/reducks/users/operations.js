import {auth, db, FirebaseTimestamp} from "../../firebase/index";
import {  editProfileStateAction,
  fetchOrdersHistoryAction,
  fetchProductsInCartAction,
  signInAction,
  signOutAction }
  from "./actions";
  import {push, goBack} from "connected-react-router";
  import {isValidEmailFormat, isValidRequiredInput} from "../../function/common";
import {hideLoadingAction, showLoadingAction} from "../loading/actions";
import {initProductsAction} from "../products/actions";
import firebase from "firebase";

const usersRef = db.collection('users');

export const addProductToCart = (addedProduct) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const cartRef = db.collection("users").doc(uid).collection("cart").doc();
    addedProduct["cartId"] = cartRef.id;
    await cartRef.set(addedProduct)
    dispatch(push("/"))
  }
};

export const editUserProfile = (iconPath, introduction, uid, username) => {
  return async (dispatch) => {
      const updateValue = {
          icon_path: iconPath,
          username: username
      };
      usersRef.doc(uid).update(updateValue)
          .then(() => {
              alert('ユーザー情報を更新しました。');
              dispatch(editProfileStateAction(updateValue));
              dispatch(goBack())
          }).catch((error) => {
              console.error(error)
              alert('ユーザー情報の更新に失敗しました。')
          })
  }
};

export const fetchOrdersHistory = () => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const list = [];

    usersRef.doc(uid)
        .collection("orders")
        .orderBy("updated_at", "desc")
        .get()
        .then((snapshots) => {
          snapshots.forEach(snapshot => {
            const data = snapshot.data();
            list.push(data)
          })
          dispatch(fetchOrdersHistoryAction(list))
        })
  }
};

export const fetchProductsInCart = (products) => {
  return async (dispatch) => {
    dispatch(fetchProductsInCartAction(products))
  }
};

export const listenAuthState = () => {
  return async (dispatch) => {
      return auth.onAuthStateChanged(user => {
        if (user) {
          const uid = user.uid;

          usersRef.doc(uid).get()
          .then(snapshot => {
            const data = snapshot.data()
            if (!data) {
              throw new Error('ユーザーデータが存在しません。')
            }

            dispatch(signInAction({
              // test
              cart: [],
              customer_id: (data.customer_id) ? data.customer_id : "",
              email: (data.email) ? data.email : "",
              isSignedIn: true,
              payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
              role: data.role,
              uid: uid,
              username: (data.username) ? data.username : ""
            }))
          })
        } else {
          dispatch(push("/signin"))
        }
      })
  }
};

// export const signUp = (username, email, password, confirmPassword) => {
//   return async (dispatch) => {
//     // Validation
//     if (username === "" || email === "" || password === "" || confirmPassword === "") {
//       alert("必須項目が未入力です")
//       return false
//     }

//     if (password !== confirmPassword) {
//       alert("パスワードが一致しません。もう一度お試しください")
//       return false
//     }

//     return auth.createUserWithEmailAndPassword(email, password)
//     .then(result => {
//       const user = result.user

//       if (user) {
//         const uid = user.uid
//         const timestamp = FirebaseTimestamp.now()

//         const userInitialDate ={
//           created_at: timestamp,
//           email: email,
//           role: "customer",
//           uid: uid,
//           updated_at: timestamp,
//           username: username
//         }

//         db.collection("users").doc(uid).set(userInitialDate)
//         .then(() => {
//           dispatch(push("/"))
//         })
//       }
//     })
//   }
// };

export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
      // Validations
      if(!isValidRequiredInput(email, password, confirmPassword)) {
          alert('必須項目が未入力です。');
          return false
      }

      if(!isValidEmailFormat(email)) {
          alert('メールアドレスの形式が不正です。もう1度お試しください。')
          return false
      }
      if (password !== confirmPassword) {
          alert('パスワードが一致しません。もう1度お試しください。')
          return false
      }
      if (password.length < 6) {
          alert('パスワードは6文字以上で入力してください。')
          return false
      }

      return auth.createUserWithEmailAndPassword(email, password)
          .then(result => {
              dispatch(showLoadingAction("Sign up..."))
              const user = result.user;
              if (user) {
                  const uid = user.uid;
                  const timestamp = FirebaseTimestamp.now();

                  const userInitialData = {
                      // test
                      cart: [],
                      customer_id: "",
                      created_at: timestamp,
                      email: email,
                      role: "customer",
                      payment_method_id: "",
                      uid: uid,
                      updated_at: timestamp,
                      username: username
                  };

                  usersRef.doc(uid).set(userInitialData).then(async () => {
                      // const sendThankYouMail = functions.httpsCallable('sendThankYouMail');
                      // await sendThankYouMail({
                      //     email: email,
                      //     userId: uid,
                      //     username: username,
                      // });
                      dispatch(push('/'))
                      dispatch(hideLoadingAction())
                  })
              }
          }).catch((error) => {
              dispatch(hideLoadingAction())
              alert('アカウント登録に失敗しました。もう1度お試しください。')
              throw new Error(error)
          })
  }
};

export const signInAnonymously = () => {
  return async ( dispatch ) => {
        return auth.signInAnonymously()
                  .then(result => {
                    dispatch(showLoadingAction("Sign up..."))
                    const user = result.user;
                    if (user) {
                        const uid = user.uid;
                        const timestamp = FirebaseTimestamp.now();

                        const userInitialData = {
                          // test
                            cart: [],
                            customer_id: "",
                            created_at: timestamp,
                            role: "customer",
                            payment_method_id: "",
                            uid: uid,
                            updated_at: timestamp,
                        };

                        usersRef.doc(uid).set(userInitialData).then(async () => {
                            // const sendThankYouMail = functions.httpsCallable('sendThankYouMail');
                            // await sendThankYouMail({
                            //     email: email,
                            //     userId: uid,
                            //     username: username,
                            // });
                            dispatch(push('/'))
                            dispatch(hideLoadingAction())
                        })
                    }
                }).catch((error) => {
                    const  errorCode = error.code;
                    // const errorMessage = error.message;

                    if (errorCode === 'auth/operation-not-allowed') {
                      alert('You must enable Anonymous auth in the Firebase Console.');
                    } else {
                      console.error(error);
                    }
                  })
  }
};

export const resetPassword = (email) => {
  return async (dispatch) => {
    if (!isValidEmailFormat(email)) {
      alert('メールアドレスの形式が不正です。')
      return false
    } else {
      auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("入力されたアドレスにパスワードリセット用のメールをお送りしましたのでご確認ください")
        dispatch(push("/signin"))
      }).catch(() => {
        alert('登録されていないメールアドレスです。もう一度ご確認ください。')
      })
    }
  }
};

export const saveAddress = (address) => {
  return async (dispatch, getState) => {
      const state = getState()
      const userId = state.users.uid
      return usersRef.doc(userId).collection('addresses').doc(userId).set(address)
          .then(() => {
              alert('入力いただいた情報を保存しました。')
              dispatch(push('/user/mypage'))
          }).catch(error => {
              alert('情報の保存に失敗しました。通信環境を確認してもう1度お試しください。')
              throw new Error(error)
          })
  }
};

export const signIn = (email, password) => {
  return async (dispatch) => {
      dispatch(showLoadingAction("Sign in..."));
      if (!isValidRequiredInput(email, password)) {
          dispatch(hideLoadingAction());
          alert('メールアドレスかパスワードが未入力です。')
          return false
      }
      if (!isValidEmailFormat(email)) {
          dispatch(hideLoadingAction());
          alert('メールアドレスの形式が不正です。')
          return false
      }
      return auth.signInWithEmailAndPassword(email, password)
          .then(result => {
              const userState = result.user
              if (!userState) {
                  dispatch(hideLoadingAction());
                  throw new Error('ユーザーIDを取得できません');
              }
              const userId = userState.uid;

              return usersRef.doc(userId).get().then(snapshot => {
                  const data = snapshot.data();
                  if (!data) {
                      dispatch(hideLoadingAction());
                      throw new Error('ユーザーデータが存在しません');
                  }

                  dispatch(signInAction({
                    // test
                      cart:[],
                      customer_id: (data.customer_id) ? data.customer_id : "",
                      email: data.email,
                      isSignedIn: true,
                      role: data.role,
                      payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
                      uid: userId,
                      username: data.username,
                  }));

                  dispatch(hideLoadingAction());
                  dispatch(push('/'))
              })
          }).catch(() => {
              dispatch(hideLoadingAction());
          });
  }
};

export const signOut = () => {
  return async (dispatch, getState) => {
      dispatch(showLoadingAction("Sign out..."));
      const uid = getState().users.uid

      // Delete products from the user's cart
      await usersRef.doc(uid).collection('cart').get()
          .then(snapshots => {
              snapshots.forEach(snapshot => {
                  usersRef.doc(uid).collection('cart').doc(snapshot.id).delete()
              })
          });

      // Sign out with Firebase Authentication
      auth.signOut().then(() => {
          dispatch(signOutAction());
          dispatch(initProductsAction());
          dispatch(hideLoadingAction());
          dispatch(push('/signin'));
      }).catch(() => {
          dispatch(hideLoadingAction());
          throw new Error('ログアウトに失敗しました。')
      })
  }
};

export const takeOverAccount = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    // Validations
    if(!isValidRequiredInput(email, password, confirmPassword)) {
      alert('必須項目が未入力です。');
      return false
    }

    if(!isValidEmailFormat(email)) {
        alert('メールアドレスの形式が不正です。もう1度お試しください。')
        return false
    }
    if (password !== confirmPassword) {
        alert('パスワードが一致しません。もう1度お試しください。')
        return false
    }
    if (password.length < 6) {
        alert('パスワードは6文字以上で入力してください。')
        return false
    }

    console.log(email, password)
   // 先に匿名アカウントとメールアドレス認証アカウントを紐付ける
   var credentials = firebase.auth.EmailAuthProvider.credential(email, password);
   console.log(credentials);
   // 紐付けた認証情報を使って本登録を行う
   return auth.currentUser.linkWithCredential(credentials)
  .then((usercred) => {
    const user = usercred.user;
    console.log("Anonymous account successfully upgraded", user);
    if (user) {
      const uid = user.uid;
      const timestamp = FirebaseTimestamp.now();
      const userInitialData = {
        customer_id: "",
        created_at: timestamp,
        email: email,
        role: "customer",
        payment_method_id: "",
        uid: uid,
        updated_at: timestamp,
        username: username
      };
      usersRef.doc(uid).set(userInitialData).then(async () => {
        dispatch(push("/user/payment/edit"))
        dispatch(hideLoadingAction())
      })
    }
  }).catch((error) => {
    console.log("Error upgrading anonymous account", error);
  });
  }
};
