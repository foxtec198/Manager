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
        is_loading(this.loading)

        const options = {
            method: this.method,
            headers: this.headers
        };

        if (this.data) {
            options.body = JSON.stringify(this.data);
        }

        const baseUrl = this.type === "general"
            ? `${server}/api/`
            : `${api}`;

        try {
            const req = await fetch(`${baseUrl}${this.path}`, options);
            return req;
        } catch (err) {
            show_toast(`Erro com o servidor: ${err} - Codigo: ${err.status_code}`, "danger");
        } finally {
            is_loading(false);
        }
    }
}