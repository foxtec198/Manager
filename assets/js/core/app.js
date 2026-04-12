import { apiRequest } from "../services/api_service.js";
import { server } from "../config/env.js";

export class App {
    async setStore() {
        const res = await apiRequest("lojas", "GET", null, "general", false);

        parent.document.querySelectorAll("[data-name]").forEach(el => {
            switch(el.dataset.name){
                case "store":
                    el.classList.remove("placeholder");
                    el.textContent = res.loja.nome_loja;
                    case "brand":
                    el.classList.remove("placeholder");
                    el.src = `${server}/api/files/img/manager/${encodeURIComponent(res.logo)}`;
            }
        });
    }
}