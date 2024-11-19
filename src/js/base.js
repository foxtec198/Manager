
const cr = sessionStorage.getItem('cr')
const mat = sessionStorage.getItem('mat')

try{fetch('/get_config/').then(res=>{
    if(res.ok){
        res.json().then(res=>{
            var imp = res[0][1]
            var ped = res[0][2]
            var cmds = res[0][3]
            var es = res[0][4]
            if(ped === false){
                document.getElementById('pedbtn').hidden = 'none'
                document.getElementById('pedbtn2').hidden = 'none'
            }
            if(cmds === false){
                document.getElementById('cmdsbtn').hidden = 'none'
                document.getElementById('cmdsbtn2').hidden = 'none'
            }
            sessionStorage.setItem('estoque', es)
            sessionStorage.setItem('pedido', ped)
            sessionStorage.setItem('imp', imp)
        })
    }
})}catch{}

function btnBack(){
    document.getElementById('side1').hidden = 'none'
    document.getElementById('side2').hidden = ''
}
function btnGo(){
    document.getElementById('side1').hidden = ''
    document.getElementById('side2').hidden = 'none'
}
function levarPedido(cmd){
    fetch('/gourmet/levar/' + sessionStorage.getItem('cr') + '/' + cmd).then((res)=>{
        if(res.ok){
            document.location = '/gourmet/pedidos/'+sessionStorage.getItem('cr')
        }else{
            toastHbx(res.statusText)
        }
    })
}
function cancelarPedido(cmd){
    fetch('/gourmet/cancelar/' + sessionStorage.getItem('cr') + '/' + cmd).then((res)=>{
        if(res.ok){
            document.location = '/gourmet/pedidos/'+sessionStorage.getItem('cr')
        }
    })
}
function fecharComanda(cmd){
    document.location = '/gourmet/cmd/'  + sessionStorage.getItem('cr') + '/' + cmd
}
function cancelarComanda(cmd){
    document.location = '/gourmet/cancelar_cmd/' + cmd
}
function garcom_mode(){
    document.location = '/gourmet/g/' + sessionStorage.getItem('mat') + '/' + sessionStorage.getItem('cr')
}
function toasthbx(msg){
    const toastHbx = document.getElementById('tstHbx')
    const tst = bootstrap.Toast.getOrCreateInstance(toastHbx)
    document.getElementById('msgToast').textContent = msg
    tst.show()
}
function nova_venda(){
    document.location = '/gourmet/vender/' + sessionStorage.getItem('mat') + '/' + sessionStorage.getItem('cr')
}
function cancelar_venda(id){
    fetch('/cancelar_venda/' + id).then((res)=>{
        if(res.ok){
            document.location = '/gourmet/vendas/' + sessionStorage.getItem('cr')
        }
    })
}
function remove_prod(id){
    fetch('/remover_prod/'+id,{'method':'POST'}).then((res)=>{
        if(res.ok){
            toasthbx('Excluido com sucesso')
            document.location = '/gourmet/estoque/'+sessionStorage.getItem('cr')
        }
    })
}
function add_categ(){
    const ctg = document.getElementById('categIn').value
    if (ctg){
        fetch('/add_categ/'+[ctg, sessionStorage.getItem('gc'), sessionStorage.getItem('cr')], {'method':'POST'}).then((res)=>{
            if(res.ok){
                const rest = ctg + ' cadastrado com sucesso'
                toasthbx(rest)
                document.location = '/gourmet/estoque/' + cr

            }
        })
    }else{
        toasthbx('Selecione um nome de categoria valido!')
    }
}
function remove_categ(id){
    if(id){
        fetch('/remove_categ/'+id,{'method':'POST'}).then((res)=>{
            if(res.ok){
                toasthbx('Excluida com sucesso!')
                document.location = '/gourmet/estoque/' + cr
            }
        })
    }else{
        toasthbx('Id invalido!')
    }
}
function sair(){
    document.location = '/gourmet/'
}
function salvar_configs(){
    var imp = document.getElementById('imp').checked
    var ped = document.getElementById('ped').checked
    var cmds = document.getElementById('cmds').checked
    var es = document.getElementById('es').checked
    var config = [imp, ped, cmds, es]
    fetch('/salvar_config/' + config, {method:'POST'}).then(res=>{
        if(res.ok){
            console.log(res)
            document.location = '/gourmet/config/'+cr   
        }
    })
}
function removeFunc(mat){
    fetch('/remove_func?mat='+mat, {method:'POST'}).then(res=>{
        if(res.ok){
            location.reload();
        }
    })
}
function adminFunc(mat){
    fetch('/admin_func?mat='+mat, {method:'POST'}).then(res=>{
        if(res.ok){
            location.reload();
        }
    })
}
// function exDia(){
//     fetch('/exportar_vendas_dia')
//     .then({
        
//     })
// }