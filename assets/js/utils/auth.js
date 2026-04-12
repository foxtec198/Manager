// utils/login
import { login } from "../services/auth_service.js";

const form_login = document.getElementById("form_login");
form_login.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = await form_login.mat.value;
    const senha = await form_login.pwd.value;

    await login(email, senha);
    window.location.href = "pages/base.html";
});