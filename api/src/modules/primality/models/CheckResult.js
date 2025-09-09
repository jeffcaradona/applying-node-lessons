export function CheckResult(value, isPrime) {
  return {
    value: value.toString(),
    isPrime: isPrime,
    // Optionally add more fields, e.g. computationTime
  };
}
