const cr = sessionStorage.getItem('cr')
const vendas = document.getElementById('chartVendas');
const vendasdia = document.getElementById('vendasPorDia');
const vendasCateg = document.getElementById('cartCateg')

if(vendas){
    fetch('/vendas_por_tipo/'+ cr)
    .then((res)=>{
        if(res.ok){
            res.json().then((js)=>{
                const total = js['total']
                const tipo = js['tipos']
                new Chart(vendas, {
                    type: 'pie',
                    data: {
                    labels: tipo,
                    datasets: [{
                        data: total,
                        label: 'R$',
                        borderWidth: 1
                    }]
                    },
                    options: {
                    indexAxis: 'y',
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                          display: true,
                          text: 'Vendas por Pagamento'
                        }
                    },
                }
                });
            })
        }
    })
}

if(vendasdia){
    fetch('/vendas_dia/'+cr).then((res=>{
        res.json().then((res)=>{
            const dias = res['dias']
            const quant = res['quantidade']
            const total = res['total']
            new Chart(vendasPorDia, {
                type: 'line',
                data: {
                labels: dias,
                datasets: [
                    {
                    label: 'R$',
                    data: total,
                    backgroundColor: '#5E8B60',
                    borderColor: '#5E8B60',
                    borderWidth: 2,
                },{
                    label: 'Quantidade',
                    hidden: true,
                    data: quant,
                    backgroundColor: '#a3b18a',
                    borderColor: '#a3b18a',
                    borderWidth: 2,

                }]
                },
                options: {
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                responsive: true,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                    },
                }}
            });
        })
    }))
}

if(vendasCateg){
    fetch('/vendas_por_categoria')
    .then(res=>{
        res.json().then(res=>{
            new Chart(vendasCateg, {
                type: 'bar',
                data: {
                labels: ['AGUAS','BISCOITO'],
                datasets: [{
                    data: [2, 1],
                    label: 'Quantidade: ',
                    backgroundColor: '#5E8B60',
                    borderColor: '#5E8B60',
                    borderWidth: 1
                }]
                },
                options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                      display: true,
                      text: 'Vendas por Categorias!'
                    }
                },
            }
            });
        })
    })
}