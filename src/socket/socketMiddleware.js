import { io } from "socket.io-client";
import {
  isNewRequest,
  setAcceptRequest,
  setCloseRequest,
} from "../redux/supportMessageSlice";

let socket = null;

const socketMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    // Kết nối Socket
    case "socket/connect": {
      const { userID } = action.payload;
      if (!socket) {
        socket = io(process.env.REACT_APP_BACKEND_URL, {
          query: { user_id: userID },
        });

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });

        // Lắng nghe sự kiện từ server
        socket.on("newOrder", (data) => {
          console.log("New Order:", data);
          //   store.dispatch({ type: "order/new", payload: data });
          socket.emit("cancelOrder", data);
        });

        socket.on("unBlockOrder", (data) => {
          socket.emit("updateBlockStatus", data);
        });

        socket.on("supportRequestAccepted", (data) => {
          console.log("support data: ", data);
          localStorage.setItem(
            "request_support_id",
            data.requestSupport.request_support_id
          );

          store.dispatch({
            type: "selectedUserID",
          });

          const state = store.getState();
          const user = state.user;
          const userId =
            user?.role_id === 1 || user?.role_id === 2
              ? data.supporter.user_id
              : data.sender.user_id;
          store.dispatch(
            setAcceptRequest({
              selectedUserID: userId,
              requestSupport: data.requestSupport,
              sender: data.sender,
              supporter: data.supporter,
            })
          );
        });
        socket.on("supportRequestClosed", (data) => {
          //   console.log("đã hủy: ", data);
          localStorage.removeItem("request_support_id");
          store.dispatch(setCloseRequest());
        });

        socket.on("newSupportRequest", (data) => {
          store.dispatch(
            isNewRequest({
              isNewRequest: true,
            })
          );
        });
      }
      break;
    }

    // Ngắt kết nối Socket
    case "socket/disconnect": {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      break;
    }

    // Gửi sự kiện (emit)
    case "socket/emit": {
      const { event, data } = action.payload;
      if (socket) {
        socket.emit(event, data);
      }
      break;
    }

    default:
      break;
  }

  return next(action);
};

export default socketMiddleware;
