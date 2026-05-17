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

    async set(data){
        const req = new ApiRequest("produtos", "POST")
        req.data = data
        return await req.send()
    };

    async update(id, data){
        const req = new ApiRequest("produtos", "PATCH")
        req.data = { id, ...data }
        return await req.send()
    };

    async delete(id){
        const req = new ApiRequest(`produtos?id=${id}`, "DELETE")
        return await req.send()
    };
};