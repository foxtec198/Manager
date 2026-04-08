class ApiRequest {
    constructor(path, method = "GET", data = null, type = null) {
        this.path = path
        this.method = method
        this.data = data
        this.headers = new Headers()
        this.headers.append("Content-Type", "application/json")
        this.headers.append("Access-Token", sessionStorage.getItem("access_token"))
        type == "general" ? this.type = "general" : "manager"
    }

    async send() {
        is_loading();
        const options = { method: this.method, headers: this.headers };
        this.data ? options["body"] = JSON.stringify(this.data) : null;

        switch (this.type) {
            case "general": 
                try{
                    const req = await fetch(`${server}/api/${this.path}`, options);
                    is_loading(false);
                    return await req.json();
                }catch{is_loading(false); show_toast("Erro de conexão", "danger"); return;}
                
            default: 
                try{
                    const req = await fetch(`${api}${this.path}`, options); 
                    is_loading(false); 
                    return await req.json();
                }catch{is_loading(false); show_toast("Erro de conexão", "danger"); return;}
        }
    };

    async sendForm(form) {
        is_loading();
        const options = { method: this.method, headers: this.headers };
        options["body"] = new FormData(form)

        switch (this.type) {
            case "general": 
                try{
                    const req = await fetch(`${server}/api/${this.path}`, options);
                    is_loading(false);
                    return await req.json();
                }catch{is_loading(false); show_toast("Erro de conexão", "danger"); return;}
                
            default: 
                try{
                    const req = await fetch(`${api}${this.path}`, options);
                    is_loading(false);
                    return await req.json();
                }catch{is_loading(false); show_toast("Erro de conexão", "danger"); return;}
        }
    };
};