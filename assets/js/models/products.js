import { ApiRequest } from '../utils/request.js'

export class ProdutctsModel{
    async get(type){ // Obter todas as vendas
        const req = new ApiRequest("produtos")
        if(type) req.path = `produtos/${type}` 
        return await req.send()
    };

    async get_categories(){
        const req = await new ApiRequest('produtos/categorias').send()
        return req
    };

    async set(){

    };

    async update(){

    };

    async delete(){

    };
};