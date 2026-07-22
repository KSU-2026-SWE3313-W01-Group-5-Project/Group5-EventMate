import jwt from 'jsonwebtoken';

export const socketMiddleware = (socket, next) => {
    try {
        const token = socket?.handshake?.headers?.cookie
            ?.split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("UNAUTHORIZED"));
        }

        socket.user = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("UNAUTHORIZED"));
    }
}