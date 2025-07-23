import http from "http";
import app from "./app.js";
import { dbConnection } from "./config/dbConnection.js";
import { socketConnection } from "./config/socketConnection.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Connect to MongoDB
dbConnection()


// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Init Socket.IO
socketConnection(server);