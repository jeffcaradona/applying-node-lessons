import { Router } from "express";

export const router = Router();

router.get("/", (req, res) => {
  console.log("Received a GET request at /");
  res.json({ message: "Hello, world!" });
});
