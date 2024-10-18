import { useEffect, useState } from "react";
import Axios from "axios";
export const axios = Axios.create({
  baseURL: "https://staging-studio-api.jogg.co",
  withCredentials: true,
  withXSRFToken: true,
});

export default function User() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/me");
      console.log(res);
      setUser(res.data);
    };
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Dashboarding</h1>
      <h2>Welcome</h2>
      <button></button>
    </div>
  );
}
