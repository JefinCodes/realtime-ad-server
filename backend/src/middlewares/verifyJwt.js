const { jwtVerify, createRemoteJWKSet } = require("jose");

const SUPABASE_URL = process.env.SUPABASE_URL;

const JWKS = createRemoteJWKSet(
    new URL(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const token = authHeader.split(" ")[1];
        const { payload } = await jwtVerify(token, JWKS);

        req.auth = payload;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token",
        });
    }
};
