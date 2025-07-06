const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Starting GSB Fullstack Application...");

// Start backend server
console.log("📡 Starting backend server on port 3000...");
const backend = spawn("node", ["server.js"], {
  stdio: "pipe",
  cwd: __dirname,
});

backend.stdout.on("data", (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on("data", (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  console.log("⚛️  Starting React frontend on port 3001...");
  const frontend = spawn("npm", ["run", "dev", "--", "--host", "0.0.0.0"], {
    stdio: "pipe",
    cwd: path.join(__dirname, "admin-frontend"),
    shell: true,
  });

  frontend.stdout.on("data", (data) => {
    console.log(`[Frontend] ${data.toString().trim()}`);
  });

  frontend.stderr.on("data", (data) => {
    console.error(`[Frontend Error] ${data.toString().trim()}`);
  });

  frontend.on("close", (code) => {
    console.log(`[Frontend] Process exited with code ${code}`);
  });
}, 2000);

backend.on("close", (code) => {
  console.log(`[Backend] Process exited with code ${code}`);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down servers...");
  backend.kill();
  process.exit();
});
