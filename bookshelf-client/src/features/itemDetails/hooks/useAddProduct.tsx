import { useReducer } from "react";
import { ProductDTO, ProductUpdate } from "../../../types/product";
import products from "../../../utils/api/products";

export type UpdateProductState = {
  loading: boolean;
  id: number | null;
  error: string | null;
};
const initialState: UpdateProductState = {
  loading: false,
  id: null,
  error: null,
};
type ACTION =
  | { type: "LOAD"; payload: null }
  | { type: "SUCCESS"; payload: number | null }
  | { type: "FAILURE"; payload: string };

function updateProductReducer<UpdateProductState>(
  state: UpdateProductState,
  action: ACTION
) {
  const { type, payload } = action;

  switch (type) {
    case "LOAD":
      return { ...state, loading: true, id: null, error: null };
    case "SUCCESS":
      return { ...state, loading: false, id: payload, error: null };
    case "FAILURE":
      return { ...state, loading: false, id: null, error: payload };
    default:
      return state;
  }
}

const useUpdateProduct = (): [UpdateProductState, React.Dispatch<ACTION>] => {
  const [state, dispatch] = useReducer(updateProductReducer, initialState);

  return [state as UpdateProductState, dispatch];
};

export async function addProduct(
  product: ProductDTO,
  dispatch: React.Dispatch<ACTION>
) {
  if (product) {
    dispatch({ type: "LOAD", payload: null });
    try {
      const response = await products.addProductToStore(product);
      dispatch({ type: "SUCCESS", payload: response.data });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: error.response.data });
    }
  }
}

export async function updateProduct(
  update: ProductUpdate,
  dispatch: React.Dispatch<ACTION>
) {
  if (update) {
    dispatch({ type: "LOAD", payload: null });
    try {
      const response = await products.updateProduct(update);
      dispatch({ type: "SUCCESS", payload: response.data });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: error.response.data });
    }
  }
}
export async function removeProduct(
  productId: number,
  dispatch: React.Dispatch<ACTION>
) {
  if (productId) {
    dispatch({ type: "LOAD", payload: null });
    try {
      await products.removeProduct(productId);
      dispatch({ type: "SUCCESS", payload: null });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: error.response.data });
    }
  }
}

export default useUpdateProduct;
