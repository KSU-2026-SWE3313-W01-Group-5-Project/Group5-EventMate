import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (err) {
        return res.status(401).json({ error: "INVALID_OR_EXPIRED_TOKEN" });
    }
}