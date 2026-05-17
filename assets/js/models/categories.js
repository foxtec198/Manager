import { ApiRequest } from "../utils/request.js"

export class CategoryModel {
    async get(filter = null) {
        const request = new ApiRequest("categorias")
        if (filter) request.path = `categorias?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("categorias", "POST")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("categorias", "PATCH")
        request.data = { id, ...data }
        return await request.send()
    }

    async delete(id) {
        const request = new ApiRequest(`categorias?id=${id}`, "DELETE")
        return await request.send()
    }
}
