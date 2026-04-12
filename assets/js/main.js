// main.js
import { App } from "./core/app.js";
import { change_screen  } from "./utils/ui.js";

const app = new App();

// Confirma se esta na tela de Login
function isLoginPage() {
    const LOGIN_ROUTES = ["/", "/index.html"];
    return LOGIN_ROUTES.includes(window.location.pathname);
} 

// Confirma se esta logado
function isAuthenticated () {
    return !!sessionStorage.getItem("access_token");   
}

// Inicia processo de aplicação
async function init() {
    // 🔴 não autenticado → vai pro login
    if (!isAuthenticated() && !isLoginPage()) {
        parent.window.location.href = "/"; // Força o login
        return; // Inibi continuidade no codig
    }
    
    // ✅ Autenticado → vai pra logica
    if (isAuthenticated() && !isLoginPage()){
        app.setStore() // Seta os dados da Loja dinamicamente, como nome e logo
        parent.window.change_screen = change_screen // Seta a função change screen globalmente
        window.change_screen = change_screen // Seta a função change screen localmente
    }
}

init();