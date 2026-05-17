import { ApiRequest } from "../utils/request.js"

export class ReleaseModel {
    async get(filter = null) {
        const request = new ApiRequest("saidas")
        if (filter) request.path = `saidas?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("saidas", "POST")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("saidas", "PATCH")
        request.data = { id, ...data }
        return await request.send()
    }

    async delete(id) {
        const request = new ApiRequest(`saidas?id=${id}`, "DELETE")
        return await request.send()
    }
}
