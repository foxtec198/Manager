import { ApiRequest } from "../utils/request.js";
import { server } from "../config/env.js";

export class App {
    // Função responsavel por carregar logo e nome da loja em qualquer tela
    async setStore() {
        // Obtem os dados da Loja
        const req = await new ApiRequest("lojas", "GET", null, "general", false).send();
        const res = await req.json()
        
        if(req.ok){
            // Obtem todos os elementos com data name, onde será setado os dados da loja (Logo, Nome)
            parent.document.querySelectorAll("[data-name]").forEach(el => {
                el.classList.remove("placeholder"); // Remove o placeholder
                switch(el.dataset.name){
                    // Store vai ser setado o nome
                    case "store": 
                        el.classList.remove("bg-success", "bg-primary")
                        el.textContent = res.loja.nome_loja;
    
                    // Brand será setado a logo
                    case "brand": el.src = `${server}/api/files/img/manager/${encodeURIComponent(res.logo)}`;
                }
            });
        }
    };

    // Função para obter as informações do USUARIO - PROVISORIA
    async setUser() {
        const req = await new ApiRequest(`funcionarios?mat=${sessionStorage.getItem("mat")}`).send();
        const res = await req.json(); // JSON Final
        
        document.querySelectorAll("[data-display]").forEach(el => {
            switch(el.dataset.display){
                case "name": return el.textContent = sessionStorage.getItem("display_name");
                case "perm": return el.textContent = sessionStorage.getItem("perm");
                case "person-img":
                    if(req.ok){
                        el.style.backgroundImage = `url("${server}/api/files/img/manager/${encodeURIComponent(res.img)}")`; // Seta aos elementos
                    }else{
                        el.style.backgroundImage = `url("${server}/api/files/img/manager/blank.png")`; // Seta aos elementos
                    }
            };
        });
    };
};