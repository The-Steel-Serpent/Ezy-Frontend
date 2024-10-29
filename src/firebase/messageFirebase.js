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
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();
const messagesCollection = collection(db, "messages");
const conversationsCollection = collection(db, "conversations");
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
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

const getOrCreateConversation = async (senderId, receiverId) => {
  const q = query(
    conversationsCollection,
    where("participants", "array-contains", senderId)
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
      isMuted: false,
      isPinned: false,
      createdAt: serverTimestamp(),
    });
    conversation = { id: newConversationRef.id };
  }

  return conversation.id;
};

export const subscribeToMessages = (senderId, receiverId, callback) => {
  const qConversation = query(
    conversationsCollection,
    where("participants", "array-contains", senderId)
  );
  return onSnapshot(qConversation, async (conversationSnapshot) => {
    let conversationId = null;

    // Kiểm tra xem cuộc trò chuyện giữa sender và receiver có tồn tại không
    conversationSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(receiverId)) {
        conversationId = doc.id;
      }
    });

    if (conversationId) {
      // Nếu conversationId tồn tại, lấy các tin nhắn thuộc cuộc trò chuyện này
      const qMessages = query(
        messagesCollection,
        where("conversationId", "==", conversationId),
        orderBy("createdAt")
      );

      return onSnapshot(qMessages, async (messagesSnapshot) => {
        const messages = await Promise.all(
          messagesSnapshot.docs.map(async (doc) => {
            const messageData = {
              id: doc.id,
              ...doc.data(),
            };

            const sender = await getUserInfo(messageData.sender_id);
            const receiver = await getUserInfo(messageData.receiver_id);

            // Thêm kiểm tra quyền truy cập cho từng tin nhắn
            const senderRole = sender.role_id;
            const receiverRole = receiver.role_id;

            const isAuthorized =
              (senderRole === 1 && receiverRole === 2) ||
              (senderRole === 2 && receiverRole === 1);

            if (isAuthorized) {
              return {
                ...messageData,
                sender,
                receiver,
              };
            } else {
              return null; // Bỏ qua các tin nhắn không hợp lệ
            }
          })
        );

        // Lọc các tin nhắn hợp lệ và gọi callback
        const filteredMessages = messages.filter((message) => message !== null);
        callback(filteredMessages);
      });
    } else {
      // Nếu không có conversation nào, callback với mảng rỗng
      callback([]);
    }
  });
};

export const sendMessage = async (
  message,
  mediaType,
  mediaUrl,
  senderId,
  receiverId
) => {
  if ((message.trim() || mediaType.trim()) && senderId && receiverId) {
    // Kiểm tra hoặc tạo mới một conversation
    const conversationId = await getOrCreateConversation(senderId, receiverId);

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

export const markMessagesAsRead = async (conversationIds, userId) => {
  const batch = writeBatch(db);

  for (const conversationId of conversationIds) {
    const q = query(messagesCollection, where("id", "==", conversationId));

    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      const messageData = doc.data();
      // Chỉ đánh dấu là đã đọc nếu người dùng là người nhận và tin nhắn chưa được đọc
      if (messageData.receiver_id === userId && !messageData.isRead) {
        const messageRef = doc(db, "messages", doc.id);
        batch.update(messageRef, { isRead: true });
      }
    });
  }

  await batch.commit();
};
export const getChattingUsers = async (userId) => {
  const users = new Map();

  // Query for sent messages
  const qSent = query(
    messagesCollection,
    where("sender_id", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshotSent = await getDocs(qSent);

  snapshotSent.forEach((doc) => {
    const message = doc.data();
    const receiverId = message.receiver_id;
    if (receiverId !== userId && !users.has(receiverId)) {
      users.set(receiverId, { lastMessage: message, unseenCount: 0 });
    }
  });

  // Query for received messages
  const qReceived = query(
    messagesCollection,
    where("receiver_id", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshotReceived = await getDocs(qReceived);

  snapshotReceived.forEach((doc) => {
    const message = doc.data();
    const senderId = message.sender_id;
    if (senderId !== userId) {
      if (!users.has(senderId)) {
        users.set(senderId, { lastMessage: message, unseenCount: 0 });
      } else {
        const userInfo = users.get(senderId);
        if (!message.isRead) {
          userInfo.unseenCount += 1;
        }
        if (message.createdAt > userInfo.lastMessage.createdAt) {
          userInfo.lastMessage = message;
        }
      }
    }
  });

  const chattingUsers = await Promise.all(
    Array.from(users).map(async ([otherUserId, userInfo]) => {
      const conversationQuery = query(
        conversationsCollection,
        where("participants", "array-contains", userId)
      );

      const conversationSnapshot = await getDocs(conversationQuery);
      let conversationData = null;

      conversationSnapshot.forEach((doc) => {
        const conversation = doc.data();
        if (conversation.participants.includes(otherUserId)) {
          conversationData = {
            conversationId: doc.id,
            isMuted: conversation.isMuted,
            isPinned: conversation.isPinned,
            createdAt: conversation.createdAt,
          };
        }
      });
      return {
        userInfo: await getUserInfo(otherUserId),
        lastMessage: userInfo.lastMessage,
        unseenCount: userInfo.unseenCount,
        ...conversationData,
      };
    })
  );
  const sortedChattingUsers = chattingUsers.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    const aCreatedAt = a.lastMessage.createdAt
      ? a.lastMessage.createdAt.toMillis()
      : 0;
    const bCreatedAt = b.lastMessage.createdAt
      ? b.lastMessage.createdAt.toMillis()
      : 0;

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

        const sender = await getUserInfo(messageData.sender_id);
        const receiver = await getUserInfo(messageData.receiver_id);

        return {
          ...messageData,
          sender,
          receiver,
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

export const togglePinConversation = async (conversationId, isPinned) => {
  await updateDoc(doc(conversationsCollection, conversationId), {
    isPinned: !isPinned,
  });
};

export const toggleMuteConversation = async (conversationId, isMuted) => {
  await updateDoc(doc(conversationsCollection, conversationId), {
    isMuted: !isMuted,
  });
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
