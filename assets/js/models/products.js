import { ApiRequest } from '../utils/request.js'

export class ProdutctsModel{
    async get(type){ // Obter todas as vendas
        const req = new ApiRequest("produtos")
        if(type) req.path = `produtos/${type}` 
        return await req.send()
    };

    async set(){

    };

    async update(){

    };

    async delete(){

    };
};