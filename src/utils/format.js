export function toReal(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export function capitalize(string) {
    string = string.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1)
}