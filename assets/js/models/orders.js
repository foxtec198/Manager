import { ApiRequest } from "../utils/request.js"

export class OrderModel {
    async get(filter = null) {
        const request = new ApiRequest("os")
        if (filter) request.path = `os?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("os", "POST")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("os", "PATCH")
        request.data = { id, ...data }
        return await request.send()
    }

    async delete(id) {
        const request = new ApiRequest(`os?id=${id}`, "DELETE")
        return await request.send()
    }
}
