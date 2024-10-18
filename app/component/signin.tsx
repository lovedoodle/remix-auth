import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import Axios from "axios";

export const axios = Axios.create({
  baseURL: "https://staging-studio-api.jogg.co",
  withCredentials: true,
  withXSRFToken: true,
});

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e);
    // await setIsAuthed(true)
    // router.push('/dashboard')

    try {
      await axios.get("/csrf-cookie");
      console.log(email, password);

      const res = await axios.post("login", {
        email,
        password,
      });

      console.log(res);

      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
