class PosModel {
    async status (){ // Função para status do caixa
        request.path = "caixa"
        request.method = "GET"
        return await request.send()
    }

    async open(mat, value){ // Função para abertura do caixa
        request.path = "caixa"
        request.method = "POST"
        request.data = {mat: mat, valor: value}
        return await request.send()
    }

    async append(mat, value){ // Função para adicionar valor ao caixa
        request.path = "caixa"
        request.method = "PATCH"
        request.data = {mat:mat, valor: value}
        return await request.send()
    }

    async close(mat){ // Função para fechar o caixa
        request.path = "caixa"
        request.method = "DELETE"
        request.data = {mat: mat}
        return await request.send()
    }

    async last_closed() {
        request.path = "caixa/last_closed"
        request.method = "GET"
        return await request.send()
    }
}