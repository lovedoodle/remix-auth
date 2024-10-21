import { axios } from "./signin";

export default function SignOut() {
  const handleSignOut = async () => {
    const res = await axios.post("/logout");
  };

  return (
    <div>
      <h1>Sign Out</h1>
      <button onClick={handleSignOut}>test sign out </button>
    </div>
  );
}
