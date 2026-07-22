import { createPool } from "../../db/index.js";

const pool = createPool();

export async function getConnections(req, res) {
    try {
        const userID = req.user.id;

        if (!userID) {
            return res.status(401).json({message: "USER_NOT_FOUND" });
        }

        const connectionResponse = await pool.query(
            `SELECT sender_id, receiver_id, status, conversation_id FROM connections
            WHERE sender_id = $1 OR receiver_id = $1`,
            [userID]
        );

        if (connectionResponse.rows.length === 0) {
            return res.status(200).json({ message: "NO_CONNECTIONS_FOUND" });
        }

        const connections = await Promise.all(
            connectionResponse.rows.map(async (connection) => {
                const senderResponse = await pool.query(
                    `SELECT public_id FROM users WHERE id = $1`,
                    [connection.sender_id]
                );

                const receiverResponse = await pool.query(
                    `SELECT public_id FROM users WHERE id = $1`,
                    [connection.receiver_id]
                );

                return {
                    ...connection,
                    sender_id: senderResponse.rows[0].public_id,
                    receiver_id: receiverResponse.rows[0].public_id,
                };
            })
        );

        return res.status(200).json({ data: connections });
    } catch (err) {
        console.error("Error getting connection by UUID:", err);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}

export async function createConnection(req, res) {
    try {
        const senderID = req.user.id;
        const receiverUUID = req.params.userUUID;

        if (!senderID) {
            return res.status(404).json({message: "UNAUTHORIZED" });
        }

        if (!receiverUUID) {
            return res.status(401).json({message: "RECEIVER_NOT_FOUND" });
        }

        const receiverIDResponse = await pool.query(
            `SELECT id FROM users WHERE public_id = $1`,
            [receiverUUID]
        );

        if (receiverIDResponse.rowCount === 0) {
            return res.status(404).json({message: "RECEIVER_NOT_FOUND" });
        }

        const receiverID = receiverIDResponse.rows[0].id;

        const connectionResponse = await pool.query(
            `SELECT * FROM connections 
            WHERE
                (sender_id = $1 AND receiver_id = $2)
                OR 
                (sender_id = $2 AND receiver_id = $1)`,
                [senderID, receiverID]
        );

        const sentConnection = connectionResponse.rows.find(
            (connection) =>
                connection.sender_id === senderID &&
                connection.receiver_id === receiverID
        );

        if (sentConnection && sentConnection.status === "PENDING") {
            return res.status(400).json({ message: "CONNECTION_REQUEST_ALREADY_PENDING" });
        }

        if (connectionResponse.rowCount === 0) {
            await pool.query(
                `INSERT INTO connections (sender_id, receiver_id, status)
                VALUES ($1, $2, $3)`,
                [senderID, receiverID, "PENDING"]
            )

            return res.status(200).json({ message: "CONNECTION_REQUEST_SENT" })
        }

        const receivedConnection = connectionResponse.rows.find(
            (connection) =>
                connection.sender_id === receiverID &&
                connection.receiver_id === senderID
        );

        if (receivedConnection && receivedConnection.status === "CONNECTED") {
            return res.status(400).json({ message: "USERS_ALREADY_CONNECTED" });
        }

        const conversationResult = await pool.query(
            `INSERT INTO conversations
            DEFAULT VALUES
            RETURNING id`
        );

        const conversationId = conversationResult.rows[0].id;

        await pool.query(
            `INSERT INTO connections (sender_id, receiver_id, conversation_id, status)
            VALUES ($1, $2, $3, $4)`,
            [senderID, receiverID, conversationId, "CONNECTED"]
        );

        await pool.query(
            `UPDATE connections SET conversation_id = $3, status = $4
            WHERE sender_id = $2 AND receiver_id = $1`,
            [senderID, receiverID, conversationId, "CONNECTED"]
        );

        return res.status(200).json({ message: "CONNECTION_MADE" })
    } catch (err) {
        console.error("Error creating connection:", err);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}

export async function removeConnection(req, res) {
    try {
        const userID = req.user.id;
        const connectedUserUUID = req.params.userUUID;

        if (!userID) {
            return res.status(401).json({message: "UNAUTHORIZED" });
        }

        if (!connectedUserUUID) {
            return res.status(400).json({message: "RECEIVER_NOT_FOUND" });
        }

        const connectedUserResponse = await pool.query(
            `SELECT id FROM users WHERE public_id = $1`,
            [connectedUserUUID]
        )

        if (connectedUserResponse.rowCount === 0) {
            return res.status(404).json({message: "RECEIVER_NOT_FOUND" });
        }

        const connectedUserID = connectedUserResponse.rows[0].id;

        const removeConnectionResponse = await pool.query(
            `DELETE FROM connections 
            WHERE 
                (sender_id = $1 AND receiver_id = $2)
                OR 
                (sender_id = $2 AND receiver_id = $1)`,
                [userID, connectedUserID],
        );

        if (removeConnectionResponse.rowCount === 0) {
            return res.status(404).json({ message: "CONNECTION_NOT_FOUND" });
        }

        return res.status(200).json({ message: "CONNECTION_REMOVED" });
    } catch (error) {
        console.error("Error removing connection:", error);

        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}