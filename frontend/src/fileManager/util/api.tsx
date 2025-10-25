// export const API_BASE = "http://localhost:4000";
export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getDrives() {
    const res = await fetch(`${API_BASE}/api/drives`);
    return res.json();
}

export async function listFiles(dir = ".") {
    const res = await fetch(`${API_BASE}/api/list?dir=${encodeURIComponent(dir)}`);
    return res.json();
}

export function connectWebSocket(onMessage: (data: any) => void) {
    const ws = new WebSocket("ws://localhost:4001");
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };
    
    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
    
    ws.onopen = () => {
        console.log("WebSocket connected");
    };
    
    ws.onclose = () => {
        console.log("WebSocket disconnected");
    };
    
    return ws;
}
