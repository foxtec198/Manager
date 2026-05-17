import { ApiRequest } from "../utils/request.js"

export class StoreModel {
    async get(filter = null) {
        const request = new ApiRequest("lojas", "GET", null, "general")
        if (filter) request.path = `lojas?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("lojas", "POST", null, "general")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("lojas", "PATCH", null, "general")
        request.data = { id, ...data }
        return await request.send()
    }
}
