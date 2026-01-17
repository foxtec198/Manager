var div = document.createElement('div')
var cart = new Object
var statusM = []
var cont_status = 0
var spinner = '<span id="spin_ldg" class="spinner-border spinner-border-sm text-light" role="status"></span>'
green = '#5E8B60'
red = '#c1121f'

md_cart = []
numItem = 0

sessionStorage.setItem('filterRes', 'hoje')
var filterRes = sessionStorage.getItem('filterRes')
let timeout

server = "https://api.hubbix.com.br"
// server = "http://localhost:9560"

var api = server + '/manager/v1/'

cr = sessionStorage.getItem('cr')
gc = sessionStorage.getItem('gc')
config_pecas = sessionStorage.getItem('pecas') == "true"
config_estoque = sessionStorage.getItem('estoque') == "true"
perm = sessionStorage.getItem("perm")
const meses = { 1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro" };
const mesesAbreviados = { 1: "Jan", 2: "Fev", 3: "Mar", 4: "Abr", 5: "Mai", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Set", 10: "Out", 11: "Nov", 12: "Dez" };
const icon_lixeira = "<i class='bi bi-trash-fill'></i>"

if (window.location.pathname !== "/index.html") {
    if (!cr) { window.location = '/index.html' }
}

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

function real(str) { // Converte STR/INT em Moeda R$
    str = parseFloat(str)
    return str.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

function is_decoration(state = true) {
    const adorno_elem = document.getElementById("adorno");
    if (state && adorno) { datas_comemorativas('Feliz Natal 🌲🎅🏼', 'Feliz Ano Novo 🍾🥂'); }
    else { adorno.style.display = "none" };
}

function create_modal(id, title, body, center = 'modal-dialog-centered') {
    container = document.createElement('div')
    const modalHtml = `
        <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog ${center}">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                </div>
                <div class="modal-body">
                    ${body}
                </div>
            </div>
            </div>
        </div>
    `;
    container.innerHTML = modalHtml
    document.body.appendChild(container)
    return new bootstrap.Modal(document.getElementById(id), { 'show': true, 'backdrop': 'static' })
}

function validar_senha(senha) {
    const temSimbolo = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    const temNumero = /\d/.test(senha);
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);

    return temSimbolo && temNumero && temMaiuscula && temMinuscula;
}

function datas_comemorativas(msg, data) {
    for (let i = 0; i < 100; i++) {
        var sp = document.createElement('span')
        sp.classList.add('badge', 'rounded-pill', 'px-4')
        sp.style.background = '#ffc8dd'
        sp.style.color = '#333'
        sp.style.fontSize = '14px'
        sp.textContent = data

        var sp2 = document.createElement('span')
        sp2.classList.add('badge', 'rounded-pill', 'px-4')
        sp2.style.background = '#edede9'
        sp2.style.fontSize = '14px'
        sp2.style.color = '#333'
        sp2.textContent = msg

        document.getElementById('mq').appendChild(sp2)
        document.getElementById('mq').appendChild(sp)
    }
}

function imgPreview(file, prev) {
    const fileInput = document.getElementById(file)
    const preview = document.getElementById(prev)

    fileInput.addEventListener('change', function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                preview.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }
    });

}

function limpar_pontuacao(str) {
    somenteNumeros = str.replace(/,/g, "")
    return somenteNumeros
}

function somente_numeros(str) {
    return str.replace(/\D/g, "")
}

function limpar_float(str) {
    return str.replace(/[,]/g, "");
}

function toast(msg, type = null) {
    tst = document.getElementById("snackbar");
    tst.textContent = msg
    tst.className = "show";
    if (type === 'erro') {
        tst.style.background = '#c1121f'
    } else if (type = 'info') {
        tst.style.background = '#333'
    } else {
        tst.style.background = '#3a5a40'
    }
    setTimeout(function () { tst.className = tst.className.replace("show", ""); }, 3000);
}

function request(url, method = 'GET', json) {
    if (!json) {
        var options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'cr': `${cr}`,
                'gc': `${gc}`
            }
        };
    } else {
        json = JSON.stringify(json)
        var options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'cr': `${cr}`,
                'gc': `${gc}`
            },
            body: json
        };
    }
    return fetch(api + url, options)
}

function sendForm(url, form, method = "POST") {
    if (!form) {
        var options = {
            method: method,
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'cr': `${cr}`,
                'gc': `${gc}`
            }
        };
    } else {
        var options = {
            method: method,
            headers: {
                'cr': `${cr}`,
                'gc': `${gc}`
            },
            body: form
        };
    }
    return fetch(api + url, options)
}

function sendImage(url, img) {
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

function ldg() {
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

function closeLdg() {
    div.hidden = 'none'
}

async function conferMatricula(mat) {
    if (mat.value) {
        mat.disabled = true
        req = await request(`mat?mat=${mat.value}`)
        if (!req.ok) {
            mat.value = ''
            mat.disabled = false
        }
    }
}

function capitalize(string) {
    string = string.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// Troca e memoriza a screen
function change_screen(screnn, t = null) {
    others = parent.document.querySelectorAll('.menu-item')
    others.forEach(element => {
        element.style.background = null
        element.style.color = '#fff';
    });
    if (t) {
        t.style.background = "rgba(41, 201, 108, 0.08)";
        t.style.color = '#2ecc71';
        t.style.boxShadow = "inset 0 0 0 1px #2ecc71aa, 0 0 6px #2ecc7190;"
    }
    frame = parent.document.getElementById('frame_screen')
    sessionStorage.setItem('frame', `/manager/${screnn}.html`)
    frame.src = `/manager/${screnn}.html`
}

// Recupera a tela mesmo que atualize a pagina
function restore_screen() {
    frame = sessionStorage.getItem('frame')
    frameWidget = parent.document.getElementById('frame_screen')

    if (frame) {
        txt1 = frame.replace('/manager/', '')
        txt2 = txt1.replace('.html', '')
        frameWidget.src = frame
        const t = parent.document.querySelector(`.menu-${txt2}`)
        t.style.background = "rgba(41, 201, 108, 0.08)";
        t.style.color = '#2ecc71';
        t.style.boxShadow = "inset 0 0 0 1px #2ecc71aa, 0 0 6px #2ecc7190;"
    }
}

function inform(msg) {
    var d = document.getElementById('alertt')
    d.hidden = ''
    document.getElementById('alertt-msg').textContent = decodeURI(msg)
}

function to_real(valor) {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

function to_real_no_cents(valor) {
    return valor.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function to_CPF(cpf) {
    // Remove tudo que não for número
    const somenteNumeros = cpf.replace(/\D/g, "")

    //   if(somenteNumeros.length === 14){return to_CNPJ(cpf)}
    if (somenteNumeros.length < 11) { return false }

    // Aplica a máscara
    return somenteNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function to_CNPJ(cnpj) {
    // Remove tudo que não for número
    const somenteNumeros = cnpj.replace(/\D/g, "")

    // Aplica a máscara
    return somenteNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3\\$4-$5");
}

function to_tel(tel) {
    somenteNumeros = tel.replace(/\D/g, "")

    if (tel.length == 8) {
        somenteNumeros = somenteNumeros.replace(/(\d{4})(\d{4})/, "$1-$2")
    } else if (tel.length == 9) {
        somenteNumeros = somenteNumeros.replace(/(\d{5})(\d{4})/, "$1-$2")
    } else if (tel.length == 10) {
        somenteNumeros = somenteNumeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1)$2-$3")
    } else if (tel.length == 11) {
        somenteNumeros = somenteNumeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3")
    } else {
        somenteNumeros = false
    }

    return somenteNumeros
}

function liberar_button(btn) {
    if (btn.disabled) {
        btn.disabled = ''
    }
}

function confirmar_protecao(t) {
    senha = t.value
    const temSimbolo = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    const temNumero = /\d/.test(senha);
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const lblSt = document.getElementById('status-senha')

    if (temNumero && temMinuscula) {
        if (temMaiuscula) {
            if (temSimbolo) {
                lblSt.classList.remove('text-danger', 'text-warning')
                lblSt.classList.add('text-success')
                lblSt.textContent = "FORTE!"
                return true
            } else {
                lblSt.classList.remove('text-danger')
                lblSt.classList.add('text-warning')
                lblSt.textContent = "MÉDIA"
                return false
            }
        } else {
            lblSt.classList.remove('text-success', 'text-warning')
            lblSt.classList.add('text-danger')
            lblSt.textContent = "FRACA!"; return false
        }
    } else {
        lblSt.classList.remove('text-success', 'text-warning')
        lblSt.classList.add('text-danger')
        lblSt.textContent = "FRACA!"; return false
    }



}

function confirmar_senha(t) {
    lbl = document.getElementById('senhasNot')
    if (t.value !== document.getElementById('newFPwd').value) {
        t.style.color = red
        lbl.hidden = ''
        document.getElementById('btnCadFunc').disabled = true
    } else {
        t.style.color = '#fff'
        lbl.hidden = 'none'
        if (validar_senha(t.value)) {
            document.getElementById('btnCadFunc').disabled = false
        } else {
            document.getElementById('btnCadFunc').disabled = true
        }
    }
}

async function get_loja() {
    req = await request('get_loja')
    res = await req.json()
    if (req.ok) {
        var label = document.getElementById('nomeLoja')
        label.textContent = res['nome']
        label.classList.remove('placeholder')

        var img = document.getElementById('logoBase')
        if (res.logo == 'logo.png') { img.src = `${server}/img/${res['logo']}` }
        else { img.src = `${server}/img/manager/${res['logo']}` }
        img.classList.remove('placeholder')

    }
}

async function conferCpf(inp) {
    var cpf = await inp.value
    const res = await request("conferir_cpf", "POST", { 'cpf': cpf })
    const js = await res.json()
    return js
}

function confer_perm() {
    if (perm === 'USER') {
        blocks = [
            "relatorios",
            "config",
            "caixa"
        ]
        blocks.forEach(item => {
            document.querySelectorAll(`.menu-${item}`).forEach(el => {
                el.remove()
            })
        })
        change_screen("vendas")

    }

    if (config_pecas) {
        document.querySelectorAll('.menu-pecas').forEach(el => {
            el.hidden = ''
        })
    } else {
        document.querySelectorAll('.menu-pecas').forEach(el => {
            el.hidden = 'none'
        })
    }
}

// ===================================================================
// ===================================================================
// ===================================================================
// ===========================CALLBACKS =============================
// ===================================================================
// ===================================================================

// =============== Login

function logout() {
    sessionStorage.clear()
    document.location = '/'
}

async function login() {
    mat = document.getElementById("mat").value
    pwd = document.getElementById("pwd").value

    if (mat) {
        if (pwd) {
            ldg()
            const req = await fetch(api + `login?mat=${mat}&&pwd=${pwd}`, { method: 'POST' })
            const res = await req.json()
            if (req.ok) {
                sessionStorage.setItem('cr', res['cr'])
                sessionStorage.setItem('gc', res['gc'])
                sessionStorage.setItem('pecas', res['pecas'])
                sessionStorage.setItem('estoque', res['estoque'])
                sessionStorage.setItem('perm', res['perm'])

                document.location = '/manager/base.html'
            } else { closeLdg(); toast(res) }
        } else { toast('Senha vazia') }
    } else { toast("Matricula vazia") }

}

// =============== Caixa
async function calc() {
    const res = await request('fechamento')
    const js = await res.json()
    if (res.ok) {
        // alert(JSON.stringify(js))
        for (item in js) {
            try {
                document.getElementById(item.toLowerCase()).value += to_real(js[item])
            }
            catch { }
        }
    }
}

async function conferencia_de_caixa() {
    const js = await statusCaixa()
    if (js.status) {
        const status = document.getElementById('statusCaixa')

        status.classList.remove('placeholder')
        status.classList.add('text-bg-success')

        status.textContent = 'Caixa Aberto - ' + to_real(js.valor)
        btn = document.getElementById('btnAbrirCaixa')
        if (btn) { btn.disabled = true }
    } else {
        const status = document.getElementById('statusCaixa')

        status.classList.remove('placeholder')
        status.classList.add('text-bg-danger')

        status.textContent = `Caixa Fechado - R$ 0`
    }
}

async function get_despesas() {
    const req = await request('despesas')
    const res = await req.json()
    if (req.ok) {
        res.forEach(item => {
            const id = item['id']
            const motivo = item['motivo']
            const valor = item['valor']
            const data_alt = new Date(item['data']).toLocaleDateString('pt-br', { 'day': 'numeric', 'month': 'long', 'hour': '2-digit', 'minute': '2-digit' })

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
            btn.addEventListener('click', async function () {
                const req = await request("despesas", "DELETE", { 'id': id })
                const res = await req.json()
                if (req.ok) { location.reload() }
                else { toast(res) }
            })
            li.appendChild(btn)

            document.getElementById('saidasCaixa').appendChild(li)
        })
    }
}

async function statusCaixa() {
    const res = await request('caixa')
    const resJ = await res.json()

    return resJ
}

async function abrirCaixa(t) {
    var mat = document.getElementById('mattroco').value
    var troco = limpar_float(document.getElementById('troco').value)

    if (mat && troco) {
        t.innerHTML = spinner
        dados = { 'valor': troco, 'mat': mat }
        const req = await request("caixa", "POST", dados)
        const res = await req.json()
        if (req.ok) { location.reload() }
        else { toast(res) }
    }
}

async function fechar_caixa(t) {
    var mat = document.getElementById('fecharMat').value
    if (mat !== '') {
        t.innerHTML = spinner
        const req = await request('caixa', 'DELETE', { 'mat': mat })
        const res = await req.json()
        if (req.ok) { location.reload() }
        else { toast(res) }
    }
}

async function adicionar_despesa(t) {
    var mat = document.getElementById('retirarMat').value
    var motivo = document.getElementById('retirarMotivo').value
    var desc = document.getElementById('motivoIn').value
    var valor = limpar_float(document.getElementById('retirarV').value)

    if (mat && valor && motivo) {
        if (motivo === 'Despesa') { motivo = desc }
        t.innerHTML = spinner
        dd = { 'mat': mat, 'valor': valor, 'motivo': motivo }
        req = await request("despesas", 'POST', dd)
        res = await req.json()
        if (req.ok) { location.reload() }
        else { toast(res); t.textContent = 'Adicionar' }
    } else (toast("Preencha todos os dados!"))
}

async function aplicarVlr(t) {
    var mat = document.getElementById('aplicarMat').value
    var valor = limpar_float(document.getElementById('aplicarValor').value)

    if (mat && valor) {
        t.innerHTML = spinner
        req = await request("caixa", 'PATCH', { 'valor': valor, 'mat': mat })
        res = await req.json()
        if (req.ok) { location.reload() }
        else { toast(res) }
    }
}

function motivoF(sl) {
    inn = document.getElementById('motivoDespesa')

    if (sl.value === 'Despesa') { inn.hidden = '' }
    else { inn.hidden = 'none' }
}

async function conferTroco(mat) {
    const btn = document.getElementById('btnAbrirCaixa')
    const res = await conferMatricula(mat)
    const caixa = await statusCaixa()
    if (!caixa.status) {
        if (mat.value) {
            btn.innerHTML = spinner
            const req = await request(`mat?mat=${mat.value}`)
            const res = await req.json()
            if (req.ok) {
                const req = await request('valor_troco')
                const res = await req.json()
                document.getElementById('troco').value = res
                btn.textContent = 'Abrir'
                btn.disabled = false
            }
        } else { document.getElementById('troco').value = '' }
    } else { toast("Caixa já aberto"); mat.value = ''; mat.disabled = '' }

}

// =============== Vendas
async function getSaidas() {
    const req = await request('saidas')
    const res = await req.json()

    // document.getElementById('divTableVendas').innerHTML = `
    //     <table class="table table-hover" id="tablevendas">
    //         <thead>
    //             <td>Nome</td>
    //             <td>Tipo</td>
    //             <td>Valor</td>
    //             <td>Cliente</td>
    //             <td>Pagamento</td>
    //             <td>Atendente</td>
    //             <td>Data</td>
    //             <td>Ação</td>
    //         </thead>
    //         <tbody id="tbVendas">
    //         </tbody>
    //     </table>
    // `

    // if(req.ok){
    //     res.forEach(item => {
    //         const tr = document.createElement('tr')

    //         const nome = document.createElement('td')
    //         nome.classList.add('text-truncate')
    //         nome.textContent = item['nome']

    //         var tipov = item['tipo']
    //         const tipoTd = document.createElement('td')
    //         tipoTd.classList.add('text-truncate')

    //         const tipo = document.createElement('span')
    //         tipo.classList.add('w-100')

    //         if(tipov == 'PRODUTOS'){
    //             tipo.classList.add("badge", "text-bg-success")
    //         }else{
    //             tipo.classList.add("badge", "text-bg-primary")
    //         }
    //         tipo.textContent = tipov
    //         tipoTd.appendChild(tipo)

    //         const valor = document.createElement('td')
    //         valor.textContent = to_real(item['valor'])

    //         const cliente = document.createElement('td')
    //         cliente.classList.add('text-truncate')
    //         cliente.textContent = item['cliente']

    //         const pagamento = document.createElement('td')
    //         pagamento.classList.add('text-truncate')
    //         if(item['pagamento'] == 'Em processamento.'){
    //             pagamento.innerHTML = `
    //                 ${item['pagamento']} <a href='payment.html?id=${item['idVenda']}&qr=${item['qr']}&key=${item['key']}' class='btn btn-secondary btn-sm'>Finalizar Pagamento</a>
    //             `
    //         }else{
    //             pagamento.textContent = item['pagamento']
    //         }

    //         const atendente = document.createElement('td')
    //         atendente.textContent = item['atendente']

    //         const data = document.createElement('td')
    //         data.classList.add('text-truncate')
    //         data.textContent = new Date(item['data']).toLocaleDateString('pt-br', {'day':'2-digit','month':'long','hour':'2-digit','minute':'2-digit'})

    //         const id = item['id']
    //         const idVenda = item['idVenda']

    //         // Buttons
    //         const btngp = document.createElement('div')
    //         btngp.classList.add('btn-group')

    //         const btnCancel = document.createElement('button')
    //         var icon = document.createElement('i')
    //         icon.classList.add('bi')
    //         icon.classList.add('bi-trash-fill')
    //         btnCancel.appendChild(icon)
    //         btnCancel.classList.add('btn')
    //         btnCancel.classList.add('btn-sm')
    //         btnCancel.classList.add('btn-danger')

    //         new bootstrap.Tooltip(btnCancel, {title:'Excluir venda!'})

    //         btnCancel.addEventListener('click', async function(){
    //             var conf = confirm('Deseja excluir permanentemente esta venda?')
    //             if(conf){
    //                 btnCancel.innerHTML = spinner
    //                 const req = await request("vendas", "DELETE", {'id': id,'id_venda':idVenda})
    //                 const res = await req.json()
    //                 if(req.ok){location.reload()}
    //                 else{toast(res)}
    //             }
    //         })

    //         const btnCancelItem = document.createElement('button')
    //         var icon = document.createElement('i')
    //         icon.classList.add('bi')
    //         icon.classList.add('bi-phone')
    //         btnCancelItem.appendChild(icon)
    //         btnCancelItem.classList.add('btn')
    //         btnCancelItem.classList.add('btn-sm')
    //         btnCancelItem.classList.add('btn-warning')

    //         new bootstrap.Tooltip(btnCancelItem, {title:'Excluir item!'})

    //         btnCancelItem.addEventListener('click', async function(){
    //             var conf = confirm('Deseja excluir permanentemente este item?')
    //             if (conf){
    //                 btnCancelItem.innerHTML = spinner
    //                 const req = await request("saidas", "DELETE", {'id': id, 'id_venda':idVenda})
    //                 const res = await req.json()
    //                 if(req.ok){location.reload()}
    //                 else{toast(res)}
    //             }
    //         })

    //         const btnNota = document.createElement('button')
    //         var icon = document.createElement('i')
    //         icon.classList.add('bi')
    //         icon.classList.add('bi-sticky-fill')
    //         btnNota.appendChild(icon)
    //         btnNota.classList.add('btn')
    //         btnNota.classList.add('btn-sm')
    //         btnNota.classList.add('btn-light')

    //         new bootstrap.Tooltip(btnNota, {title:'Salvar nota'})

    //         btnNota.addEventListener('click', async function(){
    //             btnNota.innerHTML = '<span id="spin_ldg" class="spinner-border spinner-border-sm text-dark" role="status"></span>'
    //             const req = await request('nnf?id=' + idVenda)
    //             const res = await req.json()
    //             if(req.ok){
    //                 window.location = server + '/nnf/' + res
    //             }
    //         })

    //         btngp.appendChild(btnNota)
    //         btngp.appendChild(btnCancelItem)
    //         btngp.appendChild(btnCancel)

    //         const act = document.createElement('td')
    //         act.appendChild(btngp)

    //         tr.appendChild(nome)
    //         tr.appendChild(tipoTd)
    //         tr.appendChild(valor)
    //         tr.appendChild(cliente)
    //         tr.appendChild(pagamento)
    //         tr.appendChild(atendente)
    //         tr.appendChild(data)
    //         tr.appendChild(act)

    //         document.getElementById('tbVendas').appendChild(tr)  
    //     })
    // }

    if (req.ok) {
        const tableData = []
        res.forEach(item => {
            const id = item.id
            const idVenda = item.idVenda
            const datt = new Date(item.data).toLocaleDateString('pt-br', { month: 'numeric' })
            const datA = new Date().toLocaleDateString('pt-br', { month: 'numeric' })
            if (item.tipo == 'PRODUTOS') { color = 'text-bg-success' }
            else { color = 'text-bg-primary' }
            if (datt === datA) {
                tableData.push({
                    nome: item.nome,
                    tipo: `<spam class="badge ${color} w-100">${item.tipo}</spam>`,
                    data: new Date(item.data).toLocaleDateString('pt-br', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' }),
                    valor: real(item.valor),
                    pag: item.pagamento,
                    cliente: item.cliente,
                    func: item.atendente,
                    btn: `
                    <div class="btn-group">
                        <button class="btn btn-light" onclick="gerar_nnf(this, ${idVenda})"><i class="bi bi-sticky-fill"></i></button>
                        <button class="btn btn-warning" onclick="rmv_item_venda(this, ${id}, ${idVenda})"><i class="bi bi-phone"></i></button>
                        <button class="btn btn-danger" onclick="rmv_venda(this, ${id}, ${idVenda})">${icon_lixeira}</button>
                    </div>`
                })
            }
        })
        new Tabulator("#tb_vendas", {
            data: tableData,
            layout: "fitColumns",
            responsiveLayout: true,
            paginationSize: 12,
            paginationCounter: "rows",
            pagination: "local",
            columns: [
                { title: "Nome", field: "nome", minWidth: 100 },
                { title: "Tipo", field: "tipo", minWidth: 100, formatter: 'html' },
                { title: "Valor", field: "valor", minWidth: 50 },
                { title: "Cliente", field: "cliente", responsive: 4, minWidth: 100 },
                { title: "Pagamento", field: "pag", minWidth: 100 },
                { title: "Atendente", field: "func", minWidth: 100 },
                { title: "Data", field: "data", minWidth: 200 },
                { title: "Ações", field: "btn", hozAlign: "center", responsive: 0, minWidth: 100, formatter: "html" }
            ]
        });
    }
}

async function rmv_venda(t, id, idVenda) {
    if (confirm('Deseja excluir permanentemente esta venda?')) {
        t.innerHTML = spinner
        const req = await request("vendas", "DELETE", { 'id': id, 'id_venda': idVenda })
        const res = await req.json()
        if (req.ok) { location.reload() }
        else { toast(res) }
    }
}

async function rmv_item_venda(t, id, idVenda) {
    if (confirm('Deseja excluir permanentemente este item?')) {
        btnCancelItem.innerHTML = spinner
        const req = await request("saidas", "DELETE", { id: id, id_venda: idVenda })
        const res = await req.json()
        if (req.ok) { location.reload() }
        else { toast(res) }
    }
}

async function gerar_nnf(t, idVenda) {
    t.innerHTML = '<span id="spin_ldg" class="spinner-border spinner-border-sm text-dark" role="status"></span>'
    const req = await request('nnf?id=' + idVenda)
    const res = await req.json()
    if (req.ok) { window.location = server + '/nnf/' + res; t.innerHTML = '<i class="bi bi-sticky-fill"></i>' }
    else { toast(res); t.innerHTML = '<i class="bi bi-sticky-fill"></i>' }
}

async function vendasPorTipo() {
    const res = await request('vendas')
    const js = await res.json()

    var credito = js['CREDITO']
    var debito = js['DEBITO']
    var pix = js['PIX']
    var dinheiro = js['DINHEIRO']
    var dia = js['DIA']
    var total = dinheiro + pix + debito + credito

    document.getElementById('vendasMes').textContent = to_real_no_cents(total)
    document.getElementById('vendasDia').textContent = to_real_no_cents(dia)
    document.getElementById('pix').textContent = to_real_no_cents(pix)
    document.getElementById('cards').textContent = to_real_no_cents(debito + credito)
    document.getElementById('dinheiro').textContent = to_real_no_cents(dinheiro)
}

async function getProds() {
    const res = await request('produtos')
    const js = await res.json()

    if (res.ok) {
        if (js[0]) {
            js.forEach(item => {
                const tr = document.createElement('tr')

                const idProd = item['id']
                const nome = item['nome']
                const valor = item['valor']
                const quant = item['quant']
                const alerta = item['es_min']

                const nomeTd = document.createElement('td')
                nomeTd.classList.add("d-flex", "align-items-center", "justify-content-between")
                if (config_estoque) {
                    if (quant <= 0) {
                        nomeTd.innerHTML = `
                            <span>${nome}</span>
                            <span class="badge badge-sm text-bg-danger p-1" style="font-size: 14px;">Sem estoque!</span>
                        `
                    } else {
                        nomeTd.innerHTML = `
                            <span>${nome}</span>
                            <span class="badge badge-sm text-bg-success p-1" style="font-size: 14px;">${to_real(valor)}</span>
                        `

                    }
                } else {
                    nomeTd.innerHTML = `
                            <span>${nome}</span>
                            <span class="badge badge-sm text-bg-success p-1" style="font-size: 14px;">${to_real(valor)}</span>
                        `

                }


                const btnTd = document.createElement('td')
                const btn = document.createElement('button')
                btn.classList.add('btn', 'btn-dark')
                btn.innerHTML = '<i class="bi bi-plus-square-dotted"></i>'
                btn.addEventListener('click', function () {
                    if (config_estoque) {
                        if (quant <= alerta) { toast("Produto com alerta de estoque!") }
                    }
                    const vl = document.getElementById('valorProd')
                    let newvl = 0
                    if (vl.value) {
                        newvl = (parseFloat(vl.value) + parseFloat(valor)).toFixed(1)
                    } else {
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
                    btnRemoveItem.addEventListener('click', function () {
                        document.getElementById('listProdAdd').removeChild(li)
                        vl.value = (parseFloat(vl.value) - parseFloat(valor)).toFixed(1)
                        rmvProdCart(idProd, valor)
                    })

                    li.appendChild(btnRemoveItem)
                    document.getElementById('listProdAdd').appendChild(li)
                    addProdCart(idProd, nome, valor)
                })
                if (quant <= 0 && config_estoque) { btn.disabled = true }

                btnTd.appendChild(btn)
                tr.appendChild(nomeTd)
                tr.appendChild(btnTd)

                document.getElementById('listProd').appendChild(tr)
            })
        } else {
            document.getElementById('listProd').innerHTML = `
            <div class="d-flex flex-column gap-4 align-items-center justify-content-center">
                <span colspan="2" class="text-center">Nenhum produto cadastrado!</span>
                <button class="btn btn-success" onclick="change_screen('estoque')">Cadastrar</button>
            </div>  
            `
        }
    }
}

function addProdCart(idProd, nome, valor) {
    if (cart[idProd]) {
        cart[idProd].quantidade += 1
        cart[idProd].valor += valor
    } else {
        cart[idProd] = {
            'nome': nome,
            'quantidade': 1,
            'valor': valor
        }
    }
}

function rmvProdCart(id, valor) {
    cart[id].quantidade -= 1
    cart[id].valor -= valor

}

async function conferCPFNewVenda(inp) {
    var cpf = await inp.value
    cpf = limpar_pontuacao(cpf)

    if (cpf) {
        if (cpf.length >= 11) {
            var l = document.getElementById('ldgCPF')
            l.hidden = ''
            const req = await request("conferir_cpf", "POST", { 'cpf': cpf })
            const res = await req.json()

            if (req.ok) { l.hidden = 'none' }
            else { toast(res, 'erro'); inp.value = '', l.hidden = 'none' }
        } else { toast('CPF Incorreto!', 'erro'); inp.value = ''.l.hidden = 'none' }
    }
}

async function vender() {
    var valorTotal = limpar_float(document.getElementById('valorProd').value)
    var mat = document.getElementById('matricula').value
    var cpf = limpar_pontuacao(document.getElementById('cpf').value)
    var desconto = limpar_float(document.getElementById('desconto').value)
    var sel = document.getElementById('selPag').value
    var form = new FormData()

    form.append('mat', mat)
    form.append('valor', valorTotal)
    form.append('cpf', cpf)
    form.append('desconto', desconto)
    form.append('mt_pag', sel)
    form.append('cart', JSON.stringify(cart))
    console.log(cart)
    form.append('tipo', 'PRODUTOS')

    document.getElementById('btnVender').innerHTML = spinner
    const req = await sendForm("vendas", form, 'POST')
    const res = await req.json()
    if (req.ok) {
        if (res['qr']) {
            window.location = `/manager/payment.html?qr=${res['qr']}&id=${res['id_venda']}&key=${res['key']}`
        } else {
            location.reload()
        }
    }
    else { toast(res) }
}

function zerarcart() {
    cart = {}
    document.getElementById('valorProd').value = null
    document.getElementById('listProdAdd').innerHTML = ''
}

// =============== Ordens de Serviço
async function getDadosOs() {
    const req = await request('clientes')
    const res = await req.json()

    if (req.ok) {
        if (res[0]) {
            res.forEach(item => {
                const id = item['id']
                const cpf = item['cpf']
                const nome = item['nome']
                const telefone = item['tel']
                const modelo = item['modelo']
                const marca = item['marca']
                const cor = item['cor']
                const endereco = item['endereco']
                const imei = item['imei']

                var ul = document.getElementById('listClient')

                var li = document.createElement('li')
                li.classList.add('list-group-item')

                var dv = document.createElement('div')
                dv.classList.add("d-flex")
                dv.classList.add("flex-row")
                dv.classList.add("justify-content-between")

                var s = document.createElement('spam')
                s.classList.add('d-flex')
                s.classList.add('flex-column')
                if (to_CPF(cpf)) {
                    s.innerHTML = `
                        <spam class="fs-6 fw-bold text-truncate" style="max-width: 200px;">${nome}</spam>
                        <spam style="font-size: 12px;">${to_CPF(cpf)}</spam>
                    `
                } else {
                    s.innerHTML = `
                        <spam class="fs-6 fw-bold text-truncate" style="max-width: 200px;">${nome}</spam>
                        <spam class="badge text-bg-danger" style="font-size: 12px;">
                            CPF Incorreto, Favor alterar! <a href="/manager/clientes.html">Aqui</a>
                        </spam>
                    `

                }

                var btnAdd = document.createElement('button')
                btnAdd.classList.add('btn')
                btnAdd.classList.add('btn-success')
                btnAdd.classList.add('fw-bold')
                btnAdd.textContent = '+'
                btnAdd.type = 'button'

                btnAdd.addEventListener('click', function () {
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

                    if (day < 10) { day = '0' + day }
                    if (month < 10) { month = '0' + month }
                    var dateEnd = `${date.getFullYear()}-${month}-${day}`

                    document.getElementById("retirada").value = dateEnd
                })

                dv.appendChild(s)
                dv.appendChild(btnAdd)
                li.appendChild(dv)
                ul.appendChild(li)
            })
        } else {
            var ul = document.getElementById('listClient')
            var li = document.createElement('li')
            li.classList.add('list-group-item')
            li.innerHTML = `
                <span class="text-center">
                    Nenhum cliente cadastrado, 
                    <button class="btn btn-sm btn-success" onclick="change_screen('clientes')">
                        Bora começar ?
                    </button>
                </span>`
            ul.appendChild(li)
        }
    }

    const res4 = await request('status')
    const js4 = await res4.json()
    if (res4.ok) {
        js4.forEach(item => {
            var sl = document.createElement('option')
            sl.id = `opt_${item['status']}`
            sl.textContent = item['status']
            document.getElementById('status').appendChild(sl)
        })
    }

}

async function getStatusOs() {
    const res = await request('os_tipo')
    const js = await res.json()
    document.getElementById('abertas').textContent = js['ABERTA']
    document.getElementById('canceladas').textContent = js['CANCELADA']
    document.getElementById('semconserto').textContent = js['SEM CONSERTO']
    document.getElementById('entregues').textContent = js['ENTREGUE']
    document.getElementById('expiradas').textContent = js['EXPIRADA']
    document.getElementById('orcamentos').textContent = js['ORÇAMENTO']
}

async function getOsAbertas() {
    const req = await request("os?status='ABERTA','ORÇAMENTO'")
    const js = await req.json()

    // Dentro do Prazo
    if (req.ok) {
        js.forEach(item => {
            const id = item['id']
            const nomeOS = item['nome']
            const modeloOs = item['modelo']
            const valorOs = item['valor']
            const atendenteOS = item['atendente']
            const marcaOs = item['marca']
            const corOs = item['cor']
            const statusOS = item['status']
            const aberturaOS = new Date(item['abertura']).toLocaleDateString("pt-br", { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })
            const entregaOS = new Date(item['entrega']).toLocaleDateString("pt-br", { day: '2-digit', month: 'long' })
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
            if (statusOS === 'ABERTA') { badge.style.background = '#023047' }
            else if (statusOS === 'ORÇAMENTO') { badge.style.background = '#9c6644' }
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
            new bootstrap.Tooltip(btnEntregue, { title: 'Marcar como entregue!' })

            btnEntregue.addEventListener('click', function () {
                document.getElementById('idOsEntrega').value = id
                document.getElementById('osValor').value = valorOs
                const myModal = new bootstrap.Modal(document.getElementById('ModalEntregue'), { show: 'true' })
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
            new bootstrap.Tooltip(btnEditar, { title: 'Editar Ordem!' })

            btnEditar.addEventListener('click', function () {
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


                const modalEditar = new bootstrap.Modal(document.getElementById('editarOsModal'), { show: 'true' })
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
            new bootstrap.Tooltip(btnDown, { title: 'Download!' })
            btnDown.addEventListener('click', function () {
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
            new bootstrap.Tooltip(btnSemConserto, { title: 'Sem conserto!' })
            btnSemConserto.classList.add('bg-violet')
            btnSemConserto.addEventListener('click', async function () {
                btnSemConserto.innerHTML = spinner
                const req = await request("alter_status_os", "POST", { 'id': id, "status": "SEM CONSERTO" })
                const res = await req.json()
                if (req.ok) { location.reload() }
                else { toast(res) }
            })

            // Botao cancelar
            const btnCancelar = document.createElement('button')
            const iconCancelar = document.createElement('i')
            iconCancelar.classList.add('bi')
            iconCancelar.classList.add('bi-trash-fill')
            btnCancelar.appendChild(iconCancelar)
            btnCancelar.classList.add('btn')
            btnCancelar.classList.add('btn-sm')
            new bootstrap.Tooltip(btnCancelar, { title: 'Cancelar Ordem!!' })
            btnCancelar.classList.add('btn-danger')
            btnCancelar.addEventListener('click', async function () {
                btnCancelar.innerHTML = spinner
                const req = await request("alter_status_os", "POST", { 'os': id, 'status': 'CANCELADA' })
                const res = await req.json()
                if (req.ok) { location.reload() }
                else { toast(res) }
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
    if (res2.ok) {
        js2.forEach(item => {
            const id = item['id']
            const nomeOS = item['nome']
            const modeloOs = item['modelo']
            const valorOs = item['valor']
            const statusOS = item['status']
            const atendenteOS = item['atendente']
            const cadastroOS = item['abertura']
            const entregaOS = item['entrega']
            const marcaOs = item['marca']
            const corOs = item['cor']
            const imeiOs = item['imei']
            const tipoServico = item['tipo']
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
            new bootstrap.Tooltip(btnEntregue, { title: 'Marcar como entregue!' })

            btnEntregue.addEventListener('click', function () {
                document.getElementById('idOsEntrega').value = id
                document.getElementById('osValor').value = valorOs
                const myModal = new bootstrap.Modal(document.getElementById('ModalEntregue'), { show: 'true' })
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
            new bootstrap.Tooltip(btnEditar, { title: 'Editar Ordem!' })

            btnEditar.addEventListener('click', function () {
                document.getElementById('eosId').value = id
                document.getElementById('eosNome').value = nomeOS
                document.getElementById('eosModelo').value = modeloOs
                document.getElementById('eosValor').value = valorOs
                document.getElementById('eosMarca').value = marcaOs
                document.getElementById('eosCor').value = corOs
                document.getElementById('eosCpf').value = cpfOs
                document.getElementById('eosImei').value = imeiOs
                document.getElementById('eoTipoOs').value = capitalize(statusOS)
                document.getElementById('eosTipoServico').value = tipoServico


                const modalEditar = new bootstrap.Modal(document.getElementById('editarOsModal'), { show: 'true' })
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
            new bootstrap.Tooltip(btnDown, { title: 'Download!' })
            btnDown.addEventListener('click', function () {
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
            new bootstrap.Tooltip(btnSemConserto, { title: 'Sem conserto!' })
            btnSemConserto.classList.add('bg-violet')
            btnSemConserto.addEventListener('click', async function () {
                btnSemConserto.innerHTML = spinner
                const req = await request("alter_status_os", "POST", { 'id': id, "status": "SEM CONSERTO" })
                const res = await req.json()
                if (req.ok) { location.reload() }
                else { toast(res) }
            })

            // Botao cancelar
            const btnCancelar = document.createElement('button')
            const iconCancelar = document.createElement('i')
            iconCancelar.classList.add('bi')
            iconCancelar.classList.add('bi-trash-fill')
            btnCancelar.appendChild(iconCancelar)
            btnCancelar.classList.add('btn')
            btnCancelar.classList.add('btn-sm')
            new bootstrap.Tooltip(btnCancelar, { title: 'Cancelar Ordem!!' })
            btnCancelar.classList.add('btn-danger')
            btnCancelar.addEventListener('click', async function () {
                btnCancelar.innerHTML = spinner
                const req = await request("alter_status_os", "POST", { 'os': id, 'status': "CANCELADA" })
                const res = await req.json()
                if (req.ok) { location.reload() }
                else { toast(res) }
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

async function getAllOs() {
    const res = await request('os')
    const js = await res.json()

    if (res.ok) {
        js.forEach(item => {
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
            if (statusOS === 'SEM CONSERTO') { badge.style.background = '#8338ec' }
            else if (statusOS === 'ENTREGUE') { badge.classList.add('text-bg-success') }
            else if (statusOS === 'FINALIZADA') { badge.style.background = '#fb8500' }
            else if (statusOS === 'CANCELADA') { badge.classList.add('text-bg-danger') }
            else if (statusOS === 'ABERTA') { badge.style.background = '#023047' }
            else if (statusOS === 'ORÇAMENTO') { badge.style.background = '#9c6644' }

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
            new bootstrap.Tooltip(btnCancelar, { title: 'Cancelar Ordem!' })
            btnCancelar.addEventListener('click', async function () {
                const req = await request("alter_status_os", 'POST', { 'os': id, 'status': 'CANCELADA' })
                const res = await req.json()
                if (req.ok) { location.reload() }
                else { toast(res) }
            })

            const btnReabrir = document.createElement('button')
            var icon = document.createElement('i')
            btnReabrir.classList.add('btn')
            btnReabrir.classList.add('btn-sm')
            btnReabrir.style.background = '#023047'
            icon.classList.add('bi')
            icon.classList.add('bi-cloud-arrow-down-fill')
            btnReabrir.appendChild(icon)
            new bootstrap.Tooltip(btnReabrir, { title: 'Download!' })
            btnReabrir.addEventListener('click', function () {
                btnReabrir.innerHTML = spinner
                window.location = api + `get_os_ind/?os=${id}&&cr=${cr}`
            })

            if (statusOS == 'CANCELADA') {
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

async function getMarcasOs() {
    const res2 = await request('marcas')
    const js2 = await res2.json()
    if (res2.ok) {
        js2.forEach(item => {
            const sl = document.createElement('option')
            sl.textContent = item.nome
            document.getElementById('noMarca').appendChild(sl)

            const sl2 = document.createElement('option')
            sl2.textContent = item.nome
            document.getElementById('eosMarca').appendChild(sl2)
        })
    }
}

async function abrirOS(t) {
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
    var valor = (document.getElementById('valor').value)
    var matricula = document.getElementById('matricula').value
    var statusOS = document.getElementById('noTipoOs').value
    var form = new FormData()

    form.append('id', id)
    form.append('telefone', somente_numeros(telefone))
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
    form.append('valor', limpar_float(valor))
    form.append('matricula', matricula)
    form.append('st_os', statusOS)

    t.innerHTML = spinner
    const req = await sendForm("os", form)
    const res = await req.json()
    if (req.ok) { window.location = api + `get_os_ind?os=${res['os']}&&cr=${cr}` }
    else { toast(res); }
}

async function entregarOs(t) {
    t.innerHTML = spinner
    var idOs = document.getElementById('idOsEntrega').value
    var custo = document.getElementById('osCusto').value
    var peca = document.getElementById('osPeca').value
    var valor = document.getElementById('osValor').value
    var pag = document.getElementById('osPag').value

    dd = {
        'os': idOs,
        'custo': limpar_float(custo),
        'peca': limpar_float(peca),
        'pagamento': pag,
        'status': 'ENTREGUE',
        'valor': limpar_float(valor)
    }

    const req = await request("alter_status_os", "POST", dd)
    const res = req.json()
    if (req.ok) { location.reload(); toast(res) }
    else { toast(res) }
}

function addStatus() {
    if (cont_status < 21) {
        const select = document.getElementById('status')
        const tp = select.value
        var ul = document.getElementById('ul-status')
        const li = document.createElement('li')
        li.classList.add('d-flex')
        li.classList.add('list-group-item')
        li.classList.add('justify-content-between')

        var s = document.createElement('spam')
        s.classList.add("text-truncate")
        s.textContent = tp

        var btnExcluir = document.createElement('button')
        btnExcluir.classList.add('btn')
        btnExcluir.classList.add('btn-sm')
        btnExcluir.classList.add('btn-danger')
        btnExcluir.innerHTML = `<i class="bi bi-trash-fill"></i>`
        btnExcluir.addEventListener('click', function () {
            ul.removeChild(li)
            cont_status -= 1
            statusM.splice(statusM.indexOf(tp), 1)

            opt = new Option(tp)
            select.add(opt)

            document.getElementById('cont_status').textContent = `${cont_status}/21`
            if (cont_status === 0) { ul.innerHTML = `<li class="list-group-item text-center fw-bold"> Nenhum status adicionado! </li>` }
        })

        if (cont_status === 0) { ul.innerHTML = '' }

        li.appendChild(s)
        li.appendChild(btnExcluir)
        ul.appendChild(li)
        statusM.push(tp)
        cont_status += 1
        document.getElementById('cont_status').textContent = `${cont_status}/21`

        const selectedIndex = select.selectedIndex;
        select.remove(selectedIndex)
    } else {
        toast(`Máximo de ${cont_status} atingido!`)
    }
}

async function editarOs(t) {
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
        'cpf': limpar_pontuacao(cpf),
        'cor': cor,
        'marca': marca,
        'modelo': modelo,
        'imei': imei,
        'valor': valor,
        'status_os': tipoOs,
        'servico': servico
    }

    if (modelo && marca && cor && valor) {
        t.innerHTML = spinner
        const req = await request('os', 'PATCH', form)
        if (req.ok) { location.reload() }
        else { toast(await req.json()) }
    } else { alert('Preencha todos os dados!') }

}

// ====================== Clientes
async function get_clientes() {
    const res = await request("clientes")
    const js = await res.json()

    if (res.ok) {
        js.forEach(item => {
            const tr = document.createElement('tr')

            const id = item['id']
            const cpf = item['cpf']
            const nome = item['nome']
            const telefone = item['tel']
            const modelo = item['modelo']
            const marca = item['marca']
            const cor = item['cor']
            const endereco = item['endereco']
            const obs = item['obs']
            const imei = item['imei']

            const idTd = document.createElement('td')
            idTd.textContent = id

            const cpfTd = document.createElement('td')
            cpfTd.classList.add('text-truncate')
            if (to_CPF(cpf)) { cpfTd.textContent = to_CPF(cpf) }
            else { cpfTd.innerHTML = "<spam class='badge text-bg-danger'>CPF INCORRETO, ALTERE URGENTE!</spam>" }


            const nomeTd = document.createElement('td')
            nomeTd.classList.add('text-truncate')
            nomeTd.textContent = nome

            const telefoneTd = document.createElement('td')
            telefoneTd.classList.add('text-truncate')
            if (telefone.length >= 8 && telefone.length <= 11) { telefoneTd.textContent = to_tel(telefone.trim()) }
            else (telefoneTd.innerHTML = "<spam class='badge text-bg-warning'>Telefone incorreto!</spam>")

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
            new bootstrap.Tooltip(btnWhats, { title: 'Abrir contato!' })
            btnWhats.addEventListener('click', function () {
                window.open(`https://api.whatsapp.com/send/?phone=${telefone}`)
            })

            const btnEditar = document.createElement('button')
            btnEditar.classList.add('btn')
            btnEditar.classList.add('btn-sm')
            btnEditar.classList.add('btn-secondary')
            var icon = document.createElement('i')
            icon.classList.add('bi')
            icon.classList.add('bi-box-arrow-up-right')
            new bootstrap.Tooltip(btnEditar, { title: 'Editar!' })
            btnEditar.appendChild(icon)
            btnEditar.addEventListener('click', function () {
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

                const modalEditarCliente = new bootstrap.Modal(document.getElementById('editarClienteModal'), { show: 'true' })
                modalEditarCliente.show()
            })

            const btnRemov = document.createElement('button')
            btnRemov.classList.add('btn')
            btnRemov.classList.add('btn-sm')
            btnRemov.classList.add('btn-danger')
            var icon = document.createElement('i')
            icon.classList.add('bi')
            icon.classList.add('bi-trash-fill')
            new bootstrap.Tooltip(btnRemov, { title: 'Excluir!' })
            btnRemov.appendChild(icon)
            btnRemov.addEventListener('click', async function () {
                btnRemov.innerHTML = spinner
                const req = await request('clientes', 'DELETE', { 'id': id })
                const res = await req.json()
                if (req.ok) { location.reload() }
                else { toast(res) }
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
        })
    }
}

async function getMarcasClientes() {
    const res2 = await request('marcas')
    const js2 = await res2.json()
    if (res2.ok) {
        js2.forEach(item => {
            var sl = document.createElement('option')
            sl.textContent = item.nome
            document.getElementById('ncMarca').appendChild(sl)

            var sl2 = document.createElement('option')
            sl2.textContent = item.nome
            document.getElementById('ecMarca').appendChild(sl2)
        })
    }
}

async function newClient(t) {
    var cpf = somente_numeros(document.getElementById('ncCpf').value)
    var nome = document.getElementById('ncNome').value
    var tel = document.getElementById('ncTel').value
    var tel2 = document.getElementById('ncTel2').value
    var modelo = document.getElementById('ncModelo').value
    var cor = document.getElementById('ncCor').value
    var marca = document.getElementById('ncMarca').value
    var imei = document.getElementById('ncImei').value
    var end = document.getElementById('ncEnd').value
    var obs = document.getElementById('ncObs').value

    alert(cpf)
    var dados = {
        "cpf": cpf,
        "nome": nome,
        "tel": somente_numeros(tel),
        "tel2": somente_numeros(tel2),
        "modelo": modelo,
        "cor": cor,
        "marca": marca,
        "imei": imei,
        "end": end,
        "obs": obs
    }

    if (cpf.length == 11 || cpf.length == 0) {
        t.innerHTML = spinner
        const req = await request('clientes', 'POST', dados)
        const res = await req.json()
        if (req.ok) { location.reload() }
        else { toast(res) }
    } else { toast("CPF Incorreto ajuste!") }

}

async function editarCliente(t) {
    var id = document.getElementById('ecId').value
    var cpf = document.getElementById('ecCpf').value
    var nome = document.getElementById('ecNome').value
    var tel = document.getElementById('ecTel').value
    var tel2 = document.getElementById('ecTel2').value
    var modelo = document.getElementById('ecModelo').value
    var cor = document.getElementById('ecCor').value
    var marca = document.getElementById('ecMarca').value
    var imei = document.getElementById('ecImei').value
    var end = document.getElementById('ecEnd').value
    var obs = document.getElementById('ecObs').value

    var dados = {
        "id": id,
        "cpf": limpar_pontuacao(cpf),
        "nome": nome,
        "tel": limpar_pontuacao(tel),
        "tel2": limpar_pontuacao(tel2),
        "modelo": modelo,
        "cor": cor,
        "marca": marca,
        "imei": imei,
        "end": end,
        "obs": obs
    }

    const req = await request("clientes", "PATCH", dados)
    const res = await req.json()
    if (req.ok) { location.reload(); toast(res) }
    else { toast(res) }
}

// ====================== Estoque
async function getProdutos() {
    const req = await request('produtos')
    const res = await req.json()

    if (req.ok) {
        res.forEach(item => {
            const tr = document.createElement('tr')

            const imgProd = item['img']
            const idProd = item['id']
            const nomeProd = item['nome']
            const custoProd = item['custo']
            const valorProd = item['valor']
            const esMinProd = item['es_min']
            const quantProd = item['quant']
            const lucro = item['lucro']
            const fornProd = item['fornecedor']
            const eanProd = item['ean']
            const descProd = item['desc']
            var porcentLucro = (lucro / custoProd) * 100

            const imgTd = document.createElement('td')
            const link = document.createElement("a")
            link.href = server + '/img/' + imgProd
            link.target = '_blank'

            const img = document.createElement('img')
            img.classList.add('img-fluid')
            img.style.maxHeight = '30px'
            img.src = server + '/img/' + imgProd

            link.appendChild(img)
            imgTd.appendChild(link)

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
            alerta.innerHTML = `
                <spam class="badge text-bg-secondary">${esMinProd}</spam>
            `

            const quantidade = document.createElement('td')
            quantidade.classList.add("fw-bold")
            if (quantProd <= esMinProd) { quantidade.classList.add("text-danger") }
            quantidade.textContent = quantProd

            const lucrol = document.createElement('td')
            const spn = document.createElement('span')

            spn.classList.add('badge')
            spn.classList.add('rounded-pill')
            spn.classList.add('fs-6', 'fw-bold')
            if (porcentLucro >= 75) {
                spn.classList.add('text-bg-success')
                if (porcentLucro >= 100) {
                    porcentLucro = 99
                }
            } else if (porcentLucro >= 50) {
                spn.classList.add('bg-blue')
            } else if (porcentLucro >= 25) {
                spn.classList.add('bg-orange')
            } else if (porcentLucro < 25) {
                spn.classList.add('text-bg-danger')
            }

            if (porcentLucro == 99) {
                spn.textContent = '+ 99%'
            } else {
                spn.textContent = porcentLucro.toFixed(2) + '%'
            }
            lucrol.appendChild(spn)

            const ean = document.createElement('td')
            ean.textContent = eanProd


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
            btnEditar.addEventListener('click', function () {
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
                document.getElementById('edImgProd').src = server + '/img/' + imgProd

                const toast = new bootstrap.Modal(document.getElementById('editProdModal'), { 'show': true })
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
            btnRemov.addEventListener('click', async function () {
                var conf = confirm('Tem certeza que deseja excluir?')
                if (conf) {
                    btnRemov.innerHTML = spinner
                    const req = await request('produtos', 'DELETE', { 'id': idProd })
                    const res = await req.json()
                    if (req.ok) { location.reload() }
                    else { toast(res, 'erro') }
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
            btnEntrada.addEventListener('click', function () {
                document.getElementById('prodIdEntrada').value = idProd
                document.getElementById('prodNome').value = nomeProd
                document.getElementById('prodQuant').value = quantProd
                document.getElementById('prodCusto').value = to_real(custoProd)
                document.getElementById('prodValor').value = to_real(valorProd)

                const toast = new bootstrap.Modal(document.getElementById('addProdModal'), { 'show': true })
                toast.show()
            })

            btngp.appendChild(btnEditar)
            btngp.appendChild(btnRemov)
            btngp.appendChild(btnEntrada)

            tr.appendChild(imgTd)
            tr.appendChild(id)
            tr.appendChild(nome)
            tr.appendChild(custo)
            tr.appendChild(valor)
            tr.appendChild(alerta)
            tr.appendChild(quantidade)
            tr.appendChild(lucrol)
            tr.appendChild(ean)
            tr.appendChild(btns)

            document.getElementById('tbody').appendChild(tr)
        })
    }
}

async function getFornecedores() {
    const req = await request('fornecedores')
    const res = await req.json()

    if (req.ok) {
        res.forEach(item => {
            const id = item['id']
            const nome = item['nome']

            const opt = document.createElement('option')
            opt.textContent = nome
            document.getElementById('npForn').appendChild(opt)

            const opt2 = document.createElement('option')
            opt2.textContent = nome
            document.getElementById('edForn').appendChild(opt2)

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
            btnExcluiForn.addEventListener('click', async function () {
                const conf = confirm('Deseja realmente exluir?')
                if (conf) {
                    const req = await request("fornecedores", "DELETE", { "id": id })
                    const res = await req.json()
                    if (req.ok) { location.reload() }
                    else { toast(res, 'erro') }
                }
            })

            li.appendChild(spn)
            li.appendChild(btnExcluiForn)

            document.getElementById('listForn').appendChild(li)

        })
    }
}

async function criar_prod(t) {
    var ean = document.getElementById('npEan').value
    var nome = document.getElementById('npNome').value
    var custo = document.getElementById('npCusto').value
    var valor = document.getElementById('npValor').value
    var esmin = document.getElementById('npEsMin').value
    var quant = document.getElementById('npQuant').value
    var desc = document.getElementById('npDesc').value
    var lucro = document.getElementById('npLucro').value
    var forn = document.getElementById('npForn').value
    var imgFile = document.getElementById('imgProdInput').files[0]


    t.innerHTML = spinner
    var form = new FormData()
    form.append('ean', ean)
    form.append('nome', nome.toUpperCase())
    form.append('custo', limpar_float(custo))
    form.append('valor', limpar_float(valor))
    form.append('esmin', esmin)
    form.append('quant', quant)
    form.append('desc', limpar_float(desc))
    form.append('lucro', limpar_float(lucro))
    form.append('forn', forn)
    form.append('imgFile', imgFile)

    const req = await sendForm('produtos', form)
    const res = await req.json()
    if (req.ok) { location.reload() }
    else { toast(res, 'erro') }

}

function calc_lucro() {
    var valor = limpar_float(document.getElementById('npValor').value)
    var custo = limpar_float(document.getElementById('npCusto').value)
    if (valor && custo) {
        var lucro = parseFloat(valor) - parseFloat(custo)
        document.getElementById('npLucro').value = lucro.toFixed(2)
    } else {
        document.getElementById('npLucro').value = 0
    }
}

function ed_calc_lucro() {
    var valor = limpar_float(document.getElementById('edValor').value)
    var custo = limpar_float(document.getElementById('edCusto').value)
    if (valor && custo) {
        var lucro = parseFloat(valor) - parseFloat(custo)
        document.getElementById('edLucro').value = lucro.toFixed(2)
    } else {
        document.getElementById('edLucro').value = 0
    }
}

async function cadastrar_forn(t) {
    const nome = document.getElementById('nomeForn').value
    const tel = document.getElementById('telForn').value
    if (nome && tel) {
        t.innerHTML = spinner
        const req = await request('fornecedores', 'POST', { "nome": nome.toUpperCase(), "telefone": somente_numeros(tel) })
        const res = await req.json()
        if (req.ok) { location.reload() }
        else { toast(res, 'erro') }
    }
}

async function entrada_produtos(t) {
    var id = document.getElementById('prodIdEntrada').value
    var quant = document.getElementById('newQuant').value
    var custo = document.getElementById('newCusto').value
    var valor = document.getElementById('newValor').value

    if (quant) {
        t.innerHTML = spinner
        var dados = {
            "id": id,
            "quant": quant,
            "custo": limpar_pontuacao(custo),
            "valor": limpar_pontuacao(valor)
        }

        const req = await request('produtos', 'PUT', dados)
        const res = await req.json()

        if (req.ok) { location.reload() }
        else { toast(res, 'erro'); t.removeChild(document.getElementById('spin_ldg')) }
    } else { toast('Quantidade Obrigatória!', 'erro') }
}

async function editar_produto(t) {
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
    var img = document.getElementById('imgEdProd').files[0]
    var form = new FormData()

    form.append('id', id)
    form.append('ean', ean)
    form.append('nome', nome.toUpperCase())
    form.append('custo', limpar_pontuacao(custo))
    form.append('valor', limpar_pontuacao(valor))
    form.append('esmin', esmin)
    form.append('quant', quant)
    form.append('desc', limpar_pontuacao(desc))
    form.append('lucro', limpar_pontuacao(lucro))
    form.append('forn', forn)
    form.append('img', img)

    t.innerHTML = spinner
    const req = await sendForm('produtos', form, 'PATCH')
    const res = await req.json()

    if (req.ok) { location.reload() }
    else { toast(res, 'erro') }
}

// =============== Relatorios
async function get_infos(opt = 'dia') {
    if (filterRes == 'periodo') {
        periodo = document.getElementById('btn-' + filterRes).value
        req = await request('get_infos_dash?periodo=' + periodo)
    } else {
        req = await request('get_infos_dash?filter=' + filterRes)
    }
    const res = await req.json()

    if (req.ok) {
        var green = '#344e41'
        var red = '#a3b18a'

        document.getElementById('total_vendas').textContent = to_real(res['TOTAL'])
        document.getElementById('vendas_prod').textContent = to_real(res['PRODUTOS'])
        document.getElementById('vendas_os').textContent = to_real(res['OS'])

        document.getElementById('vendas_bruto').textContent = to_real(res['BRUTO'])
        document.getElementById('vendas_liq').textContent = to_real(res['LIQUIDO'])
        document.getElementById('vendas_med').textContent = res['MEDIA_VENDAS'] + ' Un.'

        document.getElementById('tc_med').textContent = to_real(res['TICKET_MEDIO'])
        document.getElementById('tc_cp').textContent = res['TICKET_PROD'].toFixed(2) + ' Un.'
        document.getElementById('ct_prod').textContent = to_real(res['CUSTO_PROD'])

        document.getElementById('top3func').innerHTML = '' // Funcionarios
        if (res['VD_AT'].length !== 0) {
            document.getElementById('top3func').classList.remove('d-flex', 'align-items-center', 'justify-content-between')
            res['VD_AT'].forEach(res => {
                const li = document.createElement('li')
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between')
                li.innerHTML = `
                    <span>${res[0]}</span>
                    <span class="badge text-bg-secondary">${res[1]}</span>
                `
                document.getElementById('top3func').appendChild(li)
            })
        } else {
            tp3 = document.getElementById('top3func')
            tp3.textContent = "Sem venda por atendentes!"
            tp3.classList.add('d-flex', 'align-items-center', 'justify-content-between')
        }

        document.getElementById('top3prod').innerHTML = '' // Produtos
        if (res['VD_PROD'].length > 0) {
            document.getElementById('top3prod').classList.remove('d-flex', 'align-items-center', 'justify-content-between')
            res['VD_PROD'].forEach(res => {
                const li = document.createElement('li')
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between')
                li.innerHTML = `
                    <span>${res[0]}</span>
                    <span class="badge text-bg-secondary">${res[1]}</span>
    
                `
                document.getElementById('top3prod').appendChild(li)

            })
        } else {
            tp3 = document.getElementById('top3prod')
            tp3.textContent = "Sem venda de produtos!"
            tp3.classList.add('d-flex', 'align-items-center', 'justify-content-between')
        }

        document.getElementById('top3marcas').innerHTML = '' // Marcas
        if (res['VD_MARCAS'].length > 0) {
            document.getElementById('top3marcas').classList.remove('d-flex', 'align-items-center', 'justify-content-between')

            res['VD_MARCAS'].forEach(res => {
                const li = document.createElement('li')
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between')
                li.innerHTML = `
                    <span>${res[0]}</span>
                    <span class="badge text-bg-secondary">${res[1]}</span>
    
                `
                document.getElementById('top3marcas').appendChild(li)
            })
        } else {
            tp3 = document.getElementById('top3marcas')
            tp3.classList.add('d-flex', 'align-items-center', 'justify-content-between')
            tp3.textContent = "Sem venda por marcas!"
        }

        // Produtos
        const estA = document.getElementById('est_alerta')
        estA.innerHTML = ''
        const estZ = document.getElementById('est_zerado')
        estZ.innerHTML = ''
        if (res.ALT[0]) {
            res.ALT.forEach(item => {
                if (item.quantidade >= item.alerta && item.quantidade > 0) {
                    const li = document.createElement('li')
                    li.classList.add(
                        'd-flex', 'list-group-item',
                        'justify-content-between'
                    )

                    const nome = document.createElement('span')
                    nome.textContent = item.nome

                    const quant = document.createElement('span')
                    quant.classList.add(
                        'badge',
                        'text-bg-warning'
                    )
                    quant.textContent = item.quantidade

                    li.appendChild(nome)
                    li.appendChild(quant)
                    estA.appendChild(li)
                } else if (item.quantidade <= 0) {
                    const li = document.createElement('li')
                    li.classList.add(
                        'd-flex', 'list-group-item',
                        'justify-content-between'
                    )

                    const nome = document.createElement('span')
                    nome.textContent = item.nome

                    const quant = document.createElement('span')
                    quant.classList.add(
                        'badge',
                        'text-bg-danger'
                    )
                    quant.textContent = item.quantidade

                    li.appendChild(nome)
                    li.appendChild(quant)
                    estZ.appendChild(li)
                }
            })
        }

        // Dashboard Vendas
        var dv = document.getElementById('divDashVendas')
        dv.style.height = '300px'

        if (res['PROD_MES']['valor'].length > 0) {
            var dashVendas = document.createElement('canvas')

            mesesDash = res['PROD_MES']['dia']
            if (filterRes == 'ano') {
                mesesDash = []
                res['PROD_MES']['dia'].forEach(item => {
                    mesesDash.push(`${item} - ${mesesAbreviados[parseInt(item)]}`)
                })
            }

            dv.innerHTML = ''
            new Chart(dashVendas, {
                type: 'line',
                data: {
                    labels: mesesDash,

                    datasets: [{
                        data: res['PROD_MES']['cont'],
                        label: 'Total',
                        fill: {
                            target: 'origin',
                        },
                        borderWidth: 1,
                        borderColor: red,
                    }, {
                        data: res['PROD_MES']['valor'],
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
                    aspectRatio: 0,
                    scales: {
                        x: {
                            beginAtZero: false
                        },
                        y: {
                            display: false
                        }
                    },
                    plugins: {
                        // title: {
                        //   display: true,
                        //   text: 'PRODUTOS POR ' + opt.toUpperCase()
                        // }
                    },
                }
            })
            dv.appendChild(dashVendas)
        } else {
            dv.textContent = "Sem dados!"
        }

        // Dashboard OS's
        var osMes = res['OS_MES']
        var dv2 = document.getElementById('divDashOs')
        dv2.style.height = '300px'

        if (osMes['valor'].length > 0) {
            var dashOs = document.createElement('canvas')
            dv2.innerHTML = ''

            mesesDash = osMes['dia']
            if (filterRes == 'ano') {
                mesesDash = []
                osMes['dia'].forEach(item => {
                    mesesDash.push(`${item} - ${mesesAbreviados[parseInt(item)]}`)
                })
            }


            new Chart(dashOs, {
                type: 'line',
                data: {
                    labels: mesesDash,

                    datasets: [{
                        data: osMes['cont'],
                        label: 'Total',
                        fill: {
                            target: 'origin',
                        },
                        borderWidth: 1,
                        borderColor: red,
                    }, {
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
                    aspectRatio: 0,
                    scales: {
                        x: {
                            beginAtZero: false
                        },
                        y: {
                            display: false
                        }
                    },
                    plugins: {
                        // title: {
                        //   display: true,
                        //   text: 'ORDENS - ' + filterRes.toUpperCase()
                        // }
                    },
                }
            })
            dv2.appendChild(dashOs)

        } else {
            dv2.textContent = "Sem dados!"
        }

        // Dashboard Pagamentos
        var pag = res['VENDA_PAGAMENTO']
        var dv3 = document.getElementById('divDashVendasPorTipo')
        dv3.style.height = '300px'

        if (pag['valor'].length > 0) {
            dv3.innerHTML = ''
            var pagDash = document.createElement('canvas')
            new Chart(pagDash, {
                type: 'doughnut',
                data: {
                    labels: pag['tipo'],

                    datasets: [{
                        data: pag['valor'],
                        label: 'Total R$',
                    }]
                }, options: {
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
            dv3.appendChild(pagDash)

        } else {
            dv3.textContent = "Sem dados!"
        }

    }
}

function trocarFiltroRes(t) {
    if (isValidDate(filterRes)) {
        var btnAntigo = document.getElementById(`btn-data`)
    } else {
        var btnAntigo = document.getElementById(`btn-${filterRes}`)
    }
    btnAntigo.classList.remove('btn-success')
    btnAntigo.classList.add('btn-outline-success')

    if (t.id == 'btn-periodo') {
        sessionStorage.setItem('filterRes', 'periodo')
    } else {
        sessionStorage.setItem('filterRes', t.value)
    }

    t.classList.add('btn-success')
    t.classList.remove('btn-outline-success')

    filterRes = sessionStorage.getItem('filterRes')
    if (t.value === 'ano') { get_infos('mês') }
    else { get_infos() }
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

// =============== Configurações
async function get_config() {
    const req = await request('config')
    const res = await req.json()
    if (req.ok) {
        var esc = document.getElementById('slEscala')

        document.getElementById('slFuso').value = res['fuso']
        document.getElementById('ckEstoque').checked = res['ct_es']
        document.getElementById('ckPeca').checked = res['pecas']
        document.getElementById('config_logo').classList.remove('placeholder')
        if (res.logo === "logo.png") {
            document.getElementById('config_logo').src = server + '/img/' + res['logo']
        } else {
            document.getElementById('config_logo').src = server + '/img/manager/' + res['logo']
        }

        document.getElementById('emailFx').value = res['email']
        document.getElementById('ckCaixa').checked = res['caixa']

        for (var x = 1; x < 51; x++) {
            const opt = document.createElement('option')
            opt.textContent = x
            esc.appendChild(opt)
        }
        esc.value = res['escala']

        res['funcs'].forEach(item => {
            const nome = item[0]
            const perm = item[1]
            const mat = item[2]
            const li = document.createElement('li')
            const sp = document.createElement('span')
            const btnRemove = document.createElement('button')
            const btnPmvAdmin = document.createElement('button')
            const btnGp = document.createElement('div')

            li.classList.add('list-group-item')
            li.classList.add('d-flex')
            li.classList.add('justify-content-between')

            if (perm !== 'ADMIN') {
                btnPmvAdmin.classList.add('btn')
                btnPmvAdmin.classList.add('btn-light')
                btnPmvAdmin.classList.add('btn-sm')
                btnPmvAdmin.innerHTML = '<i class="bi bi-unlock-fill"></i>'
                btnPmvAdmin.addEventListener('click', async function () {
                    var conf = confirm(`Deseja tornar ${capitalize(nome)} um ADMIN ?`)
                    if (conf) {
                        const req = await request("funcionarios", "PATCH", { "mat": mat })
                        const res = await req.json()
                        if (req.ok) {
                            location.reload()
                        } else { toast(res, 'erro') }
                    }
                })
                btnGp.appendChild(btnPmvAdmin)
            }

            btnRemove.classList.add('btn')
            btnRemove.classList.add('btn-danger')
            btnRemove.classList.add('btn-sm')
            btnRemove.innerHTML = '<i class="bi bi-trash-fill"></i>'
            btnRemove.addEventListener('click', async function () {
                var conf = confirm(`Deseja realmente excluir ${capitalize(nome)}?`)
                if (conf) {
                    const req = await request("funcionarios", "DELETE", { "mat": mat })
                    const res = await req.json()
                    if (req.ok) {
                        location.reload()
                    } else { toast(res, 'erro') }
                }

            })



            btnGp.classList.add('btn-group')

            sp.classList.add("fw-bold")
            if (perm === 'ADMIN') {
                sp.innerHTML = `<i class="bi bi-shield-fill-check"></i> ${mat} - ${nome}`
            } else {
                sp.innerHTML = `${mat} - ${nome}`
            }

            li.appendChild(sp)

            btnGp.appendChild(btnRemove)

            li.appendChild(btnGp)

            document.getElementById('listFuncs').appendChild(li)
        })

    }
}

function trocar_fuso(t) {
    var dd = {
        "value": t.value,
        "filter": "fuso"
    }
    request("config", "PATCH", dd)
}

async function alterar_estoque(t) {
    var dd = { "value": t.checked, "filter": "estoque" }

    const req = await request("config", "PATCH", dd)
    const res = await req.json()
    if (req.ok) { sessionStorage.setItem('estoque', t.checked); window.top.location.reload() }
    else { toast(res, 'erro') }

}

async function alterar_pecas(t) {
    var dd = { "value": t.checked, "filter": "peca" }

    const req = await request("config", "PATCH", dd)
    const res = await req.json()
    if (req.ok) { sessionStorage.setItem('pecas', t.checked); window.top.location.reload(); }
    else { toast(res, 'erro') }
}

async function modo_caixa(t) {
    var dd = { "value": t.checked, "filter": "caixa" }

    const req = await request("config", "PATCH", dd)
    const res = await req.json()
    if (req.ok) { location.reload(); }
    else { toast(res, 'erro') }
}

function trocar_escala(t) {
    var dd = { "value": t.value, "filter": "escala" }
    request("config", "PATCH", dd)
}

async function newFunc(t) {
    var name = document.getElementById('newFName').value
    var pwd = document.getElementById('newFPwd').value

    var dd = { "nome": name, "pwd": pwd }

    t.innerHTML = spinner
    const req = await request("funcionarios", "POST", dd)
    const res = await req.json()
    if (req.ok) {
        location.reload()
    } else { toast(res, 'erro') }
}

async function alterar_logo(t) {
    form = new FormData()

    form.append('logoImg', t.files[0])

    const req = await sendForm("atualizar_logo", form, "POST")
    const res = await req.json()
    if (req.ok) { window.top.location.reload() }
    else { toast(res, 'erro') }
}

async function alterar_email(t) {
    const email = document.getElementById('emailFx')

    if (email.value) {
        const dd = {
            "filter": "email",
            "value": email.value
        }
        t.innerHTML = spinner
        const req = await request("config", "PATCH", dd)
        const res = await req.json()
        if (req.ok) { location.reload() }
        else { toast(res, 'erro') }
    } else { toast('Email obrigatorio', 'erro') }
}

// ======================= Peças
async function get_pecas() {
    fetch(api + '/manager/api/v1/get_pecas/?cr=' + cr)
        .then(res => {
            res.json()
                .then(res => {
                    for (var x = 0; x < res.length; x++) {
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


// ======================= Modo Caixa
async function md_conferencia_cx() {
    const st = await statusCaixa()
    const stcx = document.getElementById('stcx')
    if (st.status) {
        stcx.textContent = 'CAIXA ABERTO'
        stcx.classList.remove("bg-danger")
        stcx.classList.add("bg-green")
    } else {
        stcx.textContent = 'CAIXA FECHADO'
        stcx.classList.remove("bg-green")
        stcx.classList.add("bg-danger")
    }
}

cx_total = localStorage.getItem('cx-total')
async function md_add_prod(t, ean = t.value, db = true) {
    if (ean) {
        const req = await request('produto', 'POST', { 'ean': ean })
        const res = await req.json()
        if (req.ok) {
            numItem += 1
            const id = res['id']
            const nome = res['nome']
            const valor = res['valor']
            const ean = res['ean']
            const quant = 1
            const total = valor * quant

            dd = {
                'idProd': id,
                'ean': ean,
                'nome': nome,
                'quantidade': quant,
                'valor': valor
            }

            const numtd = document.createElement('td')
            const idtd = document.createElement('td')
            const nometd = document.createElement('td')
            const quanttd = document.createElement('td')
            const valortd = document.createElement('td')
            const totaltd = document.createElement('td')

            numtd.textContent = numItem
            idtd.textContent = id
            nometd.textContent = nome
            valortd.textContent = to_real(valor)
            quanttd.textContent = quant
            totaltd.textContent = to_real(total)

            const tr = document.createElement('tr')
            const tb = document.getElementById('listProdBody')

            tr.appendChild(numtd)
            tr.appendChild(idtd)
            tr.appendChild(nometd)
            tr.appendChild(quanttd)
            tr.appendChild(valortd)
            tr.appendChild(totaltd)
            tb.appendChild(tr)

            document.getElementById('cxcdgbar').textContent = ean
            document.getElementById('cxvlr').textContent = to_real(valor)
            document.getElementById('cxttitem').textContent = to_real(quant * valor)
            document.getElementById('cxcdg').textContent = id
            document.getElementById('cxtotal').textContent = to_real(cx_total += total)

            if (db) { request('produto', 'PUT', dd) }
            md_cart.push(`${id}:${nome}`)
            t.value = ''
        } else { toast(res, 'erro'); t.value = '' }
    }
}

async function md_get_loja() {
    const req = await request("get_loja")
    const res = await req.json()
    if (req.ok) {
        console.log(res.logo);

        if (res.logo === 'logo.png') {
            document.getElementById('logoBase').src = server + '/img/' + res.logo
        } else {
            document.getElementById('logoBase').src = server + '/img/manager/' + res.logo
        }
    }
}

async function md_get_produtos() {
    const req = await request('produto')
    let res = await req.json()

    if (req.ok) {
        res.forEach(item => {
            md_add_prod('', item[0], false)
        })
    }
}

async function md_alter_caixa() {
    const st = await statusCaixa()
    if (st.status) {
        // fecha
        body = `
            <div class="d-flex flex-column gap-2">
                <div class="form-floating">
                    <input id="fecharMat" placeholder="Matricula" class="form-control" autofocus/>
                    <label for="fecharMat">Matricula</label>
                </div>
                <button class="btn btn-danger" type="button" onclick="fechar_caixa(this)">Fechar Caixa</button>
            </div>
        `
        modal = create_modal('modal_md_caixa', 'Fechar caixa!', body)
        modal.show()
    } else {
        // abre
        body = `
            <div class="d-flex flex-column gap-2">
                <div class="form-floating">
                    <input id="mattroco" placeholder="Matricula" onblur="conferTroco(this)" class="form-control" autofocus/>
                    <label for="mattroco">Matricula</label>
                </div>
                <div class="form-floating">
                    <input id="troco" placeholder="Troco" class="form-control money-mask" />
                    <label for="troco">Troco</label>
                </div>
                <button class="btn btn-success" id="btnAbrirCaixa" type="button" onclick="abrirCaixa(this)" disabled>Abrir</button>
            </div>
        `
        modal = create_modal('modal_md_caixa', 'Abrir caixa!', body)
        modal.show()
    }

}
// ==================================================  MODO CAIXA ATALHOS

if (window.location.pathname == "/manager/modo_caixa.html") {
    md_get_produtos()
    // Abrir caixa
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F10') {
            e.preventDefault()
            console.log('Abrir caixa')
            md_alter_caixa()
        } else { }
    })

    // Multiplicar Item
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F2') {
            e.preventDefault()
            console.log('Multiplicar')
        } else { }
    })

    // Receber
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F1') {
            e.preventDefault()
            console.log('Receber')
        } else { }
    })
}

// JQuery ==================================================
$(document).ready(function () {
    $("#busca").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#busca").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#buscarAbertas").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tbAbertas tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#buscaAll").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tbAll tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#buscaExp").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tbExp tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#searchClient").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#listClient li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#busca").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#busca").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

$(document).ready(function () {
    $("#buscaitem").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#listProd tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

// INPUTS MASKS
$(document).ready(function () {
    $(".tel-mask").inputmask("(99) 99999-9999");
});

$(document).ready(function () {
    $(".email-mask").inputmask("email");
});

$(document).ready(function () {
    $(".money-mask").inputmask("currency");
});

$(document).ready(function () {
    $(".cpf-mask").inputmask("999.999.999-99");
});
