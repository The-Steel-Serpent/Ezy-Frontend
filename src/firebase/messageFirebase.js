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
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();
const messagesCollection = collection(db, "messages");
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

export const subscribeToMessages = (senderId, receiverId, callback) => {
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
    const filteredMessages = messages.filter((message) => {
      // Kiểm tra quyền truy cập
      const senderRole = message.sender.role_id;
      const receiverRole = message.receiver.role_id;

      const isAuthorized =
        (senderRole === 1 && receiverRole === 2) ||
        (senderRole === 2 && receiverRole === 1);
      // (senderRole === "admin" &&
      //   (receiverRole === "customer" || receiverRole === "shop"));

      return (
        isAuthorized &&
        ((message.sender_id === senderId &&
          message.receiver_id === receiverId) ||
          (message.sender_id === receiverId &&
            message.receiver_id === senderId))
      );
    });
    callback(filteredMessages);
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
    await addDoc(messagesCollection, {
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

export const markMessagesAsRead = async (messageIds) => {
  const batch = writeBatch(db);
  const ids = Array.isArray(messageIds) ? messageIds : [messageIds];
  ids.forEach((messageId) => {
    const messageRef = doc(db, "messages", messageId);
    batch.update(messageRef, { isRead: true });
  });

  await batch.commit();
  console.log("Messages marked as read");
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
      const userDetails = await getUserInfo(otherUserId);
      return {
        userInfo: userDetails,
        lastMessage: userInfo.lastMessage,
        unseenCount: userInfo.unseenCount,
      };
    })
  );

  return chattingUsers;
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
