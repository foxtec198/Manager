import { ApiRequest } from '../utils/request.js'

export class SalesModel{
    async get(filter){ // Obter todas as vendas
        if(filter && typeof(filter) == 'object'){
            const key = Object.keys(filter)[0];
            const value = Object.values(filter)[0];
            return await new ApiRequest(`vendas?${key}=${value}`).send();
        };
        return await new ApiRequest("vendas").send();
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