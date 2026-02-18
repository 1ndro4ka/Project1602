import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка сессии при загрузке приложения
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Ошибка парсинга пользователя:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    const existingUser = users.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error("Пользователь с таким email уже существует");
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    // Автоматический вход после регистрации
    login(userData.email, userData.password);
    
    return newUser;
  };

  // Вход
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("Неверный email или пароль");
    }

    // Сохраняем пользователя без пароля
    const userWithoutPassword = { ...foundUser };
    delete userWithoutPassword.password;

    setUser(userWithoutPassword);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  };

  // Выход
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  // Обновление профиля
  const updateProfile = (updatedData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem("users", JSON.stringify(users));

      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}