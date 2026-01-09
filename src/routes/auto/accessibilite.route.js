/**
 * Multi-platform accessibility 
 * GET /accessibilite
 */

import { Router } from "express";

const router = Router();

router.get("/accessibilite", (_req, res) => {
  res
    .status(200)
    .type("application/json; charset=utf-8")
    .json({
      api: {
        format: "json",
        charset: "utf-8",
        basePrinciples: [
          "stateless http",
          "standard status codes",
          "consistent error shape",
        ],
      },
      clients: {
        supported: ["web", "mobile", "desktop"],
        notes: [
          "all endpoints return json",
          "responses are predictable for any platform",
        ],
      },
      errors: {
        shape: {
          error: "string_code",
          message: "human_readable_message",
        },
        examples: [
          {
            error: "invalid_payload",
            message: "missing required field",
          },
        ],
      },
      cors: {
        recommended: true,
        why: "to allow browser-based apps (frontends) to call the api from another origin",
        note: "cors can be enabled in app middleware if required by the product",
      },
      versioning: {
        recommended: "use /v1 prefix or a version field in responses",
      },
    });
});

export default router;