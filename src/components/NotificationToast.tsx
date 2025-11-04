"use client";

import { toast } from "sonner";

export const showSuccess = (msg: string) => {
  toast.success(msg, {
    description: "💖 Thank you for spreading love!",
    duration: 4000,
  });
};

export const showError = (msg: string) => {
  toast.error(msg, {
    description: "Something went wrong!",
    duration: 4000,
  });
};

export const showInfo = (msg: string) => {
  toast.info(msg, {
    description: "✨ Just a friendly reminder!",
    duration: 4000,
  });
};
