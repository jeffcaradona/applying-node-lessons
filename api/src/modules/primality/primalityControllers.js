import { isPrime } from "./primalityService.js";
import { CheckResult } from "../models/CheckResult.js";

export const checkPrime = (req, res, next) => {
  try {
    const value = req.query.value;
    if (!value) {
      return res
          .status(400)
          .json({ error: "Missing 'value' query parameter." });
      }
      let bigIntValue;
      try {
        bigIntValue = BigInt(value);
      } catch {
        return res.status(400).json({ error: "Invalid BigInt value." });
      }
      const result = new CheckResult(bigIntValue, isPrime(bigIntValue));
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
