import { ApiRequest } from "../utils/request.js"

export class BrandModel {
    async get(filter = null) {
        const request = new ApiRequest("marcas")
        if (filter) request.path = `marcas?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("marcas", "POST")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("marcas", "PATCH")
        request.data = { id, ...data }
        return await request.send()
    }

    async delete(id) {
        const request = new ApiRequest(`marcas?id=${id}`, "DELETE")
        return await request.send()
    }
}
