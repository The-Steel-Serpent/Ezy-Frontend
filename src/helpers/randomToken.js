export default function generateToken() {
  const array = new Uint8Array(32); // 32 byte = 256 bit
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}
