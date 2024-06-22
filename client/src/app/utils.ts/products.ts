import axios from "axios";
const SERVERURL = "http://localhost:8000/api";
interface ProductType {
  id?: number;
  name: string;
  dose: string;
  presentation: string;
  unit: number;
  country: string;
}
export const getProducts = async () => {
  const res = await axios.get(`${SERVERURL}/products/`);
  return res.data;
};

export const createProducts = async (product: ProductType) => {
  const res = await axios.post(`${SERVERURL}/products/`, product);
  return res.data;
};

export const updateProducts = async(product: ProductType) => {
  const res = await axios.put(`${SERVERURL}/products/${product.id}/`, product);
  return res.data;
}

export const deleteProduct = async(id: number) => {
  const res = await axios.delete(`${SERVERURL}/products/${id}/`);
  return res.data;
}