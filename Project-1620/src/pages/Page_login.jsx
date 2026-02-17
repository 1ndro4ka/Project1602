function Page_login() {
    return(
        <form>
            <h1>Вход</h1>
            <input type="text" placeholder="Логин" />
            <input type="password" placeholder="Пароль" />
            <button type="submit">Войти</button>
        </form>
    )

}

export default Page_login;