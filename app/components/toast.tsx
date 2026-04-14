"use client";

import { toast as sonnerToast } from "sonner";

type ToastVariant =
  | "default"
  | "promise"
  | "success"
  | "error"
  | "warning"
  | "info";

type Position =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

const toast = (
  message: string,
  variant: ToastVariant = "default",
  position: Position = "top-right",
) => {
  const params = { position };
  setTimeout(() => {
    switch (variant) {
      case "promise":
        sonnerToast.promise(Promise.resolve(message), params);
        break;
      case "success":
        sonnerToast.success(message, params);
        break;
      case "error":
        sonnerToast.error(message);
        break;
      case "warning":
        sonnerToast.warning(message, params);
        break;
      case "info":
        sonnerToast.info(message, params);
        break;
      default: {
        sonnerToast(message, params);
      }
    }
  });
};

export default toast;
