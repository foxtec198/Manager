import { ApiRequest } from "../utils/request.js";

export async function apiRequest(path, method = "GET", data = null, type = "manager", loading=true) {
    const request = new ApiRequest(path, method, data, type)
    request.loading = loading
    return await request.send();
}