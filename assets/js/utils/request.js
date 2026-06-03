import { is_loading, show_toast } from "../utils/ui.js"
import { server, api } from "../config/env.js"

// request.js
export class ApiRequest {
    constructor(path, method = "GET", data = null, type = "manager") {
        this.path = path;
        this.method = method;
        this.data = data;
        this.type = type;
        this.loading = true

        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Access-Token", sessionStorage.getItem("access_token") || "");
    }

    async send() {
        is_loading(this.loading);

        const options = {
            method: this.method,
            headers: this.headers
        };

        this.data ? options.body = JSON.stringify(this.data) : null // Seta os dados JSON casoo haja

        // Muda o tipo da requisição caso seja passado
        const baseUrl = this.type === "general"
            ? `${server}/api/`
            : `${api}`;

        try {// Escopo da requisição Final
            const req = await fetch(`${baseUrl}${this.path}`, options); // Requisição
            if(!req.ok){console.warn(await req.clone().json())}

            // Confirma se o status nao esta OK e se é 401
            if(!req.ok && req.status === 401){ // Condicional para token expirado!
                const res = await req.clone().json(); // Obtem o JSON
                // Confirma se o JSON é referente ao token
                if(res.toLowerCase().includes("token") && res.toLowerCase().includes("expirado")){
                    sessionStorage.clear() // Limpa o session storage
                    parent.window.location = "/?toast=Token de acesso expirado, por favor refaça o login!"; // Muda para a tela de login e mostra a mensagem de acesso Expirado
                }else{ return req }; // Retorna a requisição
            }else{ return req }; // Retorna a requisição.
        } catch (err) { show_toast(`Erro com o servidor, tente novamente mais tarde! - Erro: ${err} - Codigo: ${err.status_code}`, "danger");} // Retorna o erro
        finally { is_loading(false); }; // Remove o carregamento!
    };
};