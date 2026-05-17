import { ApiRequest } from "../utils/request.js"

export class PartsModel {
    async get(filter = null) {
        const request = new ApiRequest("pecas")
        if (filter) request.path = `pecas?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("pecas", "POST")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("pecas", "PATCH")
        request.data = { id, ...data }
        return await request.send()
    }

    async delete(id) {
        const request = new ApiRequest(`pecas?id=${id}`, "DELETE")
        return await request.send()
    }
}
