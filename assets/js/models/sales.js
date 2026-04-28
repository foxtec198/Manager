import { ApiRequest } from '../utils/request.js'

export class SalesModel{
    async get(){ // Obter todas as vendas
        const req = await new ApiRequest("vendas")
        return req
    };

    async set(){

    };

    async update(){

    };

    async delete(){

    };
};