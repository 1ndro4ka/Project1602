import { useState } from "react";

function Page_login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("login", login);
    localStorage.setItem("password", password);
    alert("test");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Вход</h1>
      <input
        type="text"
        placeholder="Логин"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Войти</button>
    </form>
  );
}

export default Page_login;
