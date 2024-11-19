import { message } from "antd";
import { db } from "./firebase";
import axios from "axios";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  where,
  getDocs,
  writeBatch,
  doc,
  getDoc,
  arrayRemove,
  arrayUnion,
  limit,
  startAfter,
  increment,
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { IoFastFoodOutline } from "react-icons/io5";

const storage = getStorage();
const messagesCollection = collection(db, "messages");
const conversationsCollection = collection(db, "conversations");

const cache = {
  conversations: {},
  messages: {},
  users: {},
};

export const compressVideo = async (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.muted = true;

    video.onloadedmetadata = () => {
      // Giảm kích thước video
      const width = video.videoWidth / 2;
      const height = video.videoHeight / 2;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      video.play();

      video.onplay = () => {
        ctx.drawImage(video, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
            video.pause();
            URL.revokeObjectURL(video.src);
          },
          "video/webm", // Hoặc "video/mp4" tùy thuộc vào yêu cầu
          0.6 // Đặt chất lượng nén
        );
      };
    };

    video.onerror = (error) => reject(error);
  });
};
export const getUserInfo = async (userId) => {
  try {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/get-user-by-id?user_id=${userId}`;
    const res = await axios.get(url);
    return res.data.user;
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (file, type) => {
  const storageRef = ref(storage, `${type}/${file.name}-${Date.now()}`);

  const metadata = {
    contentType: file.type, // Đây sẽ là 'image/jpeg' hoặc loại MIME đúng của tệp
  };

  try {
    // Tải lên tệp với metadata
    const snapshot = await uploadBytes(storageRef, file, metadata);

    // Lấy URL tải xuống
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

const getOrCreateConversation = async (
  senderId,
  receiverId,
  type = "seller-buyer"
) => {
  const q = query(
    conversationsCollection,
    where("participants", "array-contains", senderId),
    where("type", "==", type)
  );
  const snapshot = await getDocs(q);

  let conversation = null;

  snapshot.forEach((doc) => {
    const data = doc.data();
    // Kiểm tra nếu người nhận có trong participants
    if (data.participants.includes(receiverId)) {
      conversation = { id: doc.id, ...data };
    }
  });

  if (!conversation) {
    // Tạo mới một conversation nếu chưa có
    const newConversationRef = await addDoc(conversationsCollection, {
      participants: [senderId, receiverId],
      mutedBy: [],
      pinnedBy: [],
      isBlocked: false,
      createdAt: serverTimestamp(),
      type: type,
    });
    conversation = { id: newConversationRef.id };
  }

  return conversation.id;
};

export const subscribeToMessages = (
  senderId,
  receiverId,
  callback,
  onLoadMore
) => {
  const qConversation = query(
    conversationsCollection,
    where("participants", "array-contains", senderId)
  );
  let lastVisible = null;
  let conversationId = null;

  const unsubscribeConversation = onSnapshot(
    qConversation,
    async (conversationSnapshot) => {
      conversationId = null;
      conversationSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(receiverId)) {
          conversationId = doc.id;
        }
      });

      if (conversationId) {
        const qMessages = query(
          messagesCollection,
          where("conversationId", "==", conversationId),
          orderBy("createdAt", "desc"),
          limit(6)
        );

        return onSnapshot(qMessages, async (messagesSnapshot) => {
          const messages = await Promise.all(
            messagesSnapshot.docs.map(async (doc) => {
              const messageData = {
                id: doc.id,
                ...doc.data(),
              };
              if (
                (messageData.sender_id === senderId &&
                  messageData.receiver_id === receiverId) ||
                (messageData.sender_id === receiverId &&
                  messageData.receiver_id === senderId)
              ) {
                return {
                  ...messageData,
                };
              }
            })
          );

          lastVisible = messagesSnapshot.docs[messagesSnapshot.docs.length - 1];

          // Lọc các tin nhắn hợp lệ và gọi callback
          const filteredMessages = messages
            .filter((message) => message !== null)
            .sort(
              (a, b) =>
                (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
            );

          callback(filteredMessages);
        });
      } else {
        // Nếu không có conversation nào, callback với mảng rỗng
        let messages = [];
        callback(messages);
      }
    }
  );
  const loadMore = async () => {
    console.log("Load more messages");
    if (!lastVisible) {
      console.log("No more messages to load.");
      return;
    }

    if (lastVisible) {
      const qMoreMessages = query(
        messagesCollection,
        where("conversationId", "==", conversationId),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(6)
      );

      const moreMessagesSnapshot = await getDocs(qMoreMessages);
      const moreMessages = await Promise.all(
        moreMessagesSnapshot.docs.map(async (doc) => {
          const messageData = {
            id: doc.id,
            ...doc.data(),
          };
          if (
            (messageData.sender_id === senderId &&
              messageData.receiver_id === receiverId) ||
            (messageData.sender_id === receiverId &&
              messageData.receiver_id === senderId &&
              messageData.createdAt !== null)
          ) {
            return {
              ...messageData,
            };
          }
        })
      );
      // Lọc các tin nhắn hợp lệ và gọi callback
      const filteredMoreMessages = moreMessages.filter(
        (message) => message !== null
      );
      const filteredMessages = filteredMoreMessages
        .filter((message) => message !== null)
        .sort(
          (a, b) =>
            (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
        );
      // Cập nhật tin nhắn cuối cùng
      lastVisible =
        moreMessagesSnapshot.docs[moreMessagesSnapshot.docs.length - 1];
      onLoadMore(filteredMessages);
    }
  };
  return {
    unsubscribe: unsubscribeConversation,
    loadMore: loadMore,
  };
};

export const sendMessage = async (
  message,
  mediaType,
  mediaUrl,
  senderId,
  receiverId,
  type = "seller-buyer"
) => {
  if ((message.trim() || mediaType.trim()) && senderId && receiverId) {
    // Kiểm tra hoặc tạo mới một conversation
    const conversationId = await getOrCreateConversation(
      senderId,
      receiverId,
      type
    );

    // Thêm tin nhắn mới vào collection messages với conversationId
    await addDoc(messagesCollection, {
      conversationId,
      text: message,
      mediaUrl: mediaUrl || "",
      mediaType: mediaType || "",
      sender_id: senderId,
      receiver_id: receiverId,
      isRead: false,
      createdAt: serverTimestamp(),
    });

    console.log("Message sent successfully");
  }
};

export const markMessagesAsRead = async (msgIds, userId) => {
  const batch = writeBatch(db);
  for (const msgId of msgIds) {
    const messageRef = doc(db, "messages", msgId);
    const messageSnapshot = await getDoc(messageRef);
    if (messageSnapshot.exists()) {
      const messageData = messageSnapshot.data();
      if (messageData.receiver_id === userId && !messageData.isRead) {
        batch.update(messageRef, { isRead: true });
      }
    } else {
      console.log("No document found for messageId: ${msgId}");
    }
  }

  await batch.commit();
};
// export const getChattingUsers = async (
//   userId,
//   filterType = "",
//   filterText = "",
//   type = "seller-buyer"
// ) => {
//   const users = new Map();
//   // Query for sent messages
//   const qSent = query(
//     messagesCollection,
//     where("sender_id", "==", userId),
//     orderBy("createdAt", "desc")
//   );
//   const snapshotSent = await getDocs(qSent);

//   snapshotSent.forEach((doc) => {
//     const message = doc.data();
//     const id = doc.id;
//     const dataMessage = { id, ...message };

//     const receiverId = message.receiver_id;
//     if (receiverId !== userId && !users.has(receiverId)) {
//       users.set(receiverId, {
//         lastMessage: dataMessage,
//         unseenCount: 0,
//       });
//     }
//   });

//   // Query for received messages
//   const qReceived = query(
//     messagesCollection,
//     where("receiver_id", "==", userId),
//     orderBy("createdAt", "desc")
//   );
//   const snapshotReceived = await getDocs(qReceived);

//   snapshotReceived.forEach((doc) => {
//     const message = doc.data();
//     const senderId = message.sender_id;
//     const id = doc.id;
//     const dataMessage = { id, ...message };
//     if (senderId !== userId) {
//       if (!users.has(senderId)) {
//         users.set(senderId, {
//           lastMessage: dataMessage,
//           unseenCount: 0,
//         });
//       } else {
//         const userInfo = users.get(senderId);
//         if (!message.isRead) {
//           userInfo.unseenCount += 1;
//         }
//         if (message.createdAt > userInfo.lastMessage.createdAt) {
//           userInfo.lastMessage = dataMessage;
//         }
//       }
//     }
//   });

//   const chattingUsers = await Promise.all(
//     Array.from(users).map(async ([otherUserId, userInfo]) => {
//       console.log("type", type);

//       const conversationQuery = query(
//         conversationsCollection,
//         where("type", "==", type),
//         where("participants", "array-contains", userId)
//       );
//       console.log("conversationQuery", conversationQuery);

//       const conversationSnapshot = await getDocs(conversationQuery);
//       console.log("Snapshot data:", conversationSnapshot.docs);
//       let conversationData = null;

//       conversationSnapshot.forEach((doc) => {
//         const conversation = doc.data();
//         if (
//           conversation.participants.includes(otherUserId) &&
//           conversation.type === type
//         ) {
//           conversationData = {
//             conversationId: doc.id,
//             isMuted: conversation.mutedBy.includes(userId),
//             isPinned: conversation.pinnedBy.includes(userId),
//             isBlocked: conversation.isBlocked,
//             createdAt: conversation.createdAt,
//             type: conversation.type,
//           };
//         }
//       });
//       return {
//         userInfo: await getUserInfo(otherUserId),
//         lastMessage: userInfo.lastMessage,
//         unseenCount: conversationData?.isMuted ? 0 : userInfo.unseenCount,
//         ...conversationData,
//       };
//     })
//   );
//   const filteredChattingUsers = chattingUsers.filter((chatUser) => {
//     const { userInfo, unseenCount, isPinned } = chatUser;

//     // Filter based on the filterType
//     if (filterType === "unread") {
//       return unseenCount > 0;
//     } else if (filterType === "pinned") {
//       return isPinned;
//     } else {
//       return true;
//     }
//   });

//   const finalFilteredChattingUsers = filterText
//     ? filteredChattingUsers.filter((chatUser) => {
//         const { userInfo } = chatUser;
//         return (
//           userInfo.Shop.shop_name
//             .toLowerCase()
//             .includes(filterText.toLowerCase()) ||
//           userInfo.username.toLowerCase().includes(filterText.toLowerCase())
//         );
//       })
//     : filteredChattingUsers;

//   const sortedChattingUsers = finalFilteredChattingUsers.sort((a, b) => {
//     if (a.isPinned && !b.isPinned) return -1;
//     if (!a.isPinned && b.isPinned) return 1;

//     const aCreatedAt = a.lastMessage.createdAt
//       ? a.lastMessage.createdAt.toMillis()
//       : 0;
//     const bCreatedAt = b.lastMessage.createdAt
//       ? b.lastMessage.createdAt.toMillis()
//       : 0;

//     return bCreatedAt - aCreatedAt;
//   });

//   return sortedChattingUsers;
// };

export const getChattingUsers = async (
  userId,
  filterType = "",
  filterText = "",
  type = "seller-buyer"
) => {
  const users = new Map();

  // Tìm các cuộc trò chuyện của người dùng
  const conversationQuery = query(
    conversationsCollection,
    where("type", "==", type),
    where("participants", "array-contains", userId)
  );
  const conversationSnapshot = await getDocs(conversationQuery);

  // Lặp qua từng cuộc trò chuyện
  for (const doc of conversationSnapshot.docs) {
    const conversation = doc.data();
    const conversationId = doc.id;

    // Lặp qua các người tham gia trong mỗi cuộc trò chuyện
    conversation.participants.forEach((otherUserId) => {
      if (otherUserId !== userId) {
        // Kiểm tra nếu người tham gia chưa có trong danh sách
        if (!users.has(otherUserId)) {
          users.set(otherUserId, {
            conversationId,
            lastMessage: null,
            unseenCount: 0,
          });
        }
      }
    });

    const qSent = query(
      messagesCollection,
      where("sender_id", "==", userId),
      where("conversationId", "==", conversationId), // Thêm lọc theo conversationId
      orderBy("createdAt", "desc")
    );
    const snapshotSent = await getDocs(qSent);

    snapshotSent.forEach((doc) => {
      const message = doc.data();
      const id = doc.id;
      const dataMessage = { id, ...message };

      const receiverId = message.receiver_id;
      if (receiverId !== userId) {
        if (!users.has(receiverId)) {
          users.set(receiverId, {
            lastMessage: dataMessage,
            unseenCount: 0,
          });
        } else {
          const userInfo = users.get(receiverId);
          if (
            !userInfo.lastMessage ||
            message.createdAt > userInfo.lastMessage.createdAt
          ) {
            userInfo.lastMessage = dataMessage;
          }
        }
      }
    });

    // Query for received messages (chỉ lọc theo conversationId)
    const qReceived = query(
      messagesCollection,
      where("receiver_id", "==", userId),
      where("conversationId", "==", conversationId), // Thêm lọc theo conversationId
      orderBy("createdAt", "desc")
    );
    const snapshotReceived = await getDocs(qReceived);

    snapshotReceived.forEach((doc) => {
      const message = doc.data();
      const senderId = message.sender_id;
      const id = doc.id;
      const dataMessage = { id, ...message };

      if (senderId !== userId) {
        // Kiểm tra nếu người gửi chưa có trong danh sách
        if (!users.has(senderId)) {
          users.set(senderId, {
            lastMessage: dataMessage,
            unseenCount: 0,
          });
        } else {
          const userInfo = users.get(senderId);

          // Chỉ tăng unseenCount nếu tin nhắn chưa đọc
          if (!message.isRead) {
            userInfo.unseenCount += 1;
          }
          // Cập nhật tin nhắn cuối cùng nếu tin nhắn mới hơn
          if (
            !userInfo.lastMessage ||
            message.createdAt > userInfo.lastMessage.createdAt
          ) {
            userInfo.lastMessage = dataMessage;
          }
        }
      }
    });
  }

  // Lấy thông tin người dùng và các cuộc trò chuyện cuối cùng
  const chattingUsers = await Promise.all(
    Array.from(users).map(async ([otherUserId, userInfo]) => {
      const conversationQuery = query(
        conversationsCollection,
        where("type", "==", type),
        where("participants", "array-contains", userId)
      );

      const conversationSnapshot = await getDocs(conversationQuery);
      let conversationData = null;

      conversationSnapshot.forEach((doc) => {
        const conversation = doc.data();
        if (
          conversation.participants.includes(otherUserId) &&
          conversation.type === type
        ) {
          conversationData = {
            conversationId: doc.id,
            isMuted: conversation.mutedBy.includes(userId),
            isPinned: conversation.pinnedBy.includes(userId),
            isBlocked: conversation.isBlocked,
            createdAt: conversation.createdAt,
            type: conversation.type,
          };
        }
      });

      return {
        userInfo: await getUserInfo(otherUserId),
        lastMessage: userInfo.lastMessage,
        unseenCount: conversationData?.isMuted ? 0 : userInfo.unseenCount,
        ...conversationData,
      };
    })
  );

  const filteredChattingUsers = chattingUsers.filter((chatUser) => {
    const { userInfo, unseenCount, isPinned } = chatUser;

    // Lọc theo filterType
    if (filterType === "unread") {
      return unseenCount > 0;
    } else if (filterType === "pinned") {
      return isPinned;
    } else {
      return true;
    }
  });

  const finalFilteredChattingUsers = filterText
    ? filteredChattingUsers.filter((chatUser) => {
        const { userInfo } = chatUser;
        return (
          userInfo.Shop.shop_name
            .toLowerCase()
            .includes(filterText.toLowerCase()) ||
          userInfo.username.toLowerCase().includes(filterText.toLowerCase())
        );
      })
    : filteredChattingUsers;

  const sortedChattingUsers = finalFilteredChattingUsers.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    const aCreatedAt = a.lastMessage?.createdAt?.toMillis() || 0;
    const bCreatedAt = b.lastMessage?.createdAt?.toMillis() || 0;

    return bCreatedAt - aCreatedAt;
  });

  return sortedChattingUsers;
};

export const subscribeToNewMessages = (userId, fetchChattingUsers) => {
  const q = query(messagesCollection, orderBy("createdAt"));

  return onSnapshot(q, async (querySnapshot) => {
    const messages = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const messageData = {
          id: doc.id,
          ...doc.data(),
        };
        return {
          ...messageData,
        };
      })
    );

    const hasNewMessage = messages.some(
      (message) =>
        message.receiver_id === userId || message.sender_id === userId
    );
    if (hasNewMessage) {
      fetchChattingUsers();
    }
  });
};

export const togglePinConversation = async (
  conversationId,
  userId,
  isPinned,
  fetchChatting
) => {
  if (isPinned) {
    await updateDoc(doc(conversationsCollection, conversationId), {
      pinnedBy: arrayRemove(userId),
    });
  } else {
    await updateDoc(doc(conversationsCollection, conversationId), {
      pinnedBy: arrayUnion(userId),
    });
  }
  fetchChatting();
};

export const toggleMuteConversation = async (
  conversationId,
  userId,
  isMuted,
  fetchChatting
) => {
  if (isMuted) {
    await updateDoc(doc(conversationsCollection, conversationId), {
      mutedBy: arrayRemove(userId),
    });
  } else {
    await updateDoc(doc(conversationsCollection, conversationId), {
      mutedBy: arrayUnion(userId),
    });
  }
  fetchChatting();
};

export const deleteConversation = async (conversationId) => {
  const q = query(
    messagesCollection,
    where("conversationId", "==", conversationId)
  );
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  const conversationRef = doc(conversationsCollection, conversationId);
  batch.delete(conversationRef);

  await batch.commit();
};

export const markMessageAsNotRead = async (
  messageId,
  userId,
  isRead,
  fetchChattingUsers
) => {
  const messageRef = doc(messagesCollection, messageId);
  const messageSnapshot = await getDoc(messageRef);

  if (
    messageSnapshot.exists() &&
    messageSnapshot.data().receiver_id === userId
  ) {
    await updateDoc(doc(messagesCollection, messageId), {
      isRead: !isRead,
    });
    fetchChattingUsers();
  }
};
