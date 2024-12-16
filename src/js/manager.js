var div = document.createElement('div')
var cart = []
var statusM = []
var tipo = []
var spinner = '<span class="spinner-border spinner-border-sm text-light" role="status"></span>'

var api = 'https://apihubbix.freeddns.org'
// var api = 'http://10.0.0.105:5432'

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

function getLoja(){
    request('/manager/api/v1/get_loja/')
    .then(res=>{
        res.json()
        .then(loja=>{
            var label = document.getElementById('nomeLoja')
            label.textContent = loja['nome']
            label.classList.remove('placeholder')

            var img = document.getElementById('logoBase')
            img.src = `https://apihubbix.freeddns.org/` + loja['logo']
            img.classList.remove('placeholder')
        })
    })
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
    const js = await statusCaixa()
    if(js){
        const status = document.getElementById('statusCaixa')

        status.classList.remove('placeholder')
        status.classList.add('text-bg-success')

        status.textContent = `Caixa Aberto - R$ ${parseFloat(js).toFixed(2)}`
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

async function statusCaixa(){
    const res = await request(`/manager/api/v1/confer_caixa/`)
    const resJ = await res.json()
    
    return resJ
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
    <table class="table table-hover" id="table">
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
            request(`/manager/api/v1/excluir_venda/?id=${id}&idVenda=${idVenda}`, 'POST')
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

    statusCaixa()
    .then(js=>{
        if(js && mat && valorTotal && sel){
            document.getElementById('btnVender').innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>'
            request(`/manager/api/v1/vender/?dd=${dd}&&cart=${cart}`, 'POST')
            .then(res=>{    
                if(res.ok){
                    location.reload()
                }
            })
        }else if(!js){
            alert('Caixa ainda fechado!!')
        }else{
            alert('Dados incompletos!')
        }
    })
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
                document.getElementById("noMarca").value = marca
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
        const id = js[x][0]
        const nomeOS = js[x][1]
        const modeloOs = js[x][2]
        const tipoServico = js[x][3]
        const valorOs = js[x][4]

        const marcaOs = js[x][9]
        const corOs = js[x][10]
        const imeiOs = js[x][11]
        const cpfOs = js[x][12]
        const statusOS = capitalize(js[x][5])

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

        const valor = document.createElement('td')
        valor.classList.add('text-truncate')
        valor.textContent = `R$ ${js[x][4]}`

        const st = document.createElement('td')
        st.classList.add('text-truncate')
        const badge = document.createElement('span')
        badge.classList.add('badge')
        badge.classList.add('rounded-pill')
        const status = js[x][5]
        if(status === 'ABERTA'){badge.style.background = '#023047'}
        else if(status === 'ORÇAMENTO'){badge.style.background = '#9c6644'}
        badge.textContent = capitalize(status)
        st.appendChild(badge)

        const atendente = document.createElement('td')
        atendente.style.marginRight = '50px'
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
        new bootstrap.Tooltip(btnEntregue, {title:'Marcar como entregue!'})

        btnEntregue.addEventListener('click',function(){
            document.getElementById('idOsEntrega').value = id
            const myModal = new bootstrap.Modal(document.getElementById('ModalEntregue'), {show:'true'})
            myModal.show()
        })

        // Botao para Editar
        const btnEditar = document.createElement('button')
        const iconFinalizar = document.createElement('i')
        iconFinalizar.classList.add('bi')
        iconFinalizar.classList.add('bi-box-arrow-up-right')
        btnEditar.appendChild(iconFinalizar)
        btnEditar.classList.add('btn')
        btnEditar.classList.add('btn-sm')
        btnEditar.classList.add('btn-secondary')
        new bootstrap.Tooltip(btnEditar, {title:'Editar Ordem!'})

        btnEditar.addEventListener('click',  function(){
            document.getElementById('eosId').value = id
            document.getElementById('eosNome').value = nomeOS
            document.getElementById('eosModelo').value = modeloOs
            document.getElementById('eosValor').value = valorOs
            document.getElementById('eosMarca').value = marcaOs
            document.getElementById('eosCor').value = corOs
            document.getElementById('eosCpf').value = cpfOs
            document.getElementById('eosImei').value = imeiOs
            document.getElementById('eoTipoOs').value = statusOS
            document.getElementById('eosTipoServico').value = tipoServico


            const modalEditar = new bootstrap.Modal(document.getElementById('editarOsModal'), {show:'true'})
            modalEditar.show()
        })

        // Botao para download
        const btnDown = document.createElement('button')
        const iconsDown = document.createElement('i')
        iconsDown.classList.add('bi')
        iconsDown.classList.add('bi-cloud-arrow-down-fill')
        btnDown.appendChild(iconsDown)
        btnDown.classList.add('btn')
        btnDown.classList.add('btn-sm')
        btnDown.style.background = '#023047'
        new bootstrap.Tooltip(btnDown, {title:'Download!'})
        btnDown.addEventListener('click', function(){
            btnDown.innerHTML = spinner
            window.location = api + '/manager/api/v1/get_os_ind/?os=' + id
        })
            
        // Botao sem conserto
        const btnSemConserto = document.createElement('button')
        const iconSemConserto = document.createElement('i')
        iconSemConserto.classList.add('bi')
        iconSemConserto.classList.add('bi-bell-slash-fill')
        btnSemConserto.appendChild(iconSemConserto)
        btnSemConserto.classList.add('btn')
        btnSemConserto.classList.add('btn-sm')
        new bootstrap.Tooltip(btnSemConserto, {title:'Sem conserto!'})
        btnSemConserto.classList.add('bg-violet')
        btnSemConserto.addEventListener('click', function(){
            btnSemConserto.innerHTML = spinner
            request(`/manager/api/v1/alter_status_os/?os=${id}&status=SEM CONSERTO`, 'POST')
            .then(res=>{
                res.json()
                .then(js=>{
                    alert(js)
                    location.reload()
                })
            })
        })

        // Botao cancelar
        const btnCancelar = document.createElement('button')
        const iconCancelar = document.createElement('i')
        iconCancelar.classList.add('bi')
        iconCancelar.classList.add('bi-trash-fill')
        btnCancelar.appendChild(iconCancelar)
        btnCancelar.classList.add('btn')
        btnCancelar.classList.add('btn-sm')
        new bootstrap.Tooltip(btnCancelar, {title:'Cancelar Ordem!!'})
        btnCancelar.classList.add('btn-danger')
        btnCancelar.addEventListener('click', function(){
            btnCancelar.innerHTML = spinner
            request(`/manager/api/v1/alter_status_os/?os=${id}&status=CANCELADA`, 'POST')
            .then(res=>{
                res.json()
                .then(js=>{
                    alert(js)
                    location.reload()
                })
            })
        })

        
        btngp.appendChild(btnDown)
        btngp.appendChild(btnEditar)
        btngp.appendChild(btnEntregue)
        btngp.appendChild(btnSemConserto)
        btngp.appendChild(btnCancelar)
        
        const act = document.createElement('td')
        act.appendChild(btngp)

        // Add items table
        tr.appendChild(numOs)
        tr.appendChild(cliente)
        tr.appendChild(aparelho)
        tr.appendChild(valor)
        tr.appendChild(st)
        tr.appendChild(atendente)
        tr.appendChild(entrega)
        tr.appendChild(cadastro)
        tr.appendChild(act)

        document.getElementById('tbAbertas').appendChild(tr)  
    }

    const res2 = await request('/manager/api/v1/get_os_expiradas/')
    const js2 = await res2.json()

    for(var x = 0; x < js2.length; x++){
        const id = js2[x][0]
        const nomeOS = js2[x][1]
        const modeloOs = js2[x][2]
        const tipoServico = js2[x][3]
        const valorOs = js2[x][4]
        const statusOS = capitalize(js[x][5])

        const marcaOs = js2[x][9]
        const corOs = js2[x][10]
        const imeiOs = js2[x][11]
        const cpfOs = js2[x][12]

        const tr = document.createElement('tr')

        const numOs = document.createElement('td')
        numOs.classList.add('text-truncate')
        numOs.textContent = js2[x][0]

        const cliente = document.createElement('td')
        cliente.classList.add('text-truncate')
        cliente.textContent = js2[x][1]

        const aparelho = document.createElement('td')
        aparelho.classList.add('text-truncate')
        aparelho.textContent = js2[x][2]

        const valor = document.createElement('td')
        valor.classList.add('text-truncate')
        valor.textContent = `R$ ${js2[x][4]}`

        const st = document.createElement('td')
        st.classList.add('text-truncate')
        const badge = document.createElement('span')
        badge.classList.add('badge')
        badge.classList.add('rounded-pill')
        badge.classList.add('text-bg-danger')
        badge.textContent = 'EXPIRADA'
        st.appendChild(badge)

        const atendente = document.createElement('td')
        atendente.style.marginRight = '50px'
        atendente.classList.add('text-truncate')
        atendente.textContent = js2[x][6]
        
        const cadastro = document.createElement('td')
        cadastro.classList.add('text-truncate')
        cadastro.textContent = js2[x][7]

        const entrega = document.createElement('td')
        entrega.classList.add('text-truncate')
        entrega.textContent = js2[x][8]
        
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
        new bootstrap.Tooltip(btnEntregue, {title:'Marcar como entregue!'})

        btnEntregue.addEventListener('click',function(){
            document.getElementById('idOsEntrega').value = id
            const myModal = new bootstrap.Modal(document.getElementById('ModalEntregue'), {show:'true'})
            myModal.show()
        })

        // Botao para Editar
        const btnEditar = document.createElement('button')
        const iconFinalizar = document.createElement('i')
        iconFinalizar.classList.add('bi')
        iconFinalizar.classList.add('bi-box-arrow-up-right')
        btnEditar.appendChild(iconFinalizar)
        btnEditar.classList.add('btn')
        btnEditar.classList.add('btn-sm')
        btnEditar.classList.add('btn-secondary')
        new bootstrap.Tooltip(btnEditar, {title:'Editar Ordem!'})

        btnEditar.addEventListener('click',  function(){
            document.getElementById('eosId').value = id
            document.getElementById('eosNome').value = nomeOS
            document.getElementById('eosModelo').value = modeloOs
            document.getElementById('eosValor').value = valorOs
            document.getElementById('eosMarca').value = marcaOs
            document.getElementById('eosCor').value = corOs
            document.getElementById('eosCpf').value = cpfOs
            document.getElementById('eosImei').value = imeiOs
            document.getElementById('eoTipoOs').value = statusOS
            document.getElementById('eosTipoServico').value = tipoServico


            const modalEditar = new bootstrap.Modal(document.getElementById('editarOsModal'), {show:'true'})
            modalEditar.show()
        })

        // Botao para download
        const btnDown = document.createElement('button')
        const iconsDown = document.createElement('i')
        iconsDown.classList.add('bi')
        iconsDown.classList.add('bi-cloud-arrow-down-fill')
        btnDown.appendChild(iconsDown)
        btnDown.classList.add('btn')
        btnDown.classList.add('btn-sm')
        btnDown.style.background = '#023047'
        new bootstrap.Tooltip(btnDown, {title:'Download!'})
        btnDown.addEventListener('click', function(){
            btnDown.innerHTML = spinner
            window.location = api + '/manager/api/v1/get_os_ind/?os=' + id
        })
            
        // Botao sem conserto
        const btnSemConserto = document.createElement('button')
        const iconSemConserto = document.createElement('i')
        iconSemConserto.classList.add('bi')
        iconSemConserto.classList.add('bi-bell-slash-fill')
        btnSemConserto.appendChild(iconSemConserto)
        btnSemConserto.classList.add('btn')
        btnSemConserto.classList.add('btn-sm')
        new bootstrap.Tooltip(btnSemConserto, {title:'Sem conserto!'})
        btnSemConserto.classList.add('bg-violet')
        btnSemConserto.addEventListener('click', function(){
            btnSemConserto.innerHTML = spinner
            request(`/manager/api/v1/alter_status_os/?os=${id}&status=SEM CONSERTO`, 'POST')
            .then(res=>{
                res.json()
                .then(js=>{
                    alert(js)
                    location.reload()
                })
            })
        })

        // Botao cancelar
        const btnCancelar = document.createElement('button')
        const iconCancelar = document.createElement('i')
        iconCancelar.classList.add('bi')
        iconCancelar.classList.add('bi-trash-fill')
        btnCancelar.appendChild(iconCancelar)
        btnCancelar.classList.add('btn')
        btnCancelar.classList.add('btn-sm')
        new bootstrap.Tooltip(btnCancelar, {title:'Cancelar Ordem!!'})
        btnCancelar.classList.add('btn-danger')
        btnCancelar.addEventListener('click', function(){
            btnCancelar.innerHTML = spinner
            request(`/manager/api/v1/alter_status_os/?os=${id}&status=CANCELADA`, 'POST')
            .then(res=>{
                res.json()
                .then(js=>{
                    alert(js)
                    location.reload()
                })
            })
        })

        
        btngp.appendChild(btnDown)
        btngp.appendChild(btnEditar)
        btngp.appendChild(btnEntregue)
        btngp.appendChild(btnSemConserto)
        btngp.appendChild(btnCancelar)
        
        const act = document.createElement('td')
        act.appendChild(btngp)

        // Add items table
        tr.appendChild(numOs)
        tr.appendChild(cliente)
        tr.appendChild(aparelho)
        tr.appendChild(valor)
        tr.appendChild(st)
        tr.appendChild(atendente)
        tr.appendChild(entrega)
        tr.appendChild(cadastro)
        tr.appendChild(act)

        document.getElementById('tbExp').appendChild(tr) 
    }
}

async function getAllOs(){
    const res = await request('/manager/api/v1/get_os/')
    const js = await res.json()

    for(var x = 0; x < js.length; x++){
        const id = js[x][0]

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

        const valor = document.createElement('td')
        valor.classList.add('text-truncate')
        valor.textContent = `R$ ${js[x][4]}`

        const st = document.createElement('td')
        st.classList.add('text-truncate')
        const badge = document.createElement('p')
        badge.classList.add('badge')
        badge.classList.add('rounded-pill')

        // Cores dos status!
        if(js[x][5] === 'SEM CONSERTO'){badge.style.background = '#8338ec'}
        else if(js[x][5] === 'ENTREGUE'){badge.classList.add('text-bg-success')}
        else if(js[x][5] === 'FINALIZADA'){badge.style.background = '#fb8500'}
        else if(js[x][5] === 'CANCELADA'){badge.classList.add('text-bg-danger')}
        else if(js[x][5] === 'ABERTA'){badge.style.background = '#023047'}
        else if(js[x][5] === 'ORÇAMENTO'){badge.style.background = '#9c6644'}

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
        new bootstrap.Tooltip(btnCancelar, {title:'Cancelar Ordem!'})
        btnCancelar.addEventListener('click', function(){
            request(`/manager/api/v1/cancelar_os_entregue/?id=${id}`, 'DELETE')
            .then(res=>{
                if(res.ok){
                    res.json().then(js=>{
                        alert(js)
                        location.reload()
                    })
                }
            })
        })
        
        const btnReabrir = document.createElement('button')
        var icon = document.createElement('i')
        btnReabrir.classList.add('btn')
        btnReabrir.classList.add('btn-sm')
        btnReabrir.style.background = '#023047'
        icon.classList.add('bi')
        icon.classList.add('bi-cloud-arrow-down-fill')
        btnReabrir.appendChild(icon)
        new bootstrap.Tooltip(btnReabrir, {title:'Download!'})
        btnReabrir.addEventListener('click', function(){
            btnReabrir.innerHTML = spinner
            window.location = api + '/manager/api/v1/get_os_ind/?os=' + id
        })

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

async function getMarcasOs(){
    const res2 = await request('/manager/api/v1/get_marcas/')
    const js2 = await res2.json()
    for(var x = 0; x < js2.length; x++){
        const sl = document.createElement('option')
        sl.textContent = js2[x][0]
        document.getElementById('noMarca').appendChild(sl)

        const sl2 = document.createElement('option')
        sl2.textContent = js2[x][0]
        document.getElementById('eosMarca').appendChild(sl2)

    }
}

function abrirOS(t){
    var dados = `{
        "id": ${parseInt(document.getElementById("CPF").value)},
        "telefone" : "${document.getElementById("Telefone").value}",
        "endereco" : "${document.getElementById("endereco").value}",
        "imei" : "${document.getElementById("imei").value}",
        "modelo" : "${document.getElementById("modelo").value}",
        "cor" : "${document.getElementById("cor").value}",
        "marca" : "${document.getElementById("noMarca").value}",
        "status":"${statusM}",
        "tipo":"${tipo}",
        "ligar" : ${document.getElementById("ligar").checked},
        "obs" : "${document.getElementById("obs").value}",
        "relato" : "${document.getElementById("relato").value}",
        "retirada" : "${document.getElementById("retirada").value}",
        "valor" : ${parseFloat(document.getElementById("valor").value)},
        "matricula" : "${document.getElementById("matricula").value}",
        "statusOS" : "${document.getElementById("noTipoOs").value}"
    }`
    
    if(document.getElementById("Telefone").value){
        if(document.getElementById("endereco").value){
            if(document.getElementById("modelo").value){
                if(document.getElementById("cor").value){
                    if(document.getElementById("noMarca").value){
                        if(document.getElementById("valor").value){
                            if(document.getElementById("matricula").value){
                                t.innerHTML = spinner
                                request('/manager/api/v1/abrir_os/', 'POST', dados)
                                .then(res=>{
                                    res.json()
                                    .then(js=>{
                                        alert(js)
                                        location.reload()
                                    })
                                })
                            }else{alert('Matricula não informada!')}
                        }else{alert('Ordem sem valor!')}
                    }else{alert('Não indicamos trabalhar com aparelho sem marca!')}
                }else{alert('Registre a cor do aparelho!')}
            }else{alert('Modelo não deve estar vazio!')}
        }else{alert('Endereço não deve estar vazio!')}
    }else{alert('Telefone não deve estar vazio!')}
}

function entregarOs(t){
    statusCaixa()
    .then(res=>{
        if(res){
            t.innerHTML = spinner
            var idOs = document.getElementById('idOsEntrega').value
            var custo = document.getElementById('osCusto').value
            var peca = document.getElementById('osPeca').value
            var pag = document.getElementById('osPag').value
        
            request(`/manager/api/v1/alter_status_os/?os=${idOs}&status=ENTREGUE&custo=${custo}&pag=${pag}&peca=${peca}`, 'POST')
            .then(res=>{
                res.json().then(js=>{
                    alert(js)
                    location.reload()
                })
            })
        }else{alert('Caixa ainda fechado!')}
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

function editarOs(t){
    var id = document.getElementById('eosId').value
    var cpf = document.getElementById('eosCpf').value
    var modelo = document.getElementById('eosModelo').value
    var cor = document.getElementById('eosCor').value
    var marca = document.getElementById('eosMarca').value
    var imei = document.getElementById('eosImei').value
    var valor = document.getElementById('eosValor').value
    var tipoOs = document.getElementById('eoTipoOs').value
    var servico = document.getElementById('eosTipoServico').value

    var dados = `{
        "id": "${id}",
        "modelo": "${modelo}",
        "cor": "${cor}",
        "marca": "${marca}",
        "imei": "${imei}",
        "valor": ${parseFloat(valor)},
        "statusOS": "${tipoOs}",
        "servico": "${servico}",
        "cpf": "${cpf}"
    }`

    if(modelo && marca && cor && valor){
        t.innerHTML = spinner
        request('/manager/api/v1/editar_os/', 'POST', dados)
        .then(res=>{res.json().then(js=>{
            alert(js)
            location.reload()
        })})
    }else{
        alert('Preencha todos os dados!')
    }

}

// =============== Clientes
async function get_clientes() {
    const res = await request('/manager/api/v1/get_cliente/')
    const js = await res.json()

    for(var x = 0; x < js.length; x++){
        const tr = document.createElement('tr')

        const id = js[x][0]
        const cpf = js[x][1]
        const nome = js[x][2]
        const telefone = js[x][3]
        const modelo = js[x][4]
        const marca = js[x][5]
        const cor = js[x][6]
        const endereco = js[x][7]
        const obs = js[x][8]
        const imei = js[x][10]

        const idTd = document.createElement('td')
        idTd.textContent = id
        
        const cpfTd = document.createElement('td')
        cpfTd.classList.add('text-truncate')
        cpfTd.textContent = cpf
        
        const nomeTd = document.createElement('td')
        nomeTd.classList.add('text-truncate')
        nomeTd.textContent = nome
        
        const telefoneTd = document.createElement('td')
        telefoneTd.classList.add('text-truncate')
        telefoneTd.textContent = telefone
        
        const modeloTd = document.createElement('td')
        modeloTd.classList.add('text-truncate')
        modeloTd.textContent = modelo
        
        const marcaTd = document.createElement('td')
        marcaTd.classList.add('text-truncate')
        marcaTd.textContent = marca

        const corTd = document.createElement('td')
        corTd.classList.add('text-truncate')
        corTd.textContent = cor

        const enderecoTd = document.createElement('td')
        enderecoTd.classList.add('text-truncate')
        enderecoTd.textContent = endereco
        
        // const obsTd = document.createElement('td')
        // obsTd.textContent = obs

        const btnWhats = document.createElement('button')
        btnWhats.classList.add('btn')
        btnWhats.classList.add('btn-sm')
        btnWhats.classList.add('btn-success')
        var icon = document.createElement('i')
        icon.classList.add('bi')
        icon.classList.add('bi-whatsapp')
        btnWhats.appendChild(icon)
        new bootstrap.Tooltip(btnWhats, {title:'Abrir contato!'})
        btnWhats.addEventListener('click',function(){
            window.open(`https://api.whatsapp.com/send/?phone=${telefone}`)
        })

        const btnEditar = document.createElement('button')
        btnEditar.classList.add('btn')
        btnEditar.classList.add('btn-sm')
        btnEditar.classList.add('btn-secondary')
        var icon = document.createElement('i')
        icon.classList.add('bi')
        icon.classList.add('bi-box-arrow-up-right')
        new bootstrap.Tooltip(btnEditar, {title:'Editar!'})
        btnEditar.appendChild(icon)
        btnEditar.addEventListener('click', function(){
            document.getElementById('ecId').value = id
            document.getElementById('ecCpf').value = cpf
            document.getElementById('ecNome').value = nome
            document.getElementById('ecTel').value = telefone
            document.getElementById('ecModelo').value = modelo
            document.getElementById('ecCor').value = cor
            document.getElementById('ecMarca').value = marca
            document.getElementById('ecImei').value = imei
            document.getElementById('ecEnd').value = endereco
            document.getElementById('ecObs').value = obs

            const modalEditarCliente = new bootstrap.Modal(document.getElementById('editarClienteModal'), {show:'true'})
            modalEditarCliente.show()
        })

        const btnRemov = document.createElement('button')
        btnRemov.classList.add('btn')
        btnRemov.classList.add('btn-sm')
        btnRemov.classList.add('btn-danger')
        var icon = document.createElement('i')
        icon.classList.add('bi')
        icon.classList.add('bi-trash-fill')
        new bootstrap.Tooltip(btnRemov, {title:'Excluir!'})
        btnRemov.appendChild(icon)
        btnRemov.addEventListener('click', function(){
            btnRemov.innerHTML = spinner
            request('/manager/api/v1/remover_cliente/?id=' + id, 'DELETE')
            .then(res=>{res.json().then(js=>{
                alert(js)
                location.reload()
            })})
        })

        const btngp = document.createElement('div')
        btngp.classList.add('btn-group')
        btngp.appendChild(btnWhats)
        btngp.appendChild(btnEditar)
        btngp.appendChild(btnRemov)

        const btns = document.createElement('td')
        btns.appendChild(btngp)

        tr.appendChild(idTd)
        tr.appendChild(cpfTd)
        tr.appendChild(nomeTd)
        tr.appendChild(telefoneTd)
        tr.appendChild(modeloTd)
        tr.appendChild(marcaTd)
        tr.appendChild(corTd)
        tr.appendChild(enderecoTd)
        // tr.appendChild(obsTd)
        tr.appendChild(btns)

        document.getElementById('tableClientes').appendChild(tr)
    }
}

async function getMarcasClientes(){
    const res2 = await request('/manager/api/v1/get_marcas/')
    const js2 = await res2.json()
    for(var x = 0; x < js2.length; x++){
        var sl = document.createElement('option')
        sl.textContent = js2[x][0]
        document.getElementById('ncMarca').appendChild(sl)

        var sl2 = document.createElement('option')
        sl2.textContent = js2[x][0]
        document.getElementById('ecMarca').appendChild(sl2)
    }
}

function newClient(t){
    var cpf = document.getElementById('ncCpf').value
    var nome = document.getElementById('ncNome').value
    var tel = document.getElementById('ncTel').value
    var modelo = document.getElementById('ncModelo').value
    var cor = document.getElementById('ncCor').value
    var marca = document.getElementById('ncMarca').value
    var imei = document.getElementById('ncImei').value
    var end = document.getElementById('ncEnd').value
    var obs = document.getElementById('ncObs').value
    
    if(nome){
        if(tel){
            if(modelo){
                if(cor){
                    if(marca){
                        if(!cpf){cpf = 0}
                        var dados = `{
                            "cpf": "${cpf}",
                            "nome": "${nome}",
                            "tel": "${tel}",
                            "modelo": "${modelo}",
                            "cor": "${cor}",
                            "marca": "${marca}",
                            "imei": "${imei}",
                            "end": "${end}",
                            "obs": "${obs}"
                        }`
                        t.innerHTML = spinner
                        console.log(dados)
                        request('/manager/api/v1/cadastrar_cliente/', 'POST', dados)
                        .then(res=>{res.json().then(js=>{
                            alert(js)
                            location.reload()
                        })})
                    }else{alert('Marca obrigatória!')}
                }else{alert('Cor obrigatória!')}
            }else{alert('Modelo obrigatório!')}
        }else{alert('Telefone não deve estar vazio!')}
    }else{alert('Nome não deve estar vázio!')}
}

function editarCliente(t){
    var id = document.getElementById('ecId').value
    var cpf = document.getElementById('ecCpf').value
    var nome = document.getElementById('ecNome').value
    var tel = document.getElementById('ecTel').value
    var modelo = document.getElementById('ecModelo').value
    var cor = document.getElementById('ecCor').value
    var marca = document.getElementById('ecMarca').value
    var imei = document.getElementById('ecImei').value
    var end = document.getElementById('ecEnd').value
    var obs = document.getElementById('ecObs').value

    if(nome){
        if(tel){
            if(modelo){
                if(cor){
                    if(marca){
                        if(!cpf){cpf = 0}
                        var dados = `{
                            "id": "${id}",
                            "cpf": "${cpf}",
                            "nome": "${nome}",
                            "tel": "${tel}",
                            "modelo": "${modelo}",
                            "cor": "${cor}",
                            "marca": "${marca}",
                            "imei": "${imei}",
                            "end": "${end}",
                            "obs": "${obs}"
                        }`
                        t.innerHTML = spinner
                        console.log(dados)
                        request('/manager/api/v1/editar_cliente/', 'PATCH', dados)
                        .then(res=>{res.json().then(js=>{
                            alert(js)
                            location.reload()
                        })})
                    }else{alert('Marca obrigatória!')}
                }else{alert('Cor obrigatória!')}
            }else{alert('Modelo obrigatório!')}
        }else{alert('Telefone não deve estar vazio!')}
    }else{alert('Nome não deve estar vázio!')}
}

// =============== Estoque
async function getProdutos() {
    request('/manager/api/v1/get_prods/')
    .then(res=>{
        res.json()
        .then(res=>{
            for(var x = 0; x < res.length; x++){
                const tr = document.createElement('tr')
    
                const id = document.createElement('td')
                id.textContent = res[x][0]
                id.classList.add('text-truncate')
                
                const nome = document.createElement('td')
                nome.classList.add('text-truncate')
                nome.textContent = res[x][1]
    
                const custo = document.createElement('td')
                custo.textContent = res[x][2]
                
                const valor = document.createElement('td')
                valor.textContent = res[x][3]
    
                const alerta = document.createElement('td')
                alerta.textContent = res[x][4]
    
                const quantidade = document.createElement('td')
                quantidade.textContent = res[x][5]
    
                const btngp = document.createElement('div')
                btngp.classList.add('btn-group')
                const btns = document.createElement('td')
                btns.appendChild(btngp)
    
                // Buttons
                const btnEditar = document.createElement('button')
                btnEditar.classList.add('btn')
                btnEditar.classList.add('btn-sm')
                btnEditar.classList.add('btn-secondary')
                var icon = document.createElement('i')
                icon.classList.add('bi')
                icon.classList.add('bi-box-arrow-up-right')
                btnEditar.appendChild(icon)
    
                const btnRemov = document.createElement('button')
                btnRemov.classList.add('btn')
                btnRemov.classList.add('btn-sm')
                btnRemov.classList.add('btn-danger')
                var icon = document.createElement('i')
                icon.classList.add('bi')
                icon.classList.add('bi-trash-fill')
                btnRemov.appendChild(icon)
    
                const btnEntrada = document.createElement('button')
                btnEntrada.classList.add('btn')
                btnEntrada.classList.add('btn-sm')
                btnEntrada.classList.add('btn-success')
                var icon = document.createElement('i')
                icon.classList.add('bi')
                icon.classList.add('bi-plus-circle-fill')
                btnEntrada.appendChild(icon)
    
                btngp.appendChild(btnEditar)
                btngp.appendChild(btnRemov)
                btngp.appendChild(btnEntrada)
    
                tr.appendChild(id)
                tr.appendChild(nome)
                tr.appendChild(custo)
                tr.appendChild(valor)
                tr.appendChild(alerta)
                tr.appendChild(quantidade)
                tr.appendChild(btns)
    
                document.getElementById('tbody').appendChild(tr)
            }
        })
    })   
}

// =============== Configurações
function estoque_negativo(t){
    console.log(t.checked)

}

function trocar_fuso(t){
    console.log(t.value)
}