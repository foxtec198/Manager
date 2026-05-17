import { ApiRequest } from "../utils/request.js"

export class FileModel {
    async get(path) {
        const request = new ApiRequest(`files/${path}`, "GET", null, "general")
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("files", "POST", null, "general")
        request.data = data
        return await request.send()
    }

    async delete(id) {
        const request = new ApiRequest(`files/${id}`, "DELETE", null, "general")
        return await request.send()
    }
}
