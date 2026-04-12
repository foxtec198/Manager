// services/auth.js
import { api } from "../config/env.js";
import { is_loading, show_toast } from "../utils/ui.js"

export async function login(mat, pwd) {
    is_loading();
    try{
        const req = await fetch(`${api}config/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mat:mat, pwd:pwd })
        });
        const res = await req.json();
        
        if (!req.ok) { 
            show_toast(res, "danger");
            is_loading(false);
            throw new Error(res); 
        };
        
        // 🔐 persistência
        sessionStorage.setItem("access_token", res.access_token);
        sessionStorage.setItem("display_name", res.display_name);
        sessionStorage.setItem("perm", res.perm);
        sessionStorage.setItem("mat", res.mat);
    
        return res;
    }
    catch(err){ throw new Error(`Erro na requisição: ${err}`); } 
    finally{is_loading(false)};
}