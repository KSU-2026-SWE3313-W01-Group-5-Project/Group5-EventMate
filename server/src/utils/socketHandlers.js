import {createPool} from "../../db/index.js"
import {socketMiddleware} from "../middleware/socketMiddleware.js"

const pool = createPool();

export function setupSocketHandlers(io) {
    io.use(socketMiddleware);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join_conversation", (conversationID) => {
            socket.join(`conversation-${conversationID}`);
        });

        socket.on("leave_conversation", (conversationID) => {
            socket.leave(`conversation-${conversationID}`);
        });

        socket.on("send_message", async ({ conversationID, content }) => {
            try {
                const messageResult = await pool.query(`
                    INSERT INTO messages (conversation_id, sender_id, content)
                    VALUES ($1, $2, $3)
                    RETURNING *`,
                    [conversationID, socket.user.id, content]
                );

                const senderUUIDResult = await pool.query(`
                    SELECT public_id FROM users WHERE id = $1`,
                    [socket.user.id]
                );

                const message = messageResult.rows.map(message => ({
                    ...message,
                    sender_id: senderUUIDResult.rows[0].public_id,
                }));

                io.to(`conversation-${conversationID}`).emit("new_message", message[0]);
            } catch (error) {
                console.error(error);
            }
        })

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}