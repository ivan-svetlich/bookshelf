import { KEYS } from "../../../appConfig";
import Loading from "../../loading/Loading";
import useMercadoPago from "../hooks/useMercadoPago";

const FORM_ID = "payment-form";

type BuyItemButtonProps = {
  id: string;
};

const BuyItemButton = ({ id }: BuyItemButtonProps) => {
  const PUBLIC_KEY = KEYS.MERCADO_PAGO.PUBLIC_KEY;
  const preferenceId = useMercadoPago(id, FORM_ID, PUBLIC_KEY);

  return (
    <div id={FORM_ID}>
      {!preferenceId && <Loading color="rgb(0, 158, 227)" />}
    </div>
  );
};

export default BuyItemButton;
