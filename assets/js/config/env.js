// Variaveis não exportadas
const root_style = getComputedStyle(document.body)

// Variaveis exportadas
export const server = "http://localhost:9560";
// export const server = "https://dev.api.hubbix.com.br"
export const api = server + "/api/manager/";
export const img = "assets/img/fav.png"
export const primary = root_style.getPropertyValue("--primary").trim()