import axios from "axios";
import { query } from "firebase/firestore";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/wallet`;

export const getWallet = async (token) => {
  try {
    const response = await axios.post(
      `${url}/get-wallet`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Failed to fetch wallet: ", error);
  }
};

export const getWalletHistory = async (
  walletId,
  year,
  page,
  litmit,
  wallet_transaction_id,
  startDate,
  endDate
) => {
  try {
    const response = await axios.post(`${url}/get-wallet-history`, {
      user_wallet_id: walletId,
      year,
      page,
      limit: litmit,
      transactionId: parseInt(wallet_transaction_id),
      startDateS: startDate,
      endDateS: endDate,
    });
    return response.data;
  } catch (error) {
    console.log("Failed to fetch wallet history: ", error);
  }
};

export const depositToWallet = async (user_wallet_id, amount) => {
  try {
    const response = await axios.post(`${url}/deposit`, {
      user_wallet_id,
      amount,
    });
    return response.data;
  } catch (error) {
    console.log("Failed to deposit to wallet: ", error);
  }
};

export const ipnHandler = async (user_wallet_id, data) => {
  try {
    const response = await axios.post(
      `${url}/wallet-ipn?user_wallet_id=${user_wallet_id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Failed to handle IPN: ", error);
  }
};
