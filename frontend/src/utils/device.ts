export function getDeviceId(): string {
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = crypto.randomUUID(); // browser-native UUID
      localStorage.setItem("deviceId", id);
    }
    return id;
  }