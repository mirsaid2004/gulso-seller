import { authHandlers } from "./auth";
import { productHandlers } from "./products";
import { orderHandlers } from "./orders";
import { financeHandlers } from "./finance";
import { shopHandlers } from "./shops";

export const handlers = [
  ...authHandlers,
  ...productHandlers,
  ...orderHandlers,
  ...financeHandlers,
  ...shopHandlers,
];
