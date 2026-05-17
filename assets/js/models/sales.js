import { ApiRequest } from '../utils/request.js'

export class SalesModel{
    async get(){ // Obter todas as vendas
        const req = await new ApiRequest("vendas")
        return req
    };

    async set(data){
        const req = new ApiRequest("vendas", "POST", data)
        return await req.send()
    };

    async update(id, data){
        const req = new ApiRequest("vendas", "PATCH")
        req.data = { id, ...data }
        return await req.send()
    };

    async delete(id){
        const req = new ApiRequest(`vendas?id=${id}`, "DELETE")
        return await req.send()
    };
};