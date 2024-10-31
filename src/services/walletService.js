import axios from "axios";

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
