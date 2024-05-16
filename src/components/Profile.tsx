import { useState, useEffect } from "react";
import { auth } from "../firebase";

export function Profile() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName || "");
        setEmail(user.email || "");

        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoggedIn ? (
        <div className="text-center">
          <div>Name: {displayName}</div>
          <div>Email: {email}</div>
        </div>
      ) : (
        <div className="text-center">로그인이 되어있지 않습니다.</div>
      )}
    </>
  );
}
