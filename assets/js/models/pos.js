import { ApiRequest } from "../utils/request.js"
import { show_toast } from "../utils/ui.js"

export class PosModel {
    async status (){ // Função para status do caixa
        return await new ApiRequest("caixa").send();
    };

    async open(mat, value){ // Função para abertura do caixa
        const request = new ApiRequest("caixa", "POST");
        request.data = {mat: parseInt(mat), valor: parseFloat(value)};
        return await request.send();
    };

    async append(mat, value){ // Função para adicionar valor ao caixa
        const request = new ApiRequest("caixa", "PATCH");
        request.data = {mat:parseInt(mat), valor: parseFloat(value)};
        return await request.send();
    };

    async close(mat){ // Função para fechar o caixa
        const request = new ApiRequest("caixa", "DELETE");
        request.data = {mat: parseInt(mat)};
        return await request.send();
    };

    async last_closed() {
        const req = await new ApiRequest("caixa/last_closed", "GET").send();
        const res = await req.json();
        return req.ok ? res : null;
    };
}