function Page_register() {
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
    }


    return(
        <form>
            <h1>Регистрация</h1>
            <input type="text" placeholder="Логин" />
            <input type="password" placeholder="Пароль" />
            <input type="password" placeholder="Подтверждение пароля" />
            <button type="submit" >Зарегистрироваться</button>
        </form>
    )
}