import { createPool } from "../../db/index.js";

const pool = createPool();

export async function getConversationWithDetails(req, res) {
    try {
        const conversationID = req.params.conversation_id;
        const user = req.user;
        const userID = user.id;

        if (!conversationID) {
            return res.status(400).json({message: "CONVERSATION_ID_REQUIRED" });
        }

        const connectionResult = await pool.query(
            `
                SELECT
                    CASE
                        WHEN sender_id = $1 THEN receiver_id
                        ELSE sender_id
                    END AS other_user_id
                FROM connections
                WHERE conversation_id = $2
                    AND (sender_id = $1 OR receiver_id = $1)
                LIMIT 1
            `,
            [userID, conversationID]
        );

        if (connectionResult.rowCount === 0) {
            return res.status(404).json({
                message: "CONVERSATION_NOT_FOUND"
            });
        }

        const connectionID = connectionResult.rows[0].other_user_id;

        if (!connectionID) {
            return res.status(401).json({ message: "CONNECTION_NOT_FOUND" })
        }

        const connectionUUIDResult = await pool.query(`
            SELECT public_id FROM users WHERE id = $1`,
            [connectionID]);

        const connectionUUID = connectionUUIDResult.rows[0].public_id;

        const messagesResult = await pool.query(`
            SELECT * 
            FROM messages
            WHERE conversation_id = $1
            ORDER BY sent_at ASC`,
            [conversationID]);

        if (messagesResult.rows.length === 0) {
            return res.status(200).json({
                message: "CONVERSATION_DATA",
                data: {
                    conversationID: conversationID,
                    connectionUUID: connectionUUID,
                    messages: [],
                }
            })
        }

        const messages = messagesResult.rows.map(message => ({
            ...message,
            sender_id: message.sender_id === userID
                ? user.public_id
                : connectionUUID,
        }));

        return res.status(200).json({
            message: "CONVERSATION_DATA",
            data: {
                conversationID: conversationID,
                connectionUUID: connectionUUID,
                messages: messages,
            }
        });
    } catch (err) {
        console.error("Error getting conversation with details:", err);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}