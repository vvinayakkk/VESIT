import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user", error);
      }
      setReady(true);
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Failed to remove user", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, ready }}>
      {children}
    </UserContext.Provider>
  );
}
