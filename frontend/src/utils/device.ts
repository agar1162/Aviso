export function getDeviceId(): string {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    if (crypto && typeof crypto.randomUUID === "function") {
      id = crypto.randomUUID();
    } else {
      // Fallback simple UUID generator (version 4)
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    localStorage.setItem("deviceId", id);
  }
  return id;
}