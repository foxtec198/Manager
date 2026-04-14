// main.js
import { change_screen, restore_screen  } from "./utils/ui.js";
import { App } from "./core/app.js";
import { setPosState } from "./services/pos_service.js";


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
        return; // Inibi continuidade no codigo
    }
    
    // ✅ Autenticado → vai pra logica
    if (isAuthenticated() && !isLoginPage()){
        app.setStore() // Seta os dados da Loja dinamicamente, como nome e logo
        setPosState() // Seta os dados da Loja dinamicamente, como nome e logo

        parent.window.change_screen = change_screen // Seta a função change screen globalmente
        window.change_screen = change_screen // Seta a função change screen localmente
    }
}

window.addEventListener("DOMContentLoaded", () => { restore_screen() }); init();