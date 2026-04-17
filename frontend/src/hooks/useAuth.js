import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthProvider.jsx";

export const useAuth = () => useContext(AuthContext);
