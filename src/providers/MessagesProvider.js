import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const cache = {
    conversations: {},
    messages: {},
    users: {},
  };
  const [state, setState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_UNSEEN_MESSAGES_COUNT":
          return {
            ...state,
            unseenMessagesCount: action.payload,
          };
        case "SET_OPEN_CHAT_BOX":
          return {
            ...state,
            openChatBox: action.payload,
          };
        case "SET_EXPAND_CHAT_BOX":
          return {
            ...state,
            expandChatBox: action.payload,
          };
        case "SET_SELECTED_USER_ID":
          return {
            ...state,
            selectedUserID: action.payload,
          };
        case "SET_OPEN_MODAL_REPORT":
          return {
            ...state,
            openModalReport: action.payload,
          };
        default:
          return state;
      }
    },
    {
      unseenMessagesCount: 0,
      openChatBox: false,
      expandChatBox: true,
      selectedUserID: null,
      openModalReport: false,
    }
  );
  const selectedUserRef = useRef(null);
  //Handler
  const handleOpenChatBox = useCallback(() => {
    setState({
      type: "SET_OPEN_CHAT_BOX",
      payload: !state.openChatBox,
    });
  }, [state.openChatBox]);
  const handleExpandChatBox = useCallback(() => {
    setState({
      type: "SET_EXPAND_CHAT_BOX",
      payload: !state.expandChatBox,
    });
  }, [state.expandChatBox]);
  const handleUserSelected = useCallback(
    (userID) => {
      setState({
        type: "SET_OPEN_CHAT_BOX",
        payload: true,
      });
      setState({
        type: "SET_EXPAND_CHAT_BOX",
        payload: true,
      });
      setState({
        type: "SET_SELECTED_USER_ID",
        payload: userID,
      });
      console.log(userID);
    },
    [state.selectedUserID]
  );
  const handleUnsetUserSelected = useCallback(() => {
    setState({
      type: "SET_SELECTED_USER_ID",
      payload: null,
    });
  }, []);

  const handleOpenModalReport = useCallback(() => {
    setState({
      type: "SET_OPEN_MODAL_REPORT",
      payload: true,
    });
    setState({
      type: "SET_OPEN_CHAT_BOX",
      payload: false,
    });
  }, []);

  const handleOnCloseModalReport = useCallback(() => {
    setState({
      type: "SET_OPEN_MODAL_REPORT",
      payload: false,
    });
  }, []);

  return (
    <MessagesContext.Provider
      value={{
        cache,
        state,
        selectedUserRef,
        setState,
        handleOpenChatBox,
        handleExpandChatBox,
        handleUserSelected,
        handleUnsetUserSelected,
        handleOpenModalReport,
        handleOnCloseModalReport,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  return useContext(MessagesContext);
};
