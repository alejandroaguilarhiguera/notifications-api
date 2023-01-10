/**
 * Exception
 * @param reason
 * @param promise
 */
export default (reason: unknown, promise: Promise<void>): void => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
};
