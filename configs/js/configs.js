async function login(form){
    mat = form.matricula.value
    pwd = form.pwd.value

    const req = await request("config/login", "POST", {"mat":mat, "pwd": pwd})
    const res = await req.json()
}