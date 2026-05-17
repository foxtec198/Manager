import { ApiRequest } from "../utils/request.js"

export class ProviderModel {
    async get(filter = null) {
        const request = new ApiRequest("fornecedores")
        if (filter) request.path = `fornecedores?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("fornecedores", "POST")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("fornecedores", "PATCH")
        request.data = { id, ...data }
        return await request.send()
    }

    async delete(id) {
        const request = new ApiRequest(`fornecedores?id=${id}`, "DELETE")
        return await request.send()
    }
}
