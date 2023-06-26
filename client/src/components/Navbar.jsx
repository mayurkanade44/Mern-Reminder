import { useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(false);
  return <>{user && <h1>Mayur</h1>}</>;
};
export default Navbar;
