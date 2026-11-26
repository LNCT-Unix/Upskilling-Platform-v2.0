const crypto = require("crypto");

function verifyInternalAuth(req, res, next) {
  const expected = process.env.INTERNAL_API_KEY;
  const provided = req.headers["x-internal-secret"];

  if (!expected) {
    return res.status(500).json({
      success: false,
      message: "Server misconfigured: INTERNAL_API_KEY missing"
    });
  }

  if (typeof provided !== "string") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized internal request"
    });
  }

  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);

  if (
    expectedBuf.length !== providedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, providedBuf)
  ) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized internal request"
    });
  }

  next();
}

module.exports = verifyInternalAuth;