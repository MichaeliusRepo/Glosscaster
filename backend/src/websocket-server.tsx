import { WebSocketServer } from "ws";
import os from "os";

let wss: WebSocketServer | null = null;

export function LaunchStatServer() {
    if (wss) {
        console.log("WebSocket server already running");
        return;
    }
    
    try {
        wss = new WebSocketServer({ port: 4001 });
        
        setInterval(() => {
            const stats = {
                cpu: os.loadavg()[0],
                totalMemory: os.totalmem(),
                freeMemory: os.freemem(),
                uptime: os.uptime(),
            };
            const message = JSON.stringify(stats);
            wss?.clients.forEach(client => client.send(message));
        }, 1000);
        
        console.log("WebSocket server on ws://localhost:4001");
    } catch (error) {
        console.error("Failed to start WebSocket server:", error);
    }
}