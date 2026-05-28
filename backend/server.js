import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import { dbConnection } from "./config/dbConnection.js";
import { socketConnection } from "./config/socketConnection.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// MongoDB connection
dbConnection();

// Socket connection
socketConnection(server);



// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});