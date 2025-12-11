async function login(form){
    mat = form.matricula.value
    pwd = form.pwd.value

    // const req = await request("config/login", "POST", {"mat":mat, "pwd": pwd})
    // const res = await req.json()

    const data = {"mat":mat, "pwd": pwd}
    const req = await fetch(api + url + "config/login", {method:"POST", headers:{"Content-Type": "application/json"}, body:JSON.stringify(data)})
    const res = await req.json()

    if(req.ok){
        console.log(res)
        sessionStorage.setItem("display_name", res.display_name)
        sessionStorage.setItem("cr", res.cr)
        sessionStorage.setItem("gc", res.gc)
        sessionStorage.setItem("perm", res.perm)
        sessionStorage.setItem("peca", res.peca)
        sessionStorage.setItem("estoque", res.estoque)
        window.location = "/base.html"
    }
    else{show_toast(res, "alert")}
}