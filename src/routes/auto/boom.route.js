/**
 * GET /boom → triggers an error to exercise the global error handler.
 */
import { Router } from "express";

const router = Router();

router.get("/boom", function (_req, res) {
  res.status(500).json({
    error: true,
    message: "Boom!",
  });
});


export default router;
