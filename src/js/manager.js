var div = document.createElement('div')
var cart = []

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

function msgA(msg, type){
    var msgDiv = document.getElementById('msgAlert')
    msgDiv.innerHTML = `<p>${msg}</p>`
    if(type === 2){
        msgDiv.classList.remove('alert-warning')
        msgDiv.classList.add('alert-danger')
    }
    msgDiv.hidden = ''
}

function toast(msg){
    const toastLiveExample = document.getElementById('toastHbx')
    document.getElementById('toast-text').textContent = msg
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
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
        fetch(`/manager/api/v1/vender/?dd=${dd}&&cart=${cart}`, {method:'post'})
        .then(res=>{
            if(res.ok){
                toast('Venda realizada com sucesso!')
                location.reload()
            }
        })
    }else{
        toast('Dados incompletos!')
    }
}

function conferMatricula(mat){
    if(mat.value){
        fetch('/manager/api/v1/mat_verify/?mat='+mat.value)
        .then(res=>{
            res.json()
            .then(res=>{
                if(!res){
                    toast('Matricula Invalida!')
                    mat.value = ''
                }
            })
        })
    }
}

function conferTroco(mat){
    conferMatricula(document.getElementById('mattroco'))
    if(mat.value){
        fetch('/manager/api/v1/mat_verify/?mat='+mat.value)
        .then(res=>{
            res.json()
            .then(res=>{
                if(res){
                    fetch('/manager/api/v1/get_valor_caixa/')
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

function zerarcart(){
    cart = []
    document.getElementById('valorProd').value =  null
    document.getElementById('listProdAdd').innerHTML = ''
}

function motivoF(sl){
    inn = document.getElementById('motivoIn')

    if(sl.value === 'Outro'){inn.hidden = ''}
    else{inn.hidden = 'none'}
}

function capitalize(string){
    string = string.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function changeWin(win){
    console.log(win)
    const changer = document.getElementById('changer')

    changer.src = win
}

// CONSULTAS

// =============== Caixa
async function calc(){
    const res = await fetch('/manager/api/v1//calc_fechamento/')
    const js = await res.json()
    for(item in js){
        document.getElementById(item.toLowerCase()).value += parseFloat(js[item]).toFixed(2)
    }
    // document.getElementById('total').value += parseFloat(js['PIX'] + js['DINHEIRO'] + js['DEBITO'] + js['CREDITO']).toFixed(2)
}

async function conferCaixa(){
    const res = await fetch('/manager/api/v1//confer_caixa')
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
    const res = await fetch('/manager/api/v1/get_saidas_caixa')
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
            fetch(`/manager/api/v1/excluir_saidas/?id=${id}`, {method:'post'})
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

// =============== Vendas
async function vendasPorTipo(){
    const res = await fetch('/manager/api/v1/vendas_por_tipo/')
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

async function getSaidas(){
    const res = await fetch('/manager/api/v1/get_saidas/', {method:'get'})
    const js = await res.json()

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
        btnCancel.addEventListener('click',function(){
            fetch(`/m_excluir_saida/?id=${id}&idVenda=${idVenda}`, {method:'post'})
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

async function getProds(){
    const res = await fetch('/manager/api/v1/get_prods/')
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

// =============== Ordens de Serviço
async function getStatusOs() {
    const res = await fetch('/manager/api/v1/get_os_status/')
    const js = await res.json()
    document.getElementById('abertas').textContent = js['ABERTA']
    document.getElementById('canceladas').textContent = js['CANCELADA']
    document.getElementById('semconserto').textContent = js['SEM CONSERTO']
    document.getElementById('finalizadas').textContent = js['FINALIZADA']
    document.getElementById('entregues').textContent = js['ENTREGUE']
}

async function getOsAbertas(){
    const res = await fetch('/manager/api/v1/get_os_abertas/')
    const js = await res.json()
    
    for(var x = 1; x < js.length; x++){
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

        // Botao para finalizar
        const btnFinalizar = document.createElement('button')
        const iconFinalizar = document.createElement('i')
        iconFinalizar.classList.add('bi')
        iconFinalizar.classList.add('bi-chat-left-quote-fill')
        btnFinalizar.appendChild(iconFinalizar)
        btnFinalizar.classList.add('btn')
        btnFinalizar.classList.add('btn-sm')
        btnFinalizar.classList.add('bg-orange')

        // Botao sem conserto
        const btnSemConserto = document.createElement('button')
        const iconSemConserto = document.createElement('i')
        iconSemConserto.classList.add('bi')
        iconSemConserto.classList.add('bi-bell-slash-fill')
        btnSemConserto.appendChild(iconSemConserto)
        btnSemConserto.classList.add('btn')
        btnSemConserto.classList.add('btn-sm')
        btnSemConserto.classList.add('bg-violet')

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
        btngp.appendChild(btnFinalizar)
        btngp.appendChild(btnSemConserto)
        btngp.appendChild(btnCancelar)
        
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
    const res = await fetch('/manager/api/v1/get_os/')
    const js = await res.json()

    for(var x = 1; x < js.length; x++){
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