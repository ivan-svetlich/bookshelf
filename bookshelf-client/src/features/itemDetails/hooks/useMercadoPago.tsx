import { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hooks/redux";
import { LoginState } from "../../../store/slices/loginSlice";
import products from "../../../utils/api/products";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const useMercadoPago = (
  id: string | undefined,
  formId: string,
  publicKey: string
) => {
  const [preferenceId, setPreferenceId] = useState("");
  const isLoggedIn: LoginState["isLoggedIn"] = useAppSelector(
    (state) => state.login.isLoggedIn
  );

  function addCheckout() {
    if (document) {
      var div = document.getElementById(formId);

      if (div) {
        div.innerHTML = "";
      }
    }

    const mp = new window.MercadoPago(publicKey, {
      locale: "es-AR",
    });

    mp.checkout({
      preference: {
        id: preferenceId,
      },
      render: {
        container: `#${formId}`,
        label: "Buy now!",
      },
    });
  }

  useEffect(() => {
    if (id && isLoggedIn) {
      products
        .createPreference(id)
        .then((response) => setPreferenceId(response.data.id));
    }
  }, [id, isLoggedIn]);

  useEffect(() => {
    if (preferenceId) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.addEventListener("load", addCheckout);
      document.body.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferenceId]);

  return preferenceId;
};

export default useMercadoPago;
