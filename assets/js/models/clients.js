import { ApiRequest } from "../utils/request.js";

export class ClientModel{
    async get(){
        const req = await new ApiRequest("clientes").send()
        return req
    }
};