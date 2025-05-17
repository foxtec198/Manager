var div = document.createElement('div')
var cart = []
var statusM = []
var cont_status = 0
var spinner = '<span class="spinner-border spinner-border-sm text-light" role="status"></span>'
green = '#5E8B60'


sessionStorage.setItem('filterRes', 'hoje')
var filterRes = sessionStorage.getItem('filterRes')

// var api = 'https://api.hubbix.com.br/manager/v1/'
var api = 'http://localhost:9560/manager/v1/'

cr = sessionStorage.getItem('cr')
gc = sessionStorage.getItem('gc')

// function openCalc(){
//     const divCalc = document.getElementById('divCalc')
//     const btnCalc = document.getElementById('btnCalc')
 
//     if(divCalc.hidden){
//         divCalc.hidden = ''
//         btnCalc.innerHTML = '<i class="bi bi-caret-right-fill"></i>'
//     }else{
//         divCalc.hidden = 'none'
//         btnCalc.innerHTML = '<i class="bi bi-caret-left-fill"></i>'
//     }
// }

function toast(msg, type=null){
    tst = document.getElementById("snackbar");
    tst.textContent = msg
    tst.className = "show";
    if(type==='erro'){
        tst.style.background = '#c1121f'
    }else if(type='info'){
        tst.style.background = '#333'
    }else{
        tst.style.background = '#3a5a40'
    }
    setTimeout(function(){ tst.className = tst.className.replace("show", ""); }, 3000);
}

async function login(){
    mat = document.getElementById("mat").value
    pwd = document.getElementById("pwd").value

    if(mat){
        if(pwd){
            ldg()
            const res = await fetch(api + `login?mat=${mat}&&pwd=${pwd}`, {method:'POST'})
            const js = await res.json()
            if(res.ok){
                sessionStorage.setItem('cr', js['cr'])
                sessionStorage.setItem('gc', js['gc'])
                document.location = '/manager/base.html'
            }else{
                closeLdg()
                toast(js)
            }
        }else{toast('Senha vazia')}
    }else{toast("Matricula vazia")}

}

function logout(){
    sessionStorage.clear()
    document.location = '/'
}

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
        json = JSON.stringify(json)
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

function sendForm(url, form){
    if(!form){
        var options = {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'cr' : `${cr}`,
                'gc' : `${gc}`
            }
        };
    }else{
        var options = {
            method: 'POST',
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'cr' : `${cr}`,
                'gc' : `${gc}`
            },
            body: form
        };
    }
    return fetch(api + url, options)
}

function sendImage(url, img){
    const form = new FormData();
    form.append("imgProd", "C:\\Users\\Guilherme Breve\\Downloads\\download-removebg-preview.png");
    // form.append("image", img);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
            'User-Agent': 'insomnia/10.2.0',
            cr: '2 - PR - TECNOBREVE',
            gc: 'PR - TECNOBREVE'
        },
        body: form
    };

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

async function conferMatricula(mat){
    if(mat.value){
        mat.disabled = true
        req = await request(`mat?mat=${mat.value}`)
        if(!req.ok){
            mat.value = ''
            mat.disabled = false
        }
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

// Troca e memoriza a screen
function change_screen(screnn, t=null){
    others = document.querySelectorAll('.menu-item')
    others.forEach(element => {
        element.style.background = null
    });
    if(t){t.style.background = green}
    frame = document.getElementById('frame_screen')
    sessionStorage.setItem('frame', `/manager/${screnn}.html`)
    frame.src = `/manager/${screnn}.html`
}

// Recupera a tela mesmo que atualize a pagina
function restore_screen(){
    frame = sessionStorage.getItem('frame')
    frameWidget = document.getElementById('frame_screen')
    
    if(frame){
        txt1 = frame.replace('/manager/', '')
        txt2 = txt1.replace('.html', '')
        frameWidget.src = frame
        document.querySelector(`.menu-${txt2}`).style.background = green
    }
}

function inform(msg){
    var d = document.getElementById('alertt')
    d.hidden = ''
    document.getElementById('alertt-msg').textContent = decodeURI(msg)
}

function to_real(valor){
    return valor.toLocaleString('pt-br', {style:'currency', currency:'BRL'})
}

async function get_loja(){
    req = await request('get_loja')
    res = await req.json()
    if(req.ok){
        var label = document.getElementById('nomeLoja')
        label.textContent = res['nome']
        label.classList.remove('placeholder')
        
        var img = document.getElementById('logoBase')
        img.src = `https://api.hubbix.com.br/img/${res['logo']}`
        img.classList.remove('placeholder')

    }
}

async function conferCpf(inp){
    var cpf = await inp.value
    const res = await request(`/manager/api/v1/conferir_cpf/?id=${cpf}`)
    const js = await res.json()
    return js
}

// =============== Caixa
async function calc(){
    const res = await request('fechamento')
    const js = await res.json()
    if(res.ok){
        for(item in js){
            document.getElementById(item.toLowerCase()).value += to_real(js[item])
        }
    }
}

async function conferencia_de_caixa(){
    const js = await statusCaixa()
    if(js.status){
        const status = document.getElementById('statusCaixa')

        status.classList.remove('placeholder')
        status.classList.add('text-bg-success')

        status.textContent = 'Caixa Aberto - ' + to_real(js.valor)
        document.getElementById('btnAbrirCaixa').disabled = true
    }else{
        const status = document.getElementById('statusCaixa')
        
        status.classList.remove('placeholder')
        status.classList.add('text-bg-danger')
        
        status.textContent = `Caixa Fechado - R$ 0`
    }
}

async function get_despesas(){
    const req = await request('despesas')
    const res = await req.json()
    if(req.ok){
        res.forEach(item => {
            const id = item['id']
            const motivo = item['motivo']
            const valor = item['valor']
            const data_alt = new Date(item['data']).toLocaleDateString('pt-br', {'day':'numeric', 'month':'long', 'hour':'2-digit', 'minute':'2-digit'})

            var li = document.createElement('li') 
            var btn = document.createElement('button')
    
            li.classList.add('list-group-item')
            li.classList.add('d-flex')
            li.classList.add('justify-content-between')
            li.classList.add('align-items-center')
            li.innerHTML = `
            <span>${motivo} - ${to_real(valor)} - ${data_alt}</span>
            `
            btn.classList.add('btn')
            btn.classList.add('btn-danger')
            btn.innerHTML = `<i class="bi bi-trash-fill"></i>`
            btn.addEventListener('click', async function(){
                const req = await request("despesas", "DELETE", {'id':id})
                const res = await req.json()
                if(req.ok){location.reload()}
                else{toast(res)}
            })
            li.appendChild(btn)
    
            document.getElementById('saidasCaixa').appendChild(li)
        })
    }
}

async function statusCaixa(){
    const res = await request('caixa')
    const resJ = await res.json()
    
    return resJ
}

async function abrirCaixa(t){
    var mat = document.getElementById('mattroco').value
    var troco = document.getElementById('troco').value

    if(mat && troco){
        t.innerHTML = spinner
        dados = {'valor': troco, 'mat': mat}
        const req = await request("caixa", "POST", dados) 
        const res = await req.json() 
        if(req.ok){location.reload()}
        else{toast(res)}
    }
}

async function fechar_caixa(t){
    var mat = document.getElementById('fecharMat').value
    if(mat !== ''){
        t.innerHTML = spinner
        const req = await request('caixa', 'DELETE', {'mat': mat})
        const res = await req.json()
        if(req.ok){location.reload()}
        else{toast(res)}
    }
}

async function adicionar_despesa(t){
    var mat = document.getElementById('retirarMat').value
    var motivo = document.getElementById('retirarMotivo').value
    var desc = document.getElementById('motivoIn').value
    var valor = document.getElementById('retirarV').value

    if(mat && valor && motivo){
        if(motivo === 'Despesa'){motivo = desc}
        t.innerHTML = spinner
        dd = {'mat': mat, 'valor': valor, 'motivo': motivo}
        req = await request("despesas", 'POST', dd)
        res = await req.json()
        if(req.ok){location.reload()}
        else{toast(res); t.textContent = 'Adicionar'}
    }else(toast("Preencha todos os dados!"))
}

async function aplicarVlr(t){
    var mat = document.getElementById('aplicarMat').value
    var valor = document.getElementById('aplicarValor').value

    if(mat && valor){
        t.innerHTML = spinner
        req = await request("caixa", 'PATCH', {'valor':valor, 'mat':mat})   
        res = await req.json()
        if(req.ok){location.reload()}
        else{toast(res)}
    }
}

function motivoF(sl){
    inn = document.getElementById('motivoIn')

    if(sl.value === 'Despesa'){inn.hidden = ''}
    else{inn.hidden = 'none'}
}

async function conferTroco(mat){
    const btn = document.getElementById('btnAbrirCaixa')
    const res = await conferMatricula(mat)
    const caixa = await statusCaixa()
    if(!caixa.status){
        if(mat.value){
            btn.innerHTML = spinner
            const req = await request(`mat?mat=${mat.value}`)
            const res = await req.json()
            if(req.ok){
                const req = await request('valor_troco')
                const res = await req.json()
                document.getElementById('troco').value = res
                btn.textContent = 'Abrir'
                btn.disabled = false
            }
        }else{document.getElementById('troco').value = ''}
    }else{toast("Caixa já aberto"); mat.value = ''; mat.disabled = ''}

}

// =============== Vendas
async function getSaidas(){
    const req = await request('saidas')
    const res = await req.json()

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

    if(req.ok){
        res.forEach(item => {
            const tr = document.createElement('tr')
            
            const nome = document.createElement('td')
            nome.classList.add('text-truncate')
            nome.textContent = item['nome']
    
            const valor = document.createElement('td')
            valor.textContent = to_real(item['valor'])
    
            const cliente = document.createElement('td')
            cliente.classList.add('text-truncate')
            cliente.textContent = item['cliente']
    
            const pagamento = document.createElement('td')
            pagamento.textContent = item['pagamento']
    
            const atendente = document.createElement('td')
            atendente.textContent = item['atendente']
    
            const data = document.createElement('td')
            data.classList.add('text-truncate')
            data.textContent = new Date(item['data']).toLocaleDateString('pt-br', {'day':'2-digit','month':'long','hour':'2-digit','minute':'2-digit'})
    
            const id = item['id']
            const idVenda = item['idVenda']
    
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
    
            btnCancel.addEventListener('click', async function(){
                var conf = confirm('Deseja excluir permanentemente esta venda?')
                if(conf){
                    btnCancel.innerHTML = spinner
                    const req = await request("vendas", "DELETE", {'id':id,'id_venda':idVenda})
                    const res = await req.json()
                    if(req.ok){location.reload()}
                    else{toast(res)}
                }
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
    
            btnCancelItem.addEventListener('click', async function(){
                var conf = confirm('Deseja excluir permanentemente este item?')
                if (conf){
                    btnCancelItem.innerHTML = spinner
                    const req = await request("saidas", "DELETE", {'id':id, 'id_venda':idVenda})
                    const res = await req.json()
                    if(req.ok){location.reload()}
                    else{toast(res)}
                }
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
        })
    }
}

async function vendasPorTipo(){
    const res = await request('vendas')
    const js = await res.json()

    var credito = js['CREDITO']
    var debito = js['DEBITO']
    var pix = js['PIX']
    var dinheiro = js['DINHEIRO']
    var dia = js['DIA']
    var total = dinheiro + pix + debito + credito

    document.getElementById('vendasMes').textContent = to_real(total)
    document.getElementById('vendasDia').textContent = to_real(dia)
    document.getElementById('pix').textContent = to_real(pix)
    document.getElementById('cards').textContent = to_real(debito + credito)
    document.getElementById('dinheiro').textContent = to_real(dinheiro)
}

async function getProds(){
    const res = await request('produtos')
    const js = await res.json()

    if(res.ok){
        js.forEach(item => {
            const tr = document.createElement('tr')
        
            const idProd = item['id']
            const nome = item['nome']
            const valor = item['valor']
        
            const nomeTd = document.createElement('td')
            nomeTd.textContent = nome
            
            const btnTd = document.createElement('td')
            const btn = document.createElement('button')
            btn.classList.add('btn')
            btn.classList.add('btn-dark')
            btn.innerHTML = '<i class="bi bi-plus-square-dotted"></i>'
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
        })
    }
}

async function conferCPFNewVenda(inp) {
    var cpf = await inp.value
    
    if(cpf.length > 11){
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
    }else{
        alert('CPF Incorreto!')
        inp.value = ''
    }
}

async function vender(){
    var valorTotal = document.getElementById('valorProd').value
    var mat = document.getElementById('matricula').value
    var cpf = document.getElementById('cpf').value
    var desconto = document.getElementById('desconto').value
    var sel = document.getElementById('selPag').value

    var dd = {
        'mat': mat,
        'valor': valorTotal,
        'cpf': cpf,
        'desconto': desconto,
        'mt_pag': sel,
        'cart': cart,
        'tipo': 'PRODUTOS' 
    }

    if(mat && valorTotal && sel){
            document.getElementById('btnVender').innerHTML = spinner
            const req = await request("vendas", 'POST', dd)
            const res = await req.json()
            if(req.ok){location.reload()}
            else{toast(res)}
    }toast('Preencha os dados necessários!')
}

function zerarcart(){
    cart = []
    document.getElementById('valorProd').value =  null
    document.getElementById('listProdAdd').innerHTML = ''
}

// =============== Ordens de Serviço
async function getDadosOs() {
    const req = await request('clientes')
    const res = await req.json()

    if(req.ok){
        res.forEach(item => {
            const id = item['id']
            const cpf = item['cpf']
            const nome = item['nome']
            const telefone = item['telefone']
            const modelo = item['modelo']
            const marca = item['marca']
            const cor = item['cor']
            const endereco = item['endereco']
            const imei = item['imei']
    
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
                var day = date.getDate() + 1 // Pega um dia a mais
                var month = date.getMonth() + 1 // Inicia em 0 por isso a adição de 1
    
                if(day < 10){day = '0' + day}
                if(month < 10){month = '0' + month}
                var dateEnd = `${date.getFullYear()}-${month}-${day}`
    
                document.getElementById("retirada").value = dateEnd
            })
    
            li.appendChild(s)
            li.appendChild(btnAdd)
            ul.appendChild(li)
        })
    }else{
        var ul = document.getElementById('listClient')
        var li = document.createElement('li')
        li.classList.add('list-group-item')
        li.textContent = 'Nenhum cliente cadastrado, bora começar ?'
        ul.appendChild(li)
    }

    const res4 = await request('status')
    const js4 = await res4.json()
    if(res4.ok){
        js4.forEach(item=>{
            var sl = document.createElement('option')
            sl.id = `opt_${item['status']}`
            sl.textContent = item['status']
            document.getElementById('status').appendChild(sl)
        })
    }
    for(var x = 0; x < js4.length; x++){
    }

    // const resProds = await request('/manager/api/v1/get_prods/')
    // const jsProd = await resProds.json()

    // jsProd.forEach(res => {
    //     const tr = document.createElement('tr')

    //     const idProd = res[0]
    //     const nome = res[1]
    //     const valor = res[3]

    //     const nomeTd = document.createElement('td')
    //     nomeTd.textContent = nome
        
    //     const btnTd = document.createElement('td')
    //     const btn = document.createElement('button')
    //     btn.classList.add('btn')
    //     btn.classList.add('btn-dark')
    //     btn.innerHTML = '<i class="bi bi-plus-square-dotted"></i>'
    //     btn.addEventListener('click', function(){
    //         const vl = document.getElementById('valor')
    //         let newvl = 0
    //         if(vl.value){
    //             newvl = (parseFloat(vl.value) + parseFloat(valor)).toFixed(1)
    //         }else{
    //             newvl = parseFloat(valor)
    //         }
    //         vl.value = newvl
    //         const li = document.createElement('li')
    //         li.classList.add('list-group-item')
    //         li.classList.add('d-flex')
    //         li.classList.add('justify-content-between')
    //         li.classList.add('align-items-center')
    //         li.textContent = nome
    //         const btnRemoveItem = document.createElement('button')
    //         btnRemoveItem.classList.add('btn')
    //         btnRemoveItem.classList.add('btn-danger')
    //         btnRemoveItem.innerHTML = '<i class="bi bi-trash-fill"></i>'
    //         btnRemoveItem.addEventListener('click', function(){
    //             document.getElementById('listProdAddsOs').removeChild(li)
    //             vl.value = (parseFloat(vl.value) - parseFloat(valor)).toFixed(1)
    //             cart.splice(cart.indexOf(nome), 1)
    //         })

    //         li.appendChild(btnRemoveItem)
    //         document.getElementById('listProdAddsOs').appendChild(li)
    //         cart.push(nome)
    //     })
    //     btnTd.appendChild(btn)
    //     tr.appendChild(nomeTd)
    //     tr.appendChild(btnTd)

    //     document.getElementById('listProdOs').appendChild(tr)
    // });


}

async function getStatusOs() {
    const res = await request('os_tipo')
    const js = await res.json()
    document.getElementById('abertas').textContent = js['ABERTA']
    document.getElementById('canceladas').textContent = js['CANCELADA']
    document.getElementById('semconserto').textContent = js['SEM CONSERTO']
    document.getElementById('entregues').textContent = js['ENTREGUE']
}

async function getOsAbertas(){
    const req = await request("os?status='ABERTA','ORCAMENTO'")
    const js = await req.json()

    // Dentro do Prazo
    if(req.ok){
        js.forEach(item=>{
            const id = item['id']
            const nomeOS = item['nome']
            const modeloOs = item['modelo']
            const valorOs = item['valor']
            const atendenteOS = item['atendente']
            const marcaOs = item['marca']
            const corOs = item['cor']
            const statusOS = item['status']
            const aberturaOS = new Date(item['abertura']).toLocaleDateString("pt-br",{day:'2-digit',month:'long',hour:'2-digit',minute:'2-digit'})
            const entregaOS = new Date(item['entrega']).toLocaleDateString("pt-br",{day:'2-digit',month:'long'})
            const tipoOS = item['tipo']
            const imeiOS = item['imei']
            const cpfOS = item['cpf']
            
        
            const tr = document.createElement('tr')
        
            const numOs = document.createElement('td')
            numOs.classList.add('text-truncate')
            numOs.textContent = id
        
            const cliente = document.createElement('td')
            cliente.classList.add('text-truncate')
            cliente.textContent = nomeOS
        
            const aparelho = document.createElement('td')
            aparelho.classList.add('text-truncate')
            aparelho.textContent = modeloOs
        
            const valor = document.createElement('td')
            valor.classList.add('text-truncate')
            valor.textContent = to_real(valorOs)
        
            const st = document.createElement('td')
            st.classList.add('text-truncate')
            const badge = document.createElement('span')
            badge.classList.add('badge')
            badge.classList.add('rounded-pill')
            if(statusOS === 'ABERTA'){badge.style.background = '#023047'}
            else if(statusOS === 'ORÇAMENTO'){badge.style.background = '#9c6644'}
            badge.textContent = capitalize(statusOS)
            st.appendChild(badge)
        
            const atendente = document.createElement('td')
            atendente.style.marginRight = '50px'
            atendente.classList.add('text-truncate')
            atendente.textContent = atendenteOS
            
            const cadastro = document.createElement('td')
            cadastro.classList.add('text-truncate')
            cadastro.textContent = aberturaOS
        
            const entrega = document.createElement('td')
            entrega.classList.add('text-truncate')
            entrega.textContent = entregaOS
            
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
                document.getElementById('eosCpf').value = cpfOS
                document.getElementById('eosImei').value = imeiOS
                document.getElementById('eoTipoOs').value = capitalize(statusOS)
                document.getElementById('eosTipoServico').value = tipoOS
        
        
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
                window.location = api + `get_os_ind?os=${id}&&cr=${cr}`
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
            btnSemConserto.addEventListener('click', async function(){
                btnSemConserto.innerHTML = spinner
                const req = await request("alter_status_os", "POST", {'id':id, "status":"SEM CONSERTO"})
                const res = await req.json()
                if(req.ok){location.reload()}
                else{toast(res)}
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
            btnCancelar.addEventListener('click', async function(){
                btnCancelar.innerHTML = spinner
                const req = await request("alter_status_os", "POST", {'os':id, 'status':'CANCELADA'})
                const res = await req.json()
                if(req.ok){location.reload()}
                else{toast(res)}
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
            tr.appendChild(cadastro)
            tr.appendChild(entrega)
            tr.appendChild(act)
        
            document.getElementById('tbAbertas').appendChild(tr)  
        })
    }

    // Expiradas
    const res2 = await request('os?status=EXPIRADA')
    const js2 = await res2.json()
    if(res2.ok){
        js2.forEach(item =>{
                const id = item['id']
                const nomeOS = item['nome']
                const modeloOs = item['modelo']
                const valorOs = item['valor']
                const statusOS = item['status']
                const atendenteOS = item['atendente']
                const cadastroOS = new Date(item['abertura']).toLocaleDateString("pt-br",{day:'2-digit',month:'long',hour:'2-digit',minute:'2-digit'})
                const entregaOS = new Date(item['entrega']).toLocaleDateString("pt-br",{day:'2-digit',month:'long'})
                const marcaOs = item['marca']
                const corOs = item['cor']
                const imeiOs = item['imei']
                const tipoServico= item['tipo']
                const cpfOs = item['cpf']
            
                const tr = document.createElement('tr')
            
                const numOs = document.createElement('td')
                numOs.classList.add('text-truncate')
                numOs.textContent = id
            
                const cliente = document.createElement('td')
                cliente.classList.add('text-truncate')
                cliente.textContent = nomeOS
            
                const aparelho = document.createElement('td')
                aparelho.classList.add('text-truncate')
                aparelho.textContent = modeloOs
            
                const valor = document.createElement('td')
                valor.classList.add('text-truncate')
                valor.textContent = to_real(valorOs)
            
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
                atendente.textContent = atendenteOS
                
                const cadastro = document.createElement('td')
                cadastro.classList.add('text-truncate')
                cadastro.textContent = cadastroOS
            
                const entrega = document.createElement('td')
                entrega.classList.add('text-truncate')
                entrega.textContent = entregaOS
                
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
                    window.location = api + `get_os_ind?os=${id}&&cr=${cr}`
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
                btnSemConserto.addEventListener('click', async function(){
                    btnSemConserto.innerHTML = spinner
                    const req = await request("alter_status_os", "POST", {'id':id, "status":"SEM CONSERTO"})
                    const res = await req.json()
                    if(req.ok){location.reload()}
                    else{toast(res)}
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
                btnCancelar.addEventListener('click', async function(){
                    btnCancelar.innerHTML = spinner
                    const req = await request("alter_status_os", "POST", {'id':id, 'status':"CANCELADA"})
                    const res = await req.json()
                    if(req.ok){location.reload()}
                    else{toast(res)}
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
                tr.appendChild(cadastro)
                tr.appendChild(entrega)
                tr.appendChild(act)
            
                document.getElementById('tbExp').appendChild(tr) 
        })
    }
}

async function getAllOs(){
    const res = await request('os')
    const js = await res.json()

    if(res.ok){
        js.forEach(item=>{
            const id = item['id']
            const nomeOS = item['nome']
            const modeloOs = item['modelo']
            const valorOs = item['valor']
        
            const atendenteOS = item['atendente']
            const marcaOs = item['marca']
            const corOs = item['cor']
            const statusOS = item['status']
            const aberturaOS = new Date(item['abertura']).toLocaleDateString("pt-br")
            const entregaOS = new Date(item['entrega']).toLocaleDateString("pt-br")
            const tr = document.createElement('tr')

            const numOs = document.createElement('td')
            numOs.classList.add('text-truncate')
            numOs.textContent = id
    
            const cliente = document.createElement('td')
            cliente.classList.add('text-truncate')
            cliente.textContent = nomeOS
    
            const aparelho = document.createElement('td')
            aparelho.classList.add('text-truncate')
            aparelho.textContent = modeloOs
    
            const valor = document.createElement('td')
            valor.classList.add('text-truncate')
            valor.textContent = to_real(valorOs)
    
            const st = document.createElement('td')
            st.classList.add('text-truncate')
            const badge = document.createElement('p')
            badge.classList.add('badge')
            badge.classList.add('rounded-pill')
    
            // Cores dos status!
            if(statusOS === 'SEM CONSERTO'){badge.style.background = '#8338ec'}
            else if(statusOS === 'ENTREGUE'){badge.classList.add('text-bg-success')}
            else if(statusOS === 'FINALIZADA'){badge.style.background = '#fb8500'}
            else if(statusOS === 'CANCELADA'){badge.classList.add('text-bg-danger')}
            else if(statusOS === 'ABERTA'){badge.style.background = '#023047'}
            else if(statusOS === 'ORÇAMENTO'){badge.style.background = '#9c6644'}
    
            badge.textContent = capitalize(statusOS)
            st.appendChild(badge)
    
            const atendente = document.createElement('td')
            atendente.classList.add('text-truncate')
            atendente.textContent = atendenteOS
    
            const cadastro = document.createElement('td')
            cadastro.classList.add('text-truncate')
            cadastro.textContent = aberturaOS
    
            const entrega = document.createElement('td')
            entrega.classList.add('text-truncate')
            entrega.textContent = entregaOS
            
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
            btnCancelar.addEventListener('click', async function(){
                const req = await request("alter_status_os", 'POST', {'id':idOs, 'status':'CANCELADA'})
                const res = await req.json()
                if(req.ok){location.reload()}
                else{toast(res)}
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
                window.location = api + `/manager/api/v1/get_os_ind/?os=${id}&&cr=${cr}`
            })
    
            if(statusOS == 'CANCELADA'){
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
            tr.appendChild(cadastro)
            tr.appendChild(entrega)
            tr.appendChild(act)
    
            document.getElementById('tbAll').appendChild(tr)  
        })
    }
    
}

async function getMarcasOs(){
    const res2 = await request('marcas')
    const js2 = await res2.json()
    if(res2.ok){
        js2.forEach(item => {
            const sl = document.createElement('option')
            sl.textContent = item['marca']
            document.getElementById('noMarca').appendChild(sl)
    
            const sl2 = document.createElement('option')
            sl2.textContent = item['marca']
            document.getElementById('eosMarca').appendChild(sl2)
        })
    }
}

function abrirOS(t){
    var id = parseInt(document.getElementById("CPF").value)
    var telefone = document.getElementById("Telefone").value
    var endereco = document.getElementById('endereco').value
    var imei = document.getElementById('imei').value
    var modelo = document.getElementById('modelo').value
    var cor = document.getElementById('cor').value
    var marca = document.getElementById('noMarca').value
    var ligar = document.getElementById('ligar').checked
    var tipo = document.getElementById('tipoOS').value
    var obs = document.getElementById('obs').value
    var relato = document.getElementById('relato').value
    var retirada = document.getElementById('retirada').value
    var valor = parseFloat(document.getElementById('valor').value)
    var matricula = document.getElementById('matricula').value
    var statusOS = document.getElementById('noTipoOs').value 
    var form = new FormData()
    
    form.append('id', id)
    form.append('telefone', telefone)
    form.append('endereco', endereco)
    form.append('imei', imei)
    form.append('modelo', modelo)
    form.append('cor', cor)
    form.append('marca', marca)
    form.append('status', statusM)
    form.append('tipo', tipo)
    form.append('ligar', ligar)
    form.append('obs', obs)
    form.append('relato', relato)
    form.append('retirada', retirada)
    form.append('valor', valor)
    form.append('matricula', matricula)
    form.append('statusOS', statusOS)

    if(document.getElementById("Telefone").value){
        if(document.getElementById("modelo").value){
            if(document.getElementById("cor").value){
                if(document.getElementById("noMarca").value){
                        if(document.getElementById("valor").value){
                            if(document.getElementById("matricula").value){
                                t.innerHTML = spinner
                                sendForm('/manager/api/v1/abrir_os/', form)
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
    }else{alert('Telefone não deve estar vazio!')}
}

async function entregarOs(t){
    t.innerHTML = spinner
    var idOs = document.getElementById('idOsEntrega').value
    var custo = document.getElementById('osCusto').value
    var peca = document.getElementById('osPeca').value
    var pag = document.getElementById('osPag').value
    
    dd = {
        'os': idOs,
        'custo': custo,
        'peca': peca,
        'pagamento': pag,
        'status': 'ENTREGUE',
    }

    const req = await request("alter_status_os", "POST", dd)
    const res = req.json()
    if(req.ok){location.reload(); toast(res)}
    else{toast(res)}
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
    if(cont_status < 21){
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
            cont_status -= 1
            document.getElementById('cont_status').textContent = `${cont_status}/21`
        })

        li.appendChild(s)
        li.appendChild(btnExcluir)
        ul.appendChild(li)
        statusM.push(tp)
        cont_status += 1
        document.getElementById('cont_status').textContent = `${cont_status}/21`
    }else{
        alert('Máximo de ' + cont_status + 'atingido!')
    }
}

async function editarOs(t){
    var id = document.getElementById('eosId').value
    var cpf = document.getElementById('eosCpf').value
    var modelo = document.getElementById('eosModelo').value
    var cor = document.getElementById('eosCor').value
    var marca = document.getElementById('eosMarca').value
    var imei = document.getElementById('eosImei').value
    var valor = document.getElementById('eosValor').value
    var tipoOs = document.getElementById('eoTipoOs').value
    var servico = document.getElementById('eosTipoServico').value
    var form = {
        'id': id,
        'cpf': cpf,
        'cor': cor,
        'marca': marca,
        'modelo': modelo,
        'imei': imei,
        'valor': valor,
        'statusOS': tipoOs,
        'servico': servico
    }

    if(modelo && marca && cor && valor){
        t.innerHTML = spinner
        const req = await request('os', 'PATCH', form)
        if(req.ok){location.reload()}
        else{toast(await req.json())}
    }else{alert('Preencha todos os dados!')}

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
    const res = await request('/manager/api/v1/get_prods/')
    const js = await res.json()
    
    for(var x = 0; x < js.length; x++){
        const tr = document.createElement('tr')
        const idProd = js[x][0]
        const nomeProd = js[x][1]
        const custoProd = js[x][2]
        const valorProd = js[x][3]
        const esMinProd = js[x][4]
        const quantProd = js[x][5]
        const lucro = js[x][6]
        const imgProd2 = js[x][7]
        const fornProd = js[x][8]
        const eanProd = js[x][9]
        const descProd = js[x][10]
        var porcentLucro =  (lucro/custoProd)*100

        const id = document.createElement('td')
        id.textContent = idProd
        id.classList.add('text-truncate')
        
        const nome = document.createElement('td')
        nome.classList.add('text-truncate')
        nome.textContent = nomeProd

        const custo = document.createElement('td')
        custo.textContent = 'R$ ' + custoProd
        custo.classList.add('text-truncate')
        
        const valor = document.createElement('td')
        valor.textContent = 'R$ ' + valorProd
        valor.classList.add('text-truncate')

        const alerta = document.createElement('td')
        alerta.textContent = js[x][4]

        const quantidade = document.createElement('td')
        quantidade.textContent = quantProd

        const lucrol = document.createElement('td')
        const spn = document.createElement('span')

        spn.classList.add('badge')
        spn.classList.add('rounded-pill')
        if(porcentLucro >= 75){
            spn.classList.add('text-bg-success')
        }else if(porcentLucro >= 50){
            spn.classList.add('bg-blue')
        }else if(porcentLucro >= 25){
            spn.classList.add('bg-orange')
        }else if(porcentLucro < 25){
            spn.classList.add('text-bg-danger')
        }
        spn.textContent = porcentLucro.toFixed(2) + '%'
        lucrol.appendChild(spn)

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
        btnEditar.addEventListener('click', function(){
            document.getElementById('edIdProd').value = idProd
            document.getElementById('edEan').value = eanProd
            document.getElementById('edNome').value = nomeProd
            document.getElementById('edCusto').value = custoProd
            document.getElementById('edValor').value = valorProd
            document.getElementById('edEsMin').value = esMinProd
            document.getElementById('edQuant').value = quantProd
            document.getElementById('edForn').value = fornProd
            document.getElementById('edDesc').value = descProd
            document.getElementById('edLucro').value = lucro
            document.getElementById('edImgProd').src = api + '/img/' + imgProd2


            const toast = new bootstrap.Modal(document.getElementById('editProdModal'), {'show':true})
            toast.show()
        })

        const btnRemov = document.createElement('button')
        btnRemov.classList.add('btn')
        btnRemov.classList.add('btn-sm')
        btnRemov.classList.add('btn-danger')
        var icon = document.createElement('i')
        icon.classList.add('bi')
        icon.classList.add('bi-trash-fill')
        btnRemov.appendChild(icon)
        btnRemov.addEventListener('click', function(){
            var conf = confirm('Tem certeza que deseja excluir?')
            if (conf){
                btnRemov.innerHTML = spinner
                request('/manager/api/v1/excluir_prod/?id=' + idProd)
                location.reload()
            }
        })

        const btnEntrada = document.createElement('button')
        btnEntrada.classList.add('btn')
        btnEntrada.classList.add('btn-sm')
        btnEntrada.classList.add('btn-success')
        var icon = document.createElement('i')
        icon.classList.add('bi')
        icon.classList.add('bi-plus-circle-fill')
        btnEntrada.appendChild(icon)
        btnEntrada.addEventListener('click', function(){
            document.getElementById('prodIdEntrada').value = idProd
            document.getElementById('prodNome').textContent = nomeProd
            document.getElementById('prodQuant').textContent = `QUANTIDADE ATUAL: ${quantProd}`
            document.getElementById('prodCusto').textContent = `CUSTO ATUAL: R$${custoProd}`
            document.getElementById('prodValor').textContent = `VALOR ATUAL: R$${valorProd}`

            const toast = new bootstrap.Modal(document.getElementById('addProdModal'), {'show':true})
            toast.show()
        })

        btngp.appendChild(btnEditar)
        btngp.appendChild(btnRemov)
        btngp.appendChild(btnEntrada)

        tr.appendChild(id)
        tr.appendChild(nome)
        tr.appendChild(custo)
        tr.appendChild(valor)
        tr.appendChild(alerta)
        tr.appendChild(quantidade)
        tr.appendChild(lucrol)
        tr.appendChild(btns)

        document.getElementById('tbody').appendChild(tr)
    }
}

async function getFornecedores() {
    const res = await request('/manager/api/v1/get_fornecedores/')
    const js = await res.json()

    for(item in js){
        const opt = document.createElement('option')
        opt.textContent = js[item][1]
        document.getElementById('npForn').appendChild(opt)

        const opt2 = document.createElement('option')
        opt2.textContent = js[item][1]
        document.getElementById('edForn').appendChild(opt2)
        
        const id = js[item][0]
        const nome = js[item][1]

        const li = document.createElement('li')
        const btnExcluiForn = document.createElement('button')
        const spn = document.createElement('spn')

        spn.textContent = nome
        li.classList.add('list-group-item')
        li.classList.add('d-flex')
        li.classList.add('justify-content-between')
        li.classList.add()
        btnExcluiForn.classList.add('btn')
        btnExcluiForn.classList.add('btn-danger')
        btnExcluiForn.classList.add('btn-sm')
        btnExcluiForn.innerHTML = '<i class="bi bi-trash-fill"></i>'
        btnExcluiForn.addEventListener('click', function(){
            const conf = confirm('Deseja realmente exluir?')
            if(conf){
                request('/manager/api/v1/excluir_fornecedor/?id=' + id, 'POST')
                .then(res=>{
                    res.json().then(res=>{
                        alert(res)
                        location.reload()
                    })
                })
            }
        })

        li.appendChild(spn)
        li.appendChild(btnExcluiForn)

        document.getElementById('listForn').appendChild(li)

    }
}

function criar_prod(t){
    var ean = document.getElementById('npEan').value
    var nome = document.getElementById('npNome').value
    var custo = document.getElementById('npCusto').value
    var valor = document.getElementById('npValor').value
    var esmin = document.getElementById('npEsMin').value
    var quant = document.getElementById('npQuant').value
    var desc = document.getElementById('npDesc').value
    var lucro = document.getElementById('npLucro').value
    var forn = document.getElementById('npForn').value
    var img = 'blank.png'

    if(nome){
        if(custo){
            if(valor){
                if(quant){
                    if(desc){
                        if(lucro){
                            if(forn){
                                t.innerHTML = spinner

                                var form = new FormData()
                                form.append('ean', ean)
                                form.append('nome', nome.toUpperCase())
                                form.append('custo', custo)
                                form.append('valor', valor)
                                form.append('esmin', esmin)
                                form.append('quant', quant)
                                form.append('desc', desc)
                                form.append('lucro', lucro)
                                form.append('forn', forn)
                                form.append('img', img)

                                sendForm('/manager/api/v1/criar_produto/', form)
                                .then(res=>{
                                    res.json().then(js=>{
                                        alert(js)
                                        location.reload()
                                    })
                                })
                            }else{alert('Qual o fornecedor ?')}
                        }else{alert('Lucro nao informado ou calculado!')}
                    }else{alert('Margem de desconto necessário!')}
                }else{alert('Quantidade não especificada!')}
            }else{alert('Valor obrigatório!')}
        }else{alert('Custo obrigatório!')}
    }else{alert('Nome obrigatório!!')}
}

function calc_lucro(){
    var valor = document.getElementById('npValor').value
    var custo = document.getElementById('npCusto').value
    if(valor && custo){
        var lucro = parseFloat(valor) - parseFloat(custo) 
        document.getElementById('npLucro').value = lucro.toFixed(2)
    }else{
        document.getElementById('npLucro').value = 0
    }
}

function ed_calc_lucro(){
    var valor = document.getElementById('edValor').value
    var custo = document.getElementById('edCusto').value
    if(valor && custo){
        var lucro = parseFloat(valor) - parseFloat(custo) 
        document.getElementById('edLucro').value = lucro.toFixed(2)
    }else{
        document.getElementById('edLucro').value = 0
    }
}

function cadastrar_forn(t){
    const nome = document.getElementById('nomeForn').value
    const tel = document.getElementById('telForn').value
    if(nome && tel){
        t.innerHTML = spinner
        request('/manager/api/v1/cadastrar_fornecedor/', 'POST', `{"nome":"${nome.toUpperCase()}", "telefone":"${tel}"}`)
        .then(res=>{res.json().then(js=>{
            alert(js)
            location.reload()
        })})
    }
}

function entrada_produtos(t){
    var id = document.getElementById('prodIdEntrada').value
    var quant = document.getElementById('newQuant').value
    var custo = document.getElementById('newCusto').value
    var valor = document.getElementById('newValor').value

    if(quant){
        t.innerHTML = spinner
        var dados = `{
            "id": "${id}",
            "quant": "${quant}",
            "custo": "${custo}",
            "valor": "${valor}"
        }`

        request('/manager/api/v1/entrada_produtos/', 'POST', dados)
        .then(res=>{res.json().then(js=>{
            alert(js)
            location.reload()
        })})
    }
}

function editar_produto(t){
    var id = document.getElementById('edIdProd').value
    var ean = document.getElementById('edEan').value
    var nome = document.getElementById('edNome').value
    var custo = document.getElementById('edCusto').value
    var valor = document.getElementById('edValor').value
    var esmin = document.getElementById('edEsMin').value
    var quant = document.getElementById('edQuant').value
    var forn = document.getElementById('edForn').value
    var desc = document.getElementById('edDesc').value
    var lucro = document.getElementById('edLucro').value

    if(nome){
        if(custo){
            if(valor){
                if(quant){
                    if(desc){
                        if(lucro){
                            if(forn){
                                t.innerHTML = spinner

                                var form = new FormData()
                                form.append('id', id)
                                form.append('ean', ean)
                                form.append('nome', nome.toUpperCase())
                                form.append('custo', custo)
                                form.append('valor', valor)
                                form.append('esmin', esmin)
                                form.append('quant', quant)
                                form.append('desc', desc)
                                form.append('lucro', lucro)
                                form.append('forn', forn)

                                sendForm('/manager/api/v1/editar_produto/', form)
                                .then(res=>{
                                    res.json().then(js=>{
                                        alert(js)
                                        location.reload()
                                    })
                                })
                            }else{alert('Qual o fornecedor ?')}
                        }else{alert('Lucro nao informado ou calculado!')}
                    }else{alert('Margem de desconto necessário!')}
                }else{alert('Quantidade não especificada!')}
            }else{alert('Valor obrigatório!')}
        }else{alert('Custo obrigatório!')}
    }else{alert('Nome obrigatório!!')}
}

// =============== Relatorios
async function get_infos(){
    const res = await request('/manager/api/v1/get_infos_dash/?filter='+filterRes)
    const js = await res.json()

    if(js){
        var green = '#344e41'
        var red = '#a3b18a'
        
        document.getElementById('total_vendas').textContent = `R$ ${js['TOTAL'].toFixed(2)}`
        document.getElementById('vendas_prod').textContent = `R$ ${js['PRODUTOS'].toFixed(2)}`
        document.getElementById('vendas_os').textContent = `R$ ${js['OS'].toFixed(2)}`

        document.getElementById('vendas_bruto').textContent = `R$ ${js['BRUTO'].toFixed(2)}`
        document.getElementById('vendas_liq').textContent = `R$ ${js['LIQUIDO'].toFixed(2)}`
        document.getElementById('vendas_med').textContent = `${js['MEDIA_VENDAS'].toFixed(2)}`
        
        document.getElementById('tc_med').textContent = `R$ ${js['TICKET_MEDIO'].toFixed(2)}`
        document.getElementById('tc_cp').textContent = `${js['TICKET_PROD'].toFixed(2)} Un.`
        document.getElementById('ct_prod').textContent = `R$ ${js['CUSTO_PROD']}`

        js['VD_AT'].forEach(res=>{
            document.getElementById('top3func').innerHTML = ''
            const li = document.createElement('li')
            li.classList.add('list-group-item')
            li.textContent = res[0] + ' - ' + res[1]
            document.getElementById('top3func').appendChild(li)
            
        })
        js['VD_PROD'].forEach(res=>{
            document.getElementById('top3prod').innerHTML = ''
            const li = document.createElement('li')
            li.classList.add('list-group-item')
            li.textContent = res[0] + ' - ' + res[1]
            document.getElementById('top3prod').appendChild(li)

        })
        js['VD_MARCAS'].forEach(res=>{
            document.getElementById('top3marcas').innerHTML = ''
            const li = document.createElement('li')
            li.classList.add('list-group-item')
            li.textContent = res[0] + ' - ' + res[1]
            document.getElementById('top3marcas').appendChild(li)

        })


        var dashVendas = document.createElement('canvas')
        new Chart(dashVendas, {
            type: 'line',
            data: {
            labels: js['PROD_MES']['dia'],
            
            datasets: [{
                data: js['PROD_MES']['cont'],
                label: 'Total',
                fill: {
                    target: 'origin',
                },
                borderWidth: 1,
                borderColor: red,
            },{
                data: js['PROD_MES']['valor'],
                label: 'Valor R$',
                fill: {
                    target: 'start',
                },
                borderWidth: 2,
                borderColor: green,
            }]
            },
            options: {
            indexAxis: 'x', 
            responsive: true,
            scales: {
                x: {
                    beginAtZero: false
                }
            },
            plugins: {
                title: {
                  display: true,
                  text: 'PRODUTOS POR DIA'
                }
            },
            }
        })
        var dv = document.getElementById('divDashVendas')
        dv.innerHTML = ''
        dv.style.height = '300px'
        dv.appendChild(dashVendas)

        var osMes = js['OS_MES']
        var dashOs = document.createElement('canvas')
        new Chart(dashOs, {
            type: 'line',
            data: {
            labels: osMes['dia'],
            
            datasets: [{
                data: osMes['cont'],
                label: 'Total',
                fill: {
                    target: 'origin',
                },
                borderWidth: 1,
                borderColor: red,
            },{
                data: osMes['valor'],
                label: 'Valor R$',
                fill: {
                    target: 'start',
                },
                borderWidth: 2,
                borderColor: green,
            }]
            },
            options: {
            indexAxis: 'x', 
            responsive: true,
            scales: {
                x: {
                    beginAtZero: false
                }
            },
            plugins: {
                title: {
                  display: true,
                  text: 'ORDENS POR DIA'
                }
            },
            }
        })
        var dv2 = document.getElementById('divDashOs')
        dv2.innerHTML = ''
        dv2.style.height = '300px'
        dv2.appendChild(dashOs)

        var pag = js['VENDA_PAGAMENTO']
        var pagDash = document.createElement('canvas')
        new Chart(pagDash, {
            type: 'doughnut',
            data: {
            labels: pag['tipo'],
            
            datasets: [{
                data: pag['valor'],
                label: 'Total R$',
            }]
            },options: {
                indexAxis: 'x', 
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                      display: true,
                      text: 'VENDAS POR TIPO'
                    }
                },
                }
        })
        var dv3 = document.getElementById('divDashVendasPorTipo')
        dv3.style.height = '300px'
        dv3.innerHTML = ''
        dv3.appendChild(pagDash)
    }
}


function trocarFiltroRes(t){
    var btnAntigo = document.getElementById(`btn-${filterRes}`)
    btnAntigo.classList.remove('btn-success')
    btnAntigo.classList.add('btn-outline-success')
    
    t.classList.add('btn-success')
    t.classList.remove('btn-outline-success')
    sessionStorage.setItem('filterRes', t.value)
    filterRes = sessionStorage.getItem('filterRes')
    get_infos()
}

// =============== Configurações
async function get_config() {
    const res = await request('/manager/api/v1/get_config/')
    const js = await res.json()
    if(js){
        var esc = document.getElementById('slEscala')

        document.getElementById('slFuso').value = js['fuso']
        document.getElementById('ckEstoque').checked = js['ct_es']
        document.getElementById('ckPeca').checked = js['pecas']
        document.getElementById('config_logo').classList.remove('placeholder')
        document.getElementById('config_logo').src = api + '/img/' + js['logo']
        document.getElementById('inputCR').value = cr
        for(var x = 1; x < 51; x++){
            const opt = document.createElement('option')
            opt.textContent = x
            esc.appendChild(opt)
        }
        esc.value = js['escala']

        for(item in js['funcs']){
            const nome = js['funcs'][item][0]
            const perm = js['funcs'][item][1]
            const mat = js['funcs'][item][2]
            const li = document.createElement('li')
            const sp = document.createElement('span') 
            const btnRemove = document.createElement('button')
            const btnPmvAdmin = document.createElement('button')
            const btnGp = document.createElement('div')

            li.classList.add('list-group-item')
            li.classList.add('d-flex')
            li.classList.add('justify-content-between')

            btnRemove.classList.add('btn')
            btnRemove.classList.add('btn-danger')
            btnRemove.classList.add('btn-sm')
            btnRemove.innerHTML = '<i class="bi bi-trash-fill"></i>'
            btnRemove.addEventListener('click', function(){
                var conf = confirm(`Deseja realmente excluir ${capitalize(nome)}?`)
                if(conf){
                    request('/manager/api/v1/remover_user/?mat='+mat, 'POST')
                    .then(res=>{
                        if(res.ok){
                            location.reload()
                        }
                    })
                }

            })

            btnPmvAdmin.classList.add('btn')
            btnPmvAdmin.classList.add('btn-light')
            btnPmvAdmin.classList.add('btn-sm')
            btnPmvAdmin.innerHTML = '<i class="bi bi-shield-fill-check"></i>'
            btnPmvAdmin.addEventListener('click', function(){
                var conf = confirm(`Deseja tornar ${capitalize(nome)} um ADMIN ?`)
                if (conf){
                    request('/manager/api/v1/alterar_permissao/?mat='+mat, 'POST')
                    .then(res=>{
                        if(res.ok){
                            location.reload()
                        }
                    })
                }
            })

            btnGp.classList.add('btn-group')
            
            sp.textContent = nome
            
            li.appendChild(sp)
            
            if(perm === 'ADMIN'){
                btnPmvAdmin.disabled = true
            }
            btnGp.appendChild(btnPmvAdmin)
            btnGp.appendChild(btnRemove)

            li.appendChild(btnGp)

            document.getElementById('listFuncs').appendChild(li)
        }

    }
}

function estoque_negativo(t){

}

function trocar_fuso(t){
    var dd = `{
        "fuso":${t.value}
    }`
    request('/manager/api/v1/alterar_fuso/', 'POST', dd)
}

function alterar_estoque(t){
    var dd = `{
        "valor":${t.checked}
    }`
    request('/manager/api/v1/alterar_estoque/', 'POST', dd)
}

function alterar_pecas(t){
    var dd = `{
        "valor":${t.checked}
    }`
    request('/manager/api/v1/alterar_pecas/', 'POST', dd)
}

function trocar_escala(t){
    var dd = `{
        "valor":${t.value}
    }`
    request('/manager/api/v1/alterar_escala/', 'POST', dd)

}

function newFunc(t){
    var name = document.getElementById('nomeFunc').value

    if (name){
        t.innerHTML = spinner
        request('/manager/api/v1/cadastrar_funcionario/?nome='+name, 'POST')
        .then(res=>{
            res.json().then(js=>{
                alert('Sua nova matricula é ' + js)
                location.reload()
            })
        })
    }
}

// Peças
async function get_pecas() {
    fetch(api + '/manager/api/v1/get_pecas/?cr=' + cr)
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

                // const alerta = document.createElement('td')
                // alerta.textContent = res[x][4]

                const quantidade = document.createElement('td')
                quantidade.textContent = res[x][4]

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

                btngp.appendChild(btnEditar)
                btngp.appendChild(btnRemov)

                tr.appendChild(id)
                tr.appendChild(nome)
                tr.appendChild(custo)
                tr.appendChild(valor)
                // tr.appendChild(alerta)ssss
                tr.appendChild(quantidade)
                tr.appendChild(btns)

                document.getElementById('tbody').appendChild(tr)
            }
        })
    })
}


// JQuery ==================================================

$(document).ready(function(){
    $("#busca").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#table tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function(){
    $("#busca").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#table tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});


 $(document).ready(function(){
    $("#buscarAbertas").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tbAbertas tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function(){
    $("#buscaAll").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tbAll tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function(){
    $("#buscaExp").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tbExp tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function(){
    $("#searchClient").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#listClient li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function(){
    $("#busca").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#table tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
    
$(document).ready(function(){
    $("#busca").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#table tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});
    
$(document).ready(function(){
    $("#buscaitem").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#listProd tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});


// INPUTS MASKS
$(document).ready(function(){
    $(".tel-mask").inputmask("(99) 99999-9999");
});

$(document).ready(function(){
    $(".money-mask").inputmask("currency");
});