import { Handler } from "express";

const notFoundHandler: Handler = (req, res) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl}`,
    message: "The method do not exists",
  });
};
export default notFoundHandler;
