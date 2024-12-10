var div = document.createElement('div')
var cart = []
var statusM = []
var tipo = []

var api = 'https://apihubbix.freeddns.org'
// var api = 'https://10.0.0.105:5432'

var cr = localStorage.getItem('cr')
var gc = localStorage.getItem('gc')

function request(url, method='GET', json){
    if(!json){
        var options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'cr' : `${cr}`,
                'gc' : `${gc}`
            }
        };
    }else{
        var options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'cr' : `${cr}`,
                'gc' : `${gc}`
            },
            body: json
        };
    }
    return fetch(api + url, options)
}

function ldg(){
    div.hidden = ''
    div.style.width = '100%'
    div.style.height = '100%'
    div.style.display = 'flex'
    div.style.justifyContent = 'center'
    div.style.alignItems = 'center'
    div.style.position = 'absolute'
    div.style.top = 0
    div.style.background = '#2B3035' 
    div.innerHTML = `
        <div class="loader">
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        </div>`
    document.body.appendChild(div)
}

function closeLdg(){
    div.hidden = 'none'
}

function toast(msg){
    const toastLiveExample = document.getElementById('toastHbx')
    document.getElementById('toast-text').textContent = msg
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
}

function conferMatricula(mat){
    if(mat.value){
        mat.disabled = true
        request(`/manager/api/v1/mat_verify/?mat=${mat.value}`)
        .then(res=>{
            res.json()
            .then(res=>{
                if(!res){
                    mat.value = ''
                    mat.disabled = false
                }
            })
        })
    }
}

function capitalize(string){
    string = string.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function changeWin(win){
    const changer = document.getElementById('changer')

    changer.src = win
}

function inform(msg){
    var d = document.getElementById('alertt')
    d.hidden = ''
    document.getElementById('alertt-msg').textContent = decodeURI(msg)
}

async function conferCpf(inp){
    var cpf = await inp.value
    const res = await request(`/manager/api/v1/conferir_cpf/?id=${cpf}`)
    const js = await res.json()
    return js
}


// =============== Caixa
async function calc(){
    const res = await request('/manager/api/v1/calc_fechamento/')
    const js = await res.json()
    for(item in js){
        document.getElementById(item.toLowerCase()).value += parseFloat(js[item]).toFixed(2)
    }
}

async function conferCaixa(){
    const res = await request(`/manager/api/v1/confer_caixa/`)
    const resJ = await res.json()

    if(resJ){
        const status = document.getElementById('statusCaixa')

        status.classList.remove('placeholder')
        status.classList.add('text-bg-success')

        status.textContent = `Caixa Aberto - R$ ${parseFloat(resJ).toFixed(2)}`
        document.getElementById('btnAbrirCaixa').disabled = true
    }else{
        const status = document.getElementById('statusCaixa')
        
        status.classList.remove('placeholder')
        status.classList.add('text-bg-danger')
        
        status.textContent = `Caixa Fechado - R$ 0`
        document.getElementById('btnAbrirCaixa').disabled = false
    }
}

async function getSaidasCaixa(){
    const res = await request('/manager/api/v1/get_saidas_caixa/')
    const resJ = await res.json()
    for(var x = 0; x < resJ.length; x++){
        var li = document.createElement('li') 
        var btn = document.createElement('button')
        const id = resJ[x][3]

        li.classList.add('list-group-item')
        li.classList.add('d-flex')
        li.classList.add('justify-content-between')
        li.classList.add('align-items-center')
        li.innerHTML = `
        <span>${resJ[x][0].toUpperCase()} - R$${resJ[x][1]} - ${resJ[x][2]}</span>
        `
        btn.classList.add('btn')
        btn.classList.add('btn-danger')
        btn.innerHTML = `<i class="bi bi-trash-fill"></i>`
        btn.addEventListener('click', function(){
            request(`/manager/api/v1/excluir_saidas/?id=${id}`, 'POST')
            .then(res=>{
                if(res.ok){
                    window.location = '?tst=Excluso com sucesso!'
                }else{
                    window.location = '?tst=Caixa ainda fechado!'
                }
            })
        })
        li.appendChild(btn)

        document.getElementById('saidasCaixa').appendChild(li)
    }
}

function abrirCaixa(){
    var mat = document.getElementById('mattroco').value
    var troco = document.getElementById('troco').value

    if(mat !== '' && troco !== ''){
        request(`/manager/api/v1/abrir_caixa/?valor=${troco}&mat=${mat}`, 'POST')   
        .then(res=>{
            if(res.ok){
                alert('Caixa aberto com sucesso!')
                location.reload()
            }
        })
    }
}

function fecharCaixa(){
    var mat = document.getElementById('fecharMat').value
    if(mat !== ''){
        request(`/manager/api/v1/fechar_caixa/?mat=${mat}`, 'POST')
        .then(res=>{
            res.json()
            .then(js=>{
                alert(js)
                location.reload()
            })
        })
    }
}

function retirarValor(){
    var mat = document.getElementById('retirarMat').value
    var motivo = document.getElementById('retirarMotivo').value
    var desc = document.getElementById('motivoIn').value
    var valor = document.getElementById('retirarV').value

    
    if(mat !== '' && valor !== '' && motivo !==  ''){
        request(`/manager/api/v1/retirar_valor/?valor=${valor}&mat=${mat}&motivo=${motivo}&motivoDet=${desc}`, 'POST')   
        .then(res=>{
            if(res.ok){
                res.json()
                .then(js=>{
                    alert(js)
                    location.reload()
                })
            }
        })
    }
}

function aplicarVlr(){
    var mat = document.getElementById('aplicarMat').value
    var valor = document.getElementById('aplicarValor').value

    if(mat !== '' && valor !== ''){
        request(`/manager/api/v1/aplicar_valor/?valor=${valor}&mat=${mat}`, 'post')   
        .then(res=>{
            res.json()
            .then(js=>{
                alert(js)
                location.reload()
            })
        })
    }
}

function motivoF(sl){
    inn = document.getElementById('motivoIn')

    if(sl.value === 'Outro'){inn.hidden = ''}
    else{inn.hidden = 'none'}
}

function conferTroco(mat){
    conferMatricula(document.getElementById('mattroco'))
    if(mat.value){
        request(`/manager/api/v1/mat_verify/?mat=${mat.value}`)
        .then(res=>{
            res.json()
            .then(res=>{
                if(res){
                    request('/manager/api/v1/get_valor_caixa/')
                    .then(res=>{
                        res.json()
                        .then(res=>{
                            document.getElementById('troco').value = res[0]
                        })
                    })
                }
            })
        })
    }else{document.getElementById('troco').value = ''}
}

// =============== Vendas
async function getSaidas(){
    const res = await request('/manager/api/v1/get_saidas/')
    const js = await res.json()

    document.getElementById('divTableVendas').innerHTML = `
    <table class="table" id="table">
        <thead>
            <td>Nome</td>
            <td>Valor</td>
            <td>Cliente</td>
            <td>Pagamento</td>
            <td>Atendente</td>
            <td>Data</td>
            <td>Ação</td>
        </thead>
        <tbody id="tbVendas">
        </tbody>
    </table>`

    for(var x = 0; x < js.length; x++){
        const tr = document.createElement('tr')
        
        const nome = document.createElement('td')
        nome.classList.add('text-truncate')
        nome.textContent = js[x][0]

        const valor = document.createElement('td')
        valor.textContent = js[x][1]

        const cliente = document.createElement('td')
        cliente.classList.add('text-truncate')
        cliente.textContent = js[x][2]

        const pagamento = document.createElement('td')
        pagamento.textContent = js[x][3]

        const atendente = document.createElement('td')
        atendente.textContent = js[x][4]

        const data = document.createElement('td')
        data.classList.add('text-truncate')
        data.textContent = js[x][5]

        const id = js[x][6]
        const idVenda = js[x][7]

        // Buttons
        const btngp = document.createElement('div')
        btngp.classList.add('btn-group')

        const btnCancel = document.createElement('button')
        var icon = document.createElement('i')
        icon.classList.add('bi')
        icon.classList.add('bi-trash-fill')
        btnCancel.appendChild(icon)
        btnCancel.classList.add('btn')
        btnCancel.classList.add('btn-sm')
        btnCancel.classList.add('btn-danger')
        
        new bootstrap.Tooltip(btnCancel, {title:'Excluir venda!'})

        btnCancel.addEventListener('click',function(){
            request(`/manager/api/v1/excluir_venda/?id=${idVenda}`, 'POST')
            .then(res=>{
                btnCancel.innerHTML = `
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                `
                if(res.ok){
                    location.reload()
                }
            })
        })

        const btnCancelItem = document.createElement('button')
        var icon = document.createElement('i')
        icon.classList.add('bi')
        icon.classList.add('bi-phone')
        btnCancelItem.appendChild(icon)
        btnCancelItem.classList.add('btn')
        btnCancelItem.classList.add('btn-sm')
        btnCancelItem.classList.add('btn-warning')

        new bootstrap.Tooltip(btnCancelItem, {title:'Excluir item!'})

        btnCancelItem.addEventListener('click',function(){
            request(`/manager/api/v1/excluir_saida/?id=${id}&idVenda=${idVenda}`, 'POST')
            .then(res=>{
                btnCancelItem.innerHTML = `
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                `
                if(res.ok){
                    location.reload()
                }
            })
        })

        btngp.appendChild(btnCancelItem)
        btngp.appendChild(btnCancel)

        const act = document.createElement('td')
        act.appendChild(btngp)

        tr.appendChild(nome)
        tr.appendChild(valor)
        tr.appendChild(cliente)
        tr.appendChild(pagamento)
        tr.appendChild(atendente)
        tr.appendChild(data)
        tr.appendChild(act)

        document.getElementById('tbVendas').appendChild(tr)  
    }
}

async function vendasPorTipo(){
    const res = await request('/manager/api/v1/vendas_por_tipo/')
    const js = await res.json()

    var credito = Math.round(parseFloat(js['CREDITO']))
    var debito = Math.round(parseFloat(js['DEBITO']))
    var pix = Math.round(parseFloat(js['PIX']))
    var dinheiro = Math.round(parseFloat(js['DINHEIRO']))
    var dia = Math.round(parseFloat(js['DIA']))
    var total = dinheiro + pix + debito + credito

    document.getElementById('vendasMes').textContent = 'R$' + total.toLocaleString('pt-BR')
    document.getElementById('vendasDia').textContent = 'R$' + dia.toLocaleString('pt-BR')
    document.getElementById('pix').textContent = 'R$' + pix.toLocaleString('pt-BR')
    document.getElementById('cards').textContent = 'R$' + (debito + credito).toLocaleString('pt-BR')
    document.getElementById('dinheiro').textContent = 'R$' + dinheiro.toLocaleString('pt-BR')
}

async function getProds(){
    const res = await request('/manager/api/v1/get_prods/')
    const js = await res.json()

    for(var x = 0; x < js.length; x++){
        const tr = document.createElement('tr')

        const idProd = js[x][0]
        const nome = js[x][1]
        const valor = js[x][3]

        const nomeTd = document.createElement('td')
        nomeTd.textContent = nome
        
        const btnTd = document.createElement('td')
        const btn = document.createElement('button')
        btn.classList.add('btn')
        btn.classList.add('btn-dark')
        btn.textContent = '+'
        btn.addEventListener('click', function(){
            const vl = document.getElementById('valorProd')
            let newvl = 0
            if(vl.value){
                newvl = (parseFloat(vl.value) + parseFloat(valor)).toFixed(1)
            }else{
                newvl = parseFloat(valor)
            }
            vl.value = newvl
            const li = document.createElement('li')
            li.classList.add('list-group-item')
            li.classList.add('d-flex')
            li.classList.add('justify-content-between')
            li.classList.add('align-items-center')
            li.textContent = nome
            const btnRemoveItem = document.createElement('button')
            btnRemoveItem.classList.add('btn')
            btnRemoveItem.classList.add('btn-danger')
            btnRemoveItem.innerHTML = '<i class="bi bi-trash-fill"></i>'
            btnRemoveItem.addEventListener('click', function(){
                document.getElementById('listProdAdd').removeChild(li)
                vl.value = (parseFloat(vl.value) - parseFloat(valor)).toFixed(1)
                cart.splice(cart.indexOf(nome), 1)
            })

            li.appendChild(btnRemoveItem)
            document.getElementById('listProdAdd').appendChild(li)
            cart.push(nome)
        })
        btnTd.appendChild(btn)
        tr.appendChild(nomeTd)
        tr.appendChild(btnTd)

        document.getElementById('listProd').appendChild(tr)
    }
}

async function conferCPFNewVenda(inp) {
    var cpf = await inp.value
    
    if(cpf.length >= 10){
        var l = document.getElementById('ldgCPF')
        l.hidden = ''
        request(`/manager/api/v1/conferir_cpf/?id=${cpf}`)
        .then(res=>{
            res.json()
            .then(js=>{
                if(js === 'Sem obs'){
                    l.hidden = 'none'
                }else if(js === 'CPF Não cadastrado!'){
                    l.hidden = 'none'
                    inp.value = ''
                    alert(js)
                }else{
                    l.hidden = 'none'
                    alert(`OBSERVAÇÃO ENCONTRADA: ${js}`)
                }
            })
        })
    }
}

function vender(){
    var valorTotal = document.getElementById('valorProd').value
    var mat = document.getElementById('matricula').value
    var cpf = document.getElementById('cpf').value
    var desconto = document.getElementById('desconto').value
    var sel = document.getElementById('selPag').value

    var dd = [valorTotal, mat, cpf, desconto, sel]

    if(mat && valorTotal && sel){
        document.getElementById('btnVender').innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>'
        request(`/manager/api/v1/vender/?dd=${dd}&&cart=${cart}`, 'POST')
        .then(res=>{    
            if(res.ok){
                location.reload()
            }
        })
    }else{
        toast('Dados incompletos!')
    }
}

function zerarcart(){
    cart = []
    document.getElementById('valorProd').value =  null
    document.getElementById('listProdAdd').innerHTML = ''
}

// =============== Ordens de Serviço
async function getDadosOs() {
    const res = await request('/manager/api/v1/get_cliente/')
    const js = await res.json()
    if(js[0]){
        for(var x = 0; x < js.length; x++){
            const id = js[x][0]
            const cpf = js[x][1]
            const nome = js[x][2]
            const telefone = js[x][3]
            const modelo = js[x][4]
            const marca = js[x][5]
            const cor = js[x][6]
            const endereco = js[x][7]
            const imei = js[x][10]
    
            var ul = document.getElementById('listClient')
    
            var li = document.createElement('li')
            li.classList.add('list-group-item')
    
            var s = document.createElement('spam')
            s.textContent = nome + ' - ' + cpf
    
            var btnAdd = document.createElement('button')
            btnAdd.classList.add('btn')
            btnAdd.textContent = '+'
            btnAdd.addEventListener('click', function(){
                document.getElementById("CPF").value = id
                document.getElementById("Nome").value = nome
                document.getElementById("Telefone").value = telefone
                document.getElementById("endereco").value = endereco
                document.getElementById("imei").value = imei
                document.getElementById("modelo").value = modelo
                document.getElementById("cor").value = cor
                document.getElementById("marca").value = marca
                document.getElementById("ligar").checked = true
                var date = new Date()
                var day = date.getDay()
                var month = date.getMonth()
    
                if(day < 10){day = '0' + day}
                if(month < 10){month = '0' + month}
                document.getElementById("retirada").value = `${date.getFullYear()}-${month}-${day}`
            })
    
            li.appendChild(s)
            li.appendChild(btnAdd)
            ul.appendChild(li)
        }
    }else{
        var ul = document.getElementById('listClient')
        var li = document.createElement('li')
        li.classList.add('list-group-item')
        li.textContent = 'Nenhum cliente cadastrado, bora começar ?'
        ul.appendChild(li)

    }

    const res2 = await request('/manager/api/v1/get_marcas/')
    const js2 = await res2.json()
    for(var x = 0; x < js2.length; x++){
        var sl = document.createElement('option')
        sl.textContent = js2[x][0]
        document.getElementById('marca').appendChild(sl)
    }

    const res3 = await request('/manager/api/v1/get_tipos/')
    const js3 = await res3.json()
    for(var x = 0; x < js3.length; x++){
        var sl = document.createElement('option')
        sl.textContent = js3[x][0]
        document.getElementById('tipo').appendChild(sl)
    }

    const res4 = await request('/manager/api/v1/get_status/')
    const js4 = await res4.json()
    for(var x = 0; x < js4.length; x++){
        var sl = document.createElement('option')
        sl.textContent = js4[x][0]
        document.getElementById('status').appendChild(sl)
    }


}

async function getStatusOs() {
    const res = await request('/manager/api/v1/get_os_status/')
    const js = await res.json()
    document.getElementById('abertas').textContent = js['ABERTA']
    document.getElementById('canceladas').textContent = js['CANCELADA']
    document.getElementById('semconserto').textContent = js['SEM CONSERTO']
    document.getElementById('entregues').textContent = js['ENTREGUE']
}

async function getOsAbertas(){
    const res = await request('/manager/api/v1/get_os_abertas/')
    const js = await res.json()
    
    for(var x = 0; x < js.length; x++){
        const tr = document.createElement('tr')

        const numOs = document.createElement('td')
        numOs.classList.add('text-truncate')
        numOs.textContent = js[x][0]
        const id = js[x][0]

        const cliente = document.createElement('td')
        cliente.classList.add('text-truncate')
        cliente.textContent = js[x][1]

        const aparelho = document.createElement('td')
        aparelho.classList.add('text-truncate')
        aparelho.textContent = js[x][2]

        // const servico = document.createElement('td')
        // servico.classList.add('text-truncate')
        // servico.textContent = js[x][3]

        const valor = document.createElement('td')
        valor.classList.add('text-truncate')
        valor.textContent = `R$ ${js[x][4]}`

        const st = document.createElement('td')
        st.classList.add('text-truncate')
        const badge = document.createElement('span')
        badge.classList.add('badge')
        badge.classList.add('rounded-pill')
        badge.classList.add('text-bg-success')
        badge.textContent = capitalize(js[x][5])
        st.appendChild(badge)

        const atendente = document.createElement('td')
        atendente.classList.add('text-truncate')
        atendente.textContent = js[x][6]
        
        const cadastro = document.createElement('td')
        cadastro.classList.add('text-truncate')
        cadastro.textContent = js[x][7]

        const entrega = document.createElement('td')
        entrega.classList.add('text-truncate')
        entrega.textContent = js[x][8]
        
        // Buttons
        const btngp = document.createElement('div')
        btngp.classList.add('btn-group')
        
        // Botao para entregar
        const btnEntregue = document.createElement('button')
        const iconEntregue = document.createElement('i')
        iconEntregue.classList.add('bi')
        iconEntregue.classList.add('bi-patch-check')
        btnEntregue.appendChild(iconEntregue)
        btnEntregue.classList.add('btn')
        btnEntregue.classList.add('btn-sm')
        btnEntregue.classList.add('btn-success')
        btnEntregue.addEventListener('click',function(){alert(numOs.textContent)})

        // Botao para Editar
        const btnEditar = document.createElement('button')
        const iconFinalizar = document.createElement('i')
        iconFinalizar.classList.add('bi')
        iconFinalizar.classList.add('bi-box-arrow-up-right')
        btnEditar.appendChild(iconFinalizar)
        btnEditar.classList.add('btn')
        btnEditar.classList.add('btn-sm')
        btnEditar.classList.add('btn-secondary')

        // Botao para download
        const btnDown = document.createElement('button')
        const iconsDown = document.createElement('i')
        iconsDown.classList.add('bi')
        iconsDown.classList.add('bi-cloud-arrow-down-fill')
        btnDown.appendChild(iconsDown)
        btnDown.classList.add('btn')
        btnDown.classList.add('btn-sm')
        btnDown.classList.add('btn-primary')

        // Botao sem conserto
        const btnSemConserto = document.createElement('button')
        const iconSemConserto = document.createElement('i')
        iconSemConserto.classList.add('bi')
        iconSemConserto.classList.add('bi-bell-slash-fill')
        btnSemConserto.appendChild(iconSemConserto)
        btnSemConserto.classList.add('btn')
        btnSemConserto.classList.add('btn-sm')
        btnSemConserto.classList.add('bg-violet')
        btnDown.addEventListener('click', function(){
            window.location = api + '/manager/api/v1/get_os_ind/?os=' + id

        })

        // Botao cancelar
        const btnCancelar = document.createElement('button')
        const iconCancelar = document.createElement('i')
        iconCancelar.classList.add('bi')
        iconCancelar.classList.add('bi-trash-fill')
        btnCancelar.appendChild(iconCancelar)
        btnCancelar.classList.add('btn')
        btnCancelar.classList.add('btn-sm')
        btnCancelar.classList.add('btn-danger')

        
        btngp.appendChild(btnEntregue)
        btngp.appendChild(btnSemConserto)
        btngp.appendChild(btnCancelar)
        btngp.appendChild(btnEditar)
        btngp.appendChild(btnDown)
        
        const act = document.createElement('td')
        act.appendChild(btngp)

        // Add items table
        tr.appendChild(numOs)
        tr.appendChild(cliente)
        tr.appendChild(aparelho)
        // tr.appendChild(servico)
        tr.appendChild(valor)
        tr.appendChild(st)
        tr.appendChild(atendente)
        tr.appendChild(entrega)
        tr.appendChild(cadastro)
        tr.appendChild(act)

        document.getElementById('tbAbertas').appendChild(tr)  
    }
}

async function getAllOs(){
    const res = await request('/manager/api/v1/get_os/?cr=')
    const js = await res.json()

    for(var x = 0; x < js.length; x++){
        const tr = document.createElement('tr')

        const numOs = document.createElement('td')
        numOs.classList.add('text-truncate')
        numOs.textContent = js[x][0]

        const cliente = document.createElement('td')
        cliente.classList.add('text-truncate')
        cliente.textContent = js[x][1]

        const aparelho = document.createElement('td')
        aparelho.classList.add('text-truncate')
        aparelho.textContent = js[x][2]

        // const servico = document.createElement('td')
        // servico.textContent = js[x][3]

        const valor = document.createElement('td')
        valor.classList.add('text-truncate')
        valor.textContent = `R$ ${js[x][4]}`

        const st = document.createElement('td')
        st.classList.add('text-truncate')
        const badge = document.createElement('p')
        badge.classList.add('badge')
        badge.classList.add('rounded-pill')

        if(js[x][5] === 'SEM CONSERTO'){
            badge.style.background = '#8338ec'
        }else if(js[x][5] === 'ENTREGUE'){
            badge.classList.add('text-bg-success')
        }else if(js[x][5] === 'FINALIZADA'){
            badge.style.background = '#fb8500'
        }else if(js[x][5] === 'CANCELADA'){
            badge.classList.add('text-bg-danger')
        }

        badge.textContent = capitalize(js[x][5])
        st.appendChild(badge)

        const atendente = document.createElement('td')
        atendente.classList.add('text-truncate')
        atendente.textContent = js[x][6]

        const cadastro = document.createElement('td')
        cadastro.classList.add('text-truncate')
        cadastro.textContent = js[x][7]

        const entrega = document.createElement('td')
        entrega.classList.add('text-truncate')
        entrega.textContent = js[x][8]
        
        // Buttons
        const btngp = document.createElement('div')
        btngp.classList.add('btn-group')

        const btnCancelar = document.createElement('button')
        var icon = document.createElement('i')
        btnCancelar.classList.add('btn')
        btnCancelar.classList.add('btn-danger')
        btnCancelar.classList.add('btn-sm')
        icon.classList.add('bi')
        icon.classList.add('bi-trash-fill')
        btnCancelar.appendChild(icon)
        
        const btnReabrir = document.createElement('button')
        var icon = document.createElement('i')
        btnReabrir.classList.add('btn')
        btnReabrir.classList.add('btn-sm')
        btnReabrir.style.background = '#023047'
        icon.classList.add('bi')
        icon.classList.add('bi-box-arrow-up-right')
        btnReabrir.appendChild(icon)

        if(js[x][5] == 'CANCELADA'){
            btnCancelar.disabled = true
        }
        btngp.appendChild(btnCancelar)
        btngp.appendChild(btnReabrir)

        const act = document.createElement('td')
        act.appendChild(btngp)

        
        // Add items table
        tr.appendChild(numOs)
        tr.appendChild(cliente)
        tr.appendChild(aparelho)
        // tr.appendChild(servico)
        tr.appendChild(valor)
        tr.appendChild(st)
        tr.appendChild(atendente)
        tr.appendChild(entrega)
        tr.appendChild(cadastro)
        tr.appendChild(act)

        document.getElementById('tbAll').appendChild(tr)  

        
    }
    
}

function abrirOS(t){
    t.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>'

    var dados = `{
        "id": ${parseInt(document.getElementById("CPF").value)},
        "telefone" : "${document.getElementById("Telefone").value}",
        "endereco" : "${document.getElementById("endereco").value}",
        "imei" : "${document.getElementById("imei").value}",
        "modelo" : "${document.getElementById("modelo").value}",
        "cor" : "${document.getElementById("cor").value}",
        "marca" : "${document.getElementById("marca").value}",
        "status":"${statusM}",
        "tipo":"${tipo}",
        "ligar" : ${document.getElementById("ligar").checked},
        "obs" : "${document.getElementById("obs").value}",
        "relato" : "${document.getElementById("relato").value}",
        "retirada" : "${document.getElementById("retirada").value}",
        "valor" : ${parseFloat(document.getElementById("valor").value)},
        "matricula" : "${document.getElementById("matricula").value}"
        }`

    request('/manager/api/v1/abrir_os/', 'POST', dados)
    .then(res=>{
        res.json()
        .then(js=>{
            alert(js)
            location.reload()
        })
    })
}

function addTipo(){
    const tp = document.getElementById('tipo').value
    var ul = document.getElementById('ul-tipo')
    const li = document.createElement('li')
    li.classList.add('d-flex')
    li.classList.add('list-group-item')
    li.classList.add('justify-content-between')

    var s = document.createElement('spam')
    s.textContent = tp

    var btnExcluir = document.createElement('button')
    btnExcluir.classList.add('btn')
    btnExcluir.classList.add('btn-sm')
    btnExcluir.classList.add('btn-danger')
    btnExcluir.innerHTML = `<i class="bi bi-trash-fill"></i>`
    btnExcluir.addEventListener('click', function(){
        ul.removeChild(li)
        tipo.splice(tipo.indexOf(tp), 1)
    })

    li.appendChild(s)
    li.appendChild(btnExcluir)
    ul.appendChild(li)
    tipo.push(tp)
}

function addStatus(){
    const tp = document.getElementById('status').value
    var ul = document.getElementById('ul-status')
    const li = document.createElement('li')
    li.classList.add('d-flex')
    li.classList.add('list-group-item')
    li.classList.add('justify-content-between')

    var s = document.createElement('spam')
    s.textContent = tp

    var btnExcluir = document.createElement('button')
    btnExcluir.classList.add('btn')
    btnExcluir.classList.add('btn-sm')
    btnExcluir.classList.add('btn-danger')
    btnExcluir.innerHTML = `<i class="bi bi-trash-fill"></i>`
    btnExcluir.addEventListener('click', function(){
        ul.removeChild(li)
        statusM.splice(statusM.indexOf(tp), 1)
    })

    li.appendChild(s)
    li.appendChild(btnExcluir)
    ul.appendChild(li)
    statusM.push(tp)
}