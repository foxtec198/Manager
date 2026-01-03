// =================================================== REQUESTS
async function get_clients() { // Obtem a lista de clientes via API
    const req = await request("clientes")
    const res = await req.json()

    if ( req.ok ) { return res }
    else { show_toast(res, "fanger"); return }
}