// main.js
import { change_screen, restore_screen, show_toast, set_buttons } from "./utils/ui.js";
import { setPosState } from "./services/pos_service.js";
import { setExpenses } from "./services/expenses_service.js";
import { App } from "./core/app.js";

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
        sessionStorage.clear(); // Limpa o historico de sessão
        parent.window.location.href = "/"; // Força o login
        return; // Inibi continuidade no codigo
    };
    
    // ✅ Autenticado → vai pra logica
    if (isAuthenticated() && !isLoginPage()){
        app.setStore(); // Seta os dados da Loja dinamicamente, como nome e logo
        app.setUser(); // Seta dados do usuario logado dinamicamente.
        setPosState(); // Seta os dados da Loja dinamicamente, como nome e logo
        setExpenses(); // Seta dinamicamente as despesas
        set_buttons(); // Seta dinamicamente os botoes para troca de tela  
    };
}

// Restora a antiga tela caso tenha sido pasada!
window.addEventListener("DOMContentLoaded", () => { restore_screen() }); init(); 

const url = new URLSearchParams(window.location.search); // Cria um objeto URLSearchParams
const msgToast = url.get("toast") // Obtem a mensagem do toast

// Mostra um toast caso passo no args
isLoginPage() && msgToast 
    ? show_toast(msgToast) 
    : null ;