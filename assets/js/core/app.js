import { apiRequest } from "../services/api_service.js";
import { server } from "../config/env.js";

export class App {
    // Função responsavel por carregar logo e nome da loja em qualquer tela
    async setStore() {
        // Obtem os dados da Loja
        const res = await apiRequest("lojas", "GET", null, "general", false); 
        
        if(res){
            // Obtem todos os elementos com data name, onde será setado os dados da loja (Logo, Nome)
            parent.document.querySelectorAll("[data-name]").forEach(el => {
                el.classList.remove("placeholder"); // Remove o placeholder
                switch(el.dataset.name){
                    // Store vai ser setado o nome
                    case "store": el.textContent = res.loja.nome_loja;
    
                    // Brand será setado a logo
                    case "brand": el.src = `${server}/api/files/img/manager/${encodeURIComponent(res.logo)}`;
                }
            });
        }
    };
};