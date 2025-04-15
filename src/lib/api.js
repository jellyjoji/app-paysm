import axios from "axios";

export default async function fetchData(username, password) {
  try {
    // Create a new FormData object
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post(
      "http://192.168.1.8:8080/api/auth/login",
      formData, // Send the form data
      {
        headers: { "Content-Type": "multipart/form-data" }, // FormData automatically sets the correct content type
        withCredentials: true, // ✅ axios에서 쿠키 포함 시 필요
      }
    );
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw new Error("로그인 실패");
  }
}
