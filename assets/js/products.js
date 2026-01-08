// =================================================================== REQUESTS
async function get_products() { // Obtem produtos via API
    const req = await request("produtos");
    const res = await req.json();

    if (req.ok) { return res }
    else { show_toast(res, "danger"); return };
}