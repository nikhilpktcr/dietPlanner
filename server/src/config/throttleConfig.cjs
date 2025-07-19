import throttle from "express-throttle";

export const throttleConfig = throttle({
  burst: 5, // max 5 requests at once
  period: "1s", // within 1 second
});
