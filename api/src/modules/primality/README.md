# Primality Module Design

The `primality` module provides a flexible system for evaluating whether a given BigInt is prime. It supports multiple evaluation strategies, each with different levels of rigor and performance.

## Goals

- Support multiple primality evaluators:
  - Simple (trial division)
  - Heuristic (e.g., divisibility rules, quick checks)
  - Probabilistic (e.g., Fermat, Miller-Rabin)
- Allow selection of evaluation method via API
- Return results including method used, result, and computation time

## Suggested Structure

```
src/
  modules/
    primality/
      primalityRouter.js         // API routes for primality checks
      primalityController.js     // Handles requests, selects evaluator
      primalityService.js        // Orchestrates evaluation, exposes evaluators
      evaluators/
        simple.js                // Basic trial division
        heuristic.js             // Fast heuristic checks
        fermat.js                // Probabilistic Fermat test
        millerRabin.js           // Probabilistic Miller-Rabin test
      PrimalityResult.js         // Model for response shape
```

## API Example

**GET /api/primality?value=...&method=simple**

- `value`: BigInt to test
- `method`: Evaluation method (`simple`, `heuristic`, `fermat`, `millerRabin`)

## Response Example

```json
{
  "value": "1234567890123456789",
  "isPrime": false,
  "method": "millerRabin",
  "computationTimeMs": 42
}
```

## Extensibility

- Add new evaluators in `evaluators/`
- Controller/service can select evaluator based on request

---

**Summary:**  
This modular design allows you to easily add, test, and select different primality evaluation strategies, balancing speed