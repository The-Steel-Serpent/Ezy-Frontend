export const connectSocket = (userID) => ({
  type: "socket/connect",
  payload: { userID },
});

export const disconnectSocket = () => ({
  type: "socket/disconnect",
});

export const emitSocketEvent = (event, data) => ({
  type: "socket/emit",
  payload: { event, data },
});
