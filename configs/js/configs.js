async function login(form){
    ldg()
    const mat = form.matricula.value
    const pwd = form.pwd.value
    const data = {"mat":mat, "pwd": pwd}
    const req = await fetch(api + "config/login", {method:"POST", headers:{"Content-Type": "application/json"}, body:JSON.stringify(data)})
    const res = await req.json()
    
    if(req.ok){
        sessionStorage.setItem("display_name", res.display_name)
        sessionStorage.setItem("cr", res.cr)
        sessionStorage.setItem("gc", res.gc)
        sessionStorage.setItem("perm", res.perm)
        sessionStorage.setItem("peca", res.peca)
        sessionStorage.setItem("estoque", res.estoque)
        sessionStorage.setItem("matricula", mat)
        window.location = "/base.html"
    }
    else{closeLdg(); show_toast(res, "alert")}
}

function logout(){
    sessionStorage.clear()
    window.location = "/"
}