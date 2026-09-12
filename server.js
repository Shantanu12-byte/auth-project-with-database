import app from "./src/app.js";
import connectDB from "./src/config/database.js";

async function startServer() {
  try {
    await connectDB();

    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exitCode = 1;
  }
}

startServer();