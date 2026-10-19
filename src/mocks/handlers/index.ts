import { authHandlers } from "./auth";
import { productHandlers } from "./products";
import { orderHandlers } from "./orders";
import { financeHandlers } from "./finance";

export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...orderHandlers,
  ...financeHandlers,
];
