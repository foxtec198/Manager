# Guia de Integração API - Manager

## 📋 Resumo da Integração

Foram criados **12 novos Models** e **12 novos Services** para integração completa com os 16 BPs da API. Além disso, 2 Models existentes (products, sales) foram atualizados com CRUD completo.

## 📦 Modelos Implementados

### Core / Sem dependências
- ✅ **CategoryModel** → categorias_service.js
- ✅ **BrandModel** → brands_service.js
- ✅ **ProviderModel** → providers_service.js

### RH & Operações
- ✅ **EmployeeModel** → employees_service.js
- ✅ **OrderModel** → orders_service.js
- ✅ **InvoiceModel** → invoices_service.js

### Financeiro
- ✅ **ReleaseModel** → releases_service.js
- ✅ **PartsModel** → parts_service.js
- ✅ **ConfigModel** → config_service.js

### Utilidades
- ✅ **StoreModel** → (API geral)
- ✅ **FileModel** → file_service.js
- ✅ **EmailModel** → email_service.js

### Atualizados
- ✅ **ProductModel** - Agora com POST, PATCH, DELETE
- ✅ **SalesModel** - Agora com POST, PATCH, DELETE

---

## 🎯 Como Usar em Telas HTML

### Padrão Geral para Tabelas CRUD

#### 1. **Em scripts da página HTML, importe o service:**

```html
<script type="module">
    import { setCategoryTable, createCategory, updateCategory } from "./assets/js/services/categories_service.js"
    
    // Ao carregar página
    window.addEventListener('load', () => {
        setCategoryTable()
    })
</script>
```

#### 2. **Crie um elemento com data-api para tabela:**

```html
<div data-api="categories"></div>
```

#### 3. **Crie um formulário:**

```html
<form id="categoryForm">
    <input type="hidden" id="categoryId">
    <input type="text" id="categoryName" placeholder="Nome" required>
    <textarea id="categoryDesc" placeholder="Descrição"></textarea>
    <button type="submit" id="submitCategoryBtn">Criar Categoria</button>
</form>

<script type="module">
    import { createCategory, updateCategory } from "./assets/js/services/categories_service.js"
    
    document.getElementById('categoryForm').addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const id = document.getElementById('categoryId').value
        const formData = {
            nome: document.getElementById('categoryName').value,
            descricao: document.getElementById('categoryDesc').value
        }
        
        if (id) {
            await updateCategory(id, formData)
        } else {
            await createCategory(formData)
        }
    })
</script>
```

---

## 📋 Funções Disponíveis por Service

### categories_service.js
```javascript
setCategoryTable(filter)     // Carregar tabela de categorias
createCategory(formData)     // Criar nova categoria
updateCategory(id, formData) // Atualizar categoria
window.edit_category(id)     // Editar (chamado por botão)
window.delete_category(id)   // Deletar (chamado por botão)
```

### brands_service.js
```javascript
setBrandTable(filter)        // Carregar tabela de marcas
createBrand(formData)        // Criar nova marca
updateBrand(id, formData)    // Atualizar marca
window.edit_brand(id)        // Editar
window.delete_brand(id)      // Deletar
```

### providers_service.js
```javascript
setProviderTable(filter)     // Carregar tabela de fornecedores
createProvider(formData)     // Criar novo fornecedor
updateProvider(id, formData) // Atualizar fornecedor
window.edit_provider(id)     // Editar
window.delete_provider(id)   // Deletar
```

### employees_service.js
```javascript
setEmployeeTable(filter)     // Carregar tabela de funcionários
createEmployee(formData)     // Criar novo funcionário
updateEmployee(id, formData) // Atualizar funcionário
window.edit_employee(id)     // Editar
window.delete_employee(id)   // Deletar
```

### orders_service.js
```javascript
setOrderTable(filter)        // Carregar tabela de ordens
createOrder(formData)        // Criar nova ordem
updateOrder(id, formData)    // Atualizar ordem
window.edit_order(id)        // Editar
window.delete_order(id)      // Deletar
```

### invoices_service.js
```javascript
setInvoiceTable(filter)      // Carregar tabela de notas fiscais
createInvoice(formData)      // Criar nova NF
updateInvoice(id, formData)  // Atualizar NF
window.edit_invoice(id)      // Editar
window.delete_invoice(id)    // Deletar
```

### releases_service.js
```javascript
setReleaseTable(filter)      // Carregar tabela de saídas
createRelease(formData)      // Criar nova saída
updateRelease(id, formData)  // Atualizar saída
window.edit_release(id)      // Editar
window.delete_release(id)    // Deletar
```

### parts_service.js
```javascript
setPartsTable(filter)        // Carregar tabela de peças
createParts(formData)        // Criar nova peça
updateParts(id, formData)    // Atualizar peça
window.edit_parts(id)        // Editar
window.delete_parts(id)      // Deletar
```

### config_service.js
```javascript
loadConfig()                 // Carregar configurações
saveConfig(formData)         // Salvar nova config
updateConfig(id, formData)   // Atualizar config
```

### file_service.js
```javascript
uploadFile(file)             // Upload de arquivo
downloadFile(path)           // Download de arquivo
deleteFile(id)               // Deletar arquivo
```

### email_service.js
```javascript
sendEmail(emailData)         // Enviar email
```

---

## 🔧 Models (Camada de Dados)

Cada Model encapsula requisições HTTP para um endpoint específico:

### Exemplo: CategoryModel

```javascript
import { CategoryModel } from "../models/categories.js"

const model = new CategoryModel()

// GET - Listar categorias
const req1 = await model.get()
const categories = await req1.json()

// GET com filtro
const req2 = await model.get("id=5")
const filtered = await req2.json()

// POST - Criar
const req3 = await model.set({ nome: "Nova", descricao: "..." })
const result = await req3.json()

// PATCH - Atualizar
const req4 = await model.update(5, { nome: "Atualizado" })
const updated = await req4.json()

// DELETE - Remover
const req5 = await model.delete(5)
const deleted = await req5.json()
```

---

## 📝 Endpoints API Mapeados

| Service | Endpoint | Método |
|---------|----------|--------|
| categories_service | /api/manager/categorias | GET, POST, PATCH, DELETE |
| brands_service | /api/manager/marcas | GET, POST, PATCH, DELETE |
| providers_service | /api/manager/fornecedores | GET, POST, PATCH, DELETE |
| employees_service | /api/manager/funcionarios | GET, POST, PATCH, DELETE |
| orders_service | /api/manager/os | GET, POST, PATCH, DELETE |
| invoices_service | /api/manager/nnf | GET, POST, PATCH, DELETE |
| releases_service | /api/manager/saidas | GET, POST, PATCH, DELETE |
| parts_service | /api/manager/pecas | GET, POST, PATCH, DELETE |
| config_service | /api/manager/config | GET, POST, PATCH |
| file_service | /api/files | GET, POST, DELETE (general) |
| email_service | /api/email | POST (general) |
| products_service | /api/manager/produtos | GET, POST, PATCH, DELETE |
| sales_service | /api/manager/vendas | GET, POST, PATCH, DELETE |

---

## 🔐 Autenticação

Todos os requests usam token automaticamente via `ApiRequest`:

```javascript
// O token é recuperado de: sessionStorage.access_token
// Headers incluem: Content-Type: application/json, Access-Token: {token}
// Tratamento automático de token expirado (401 → redirect login)
```

---

## 🚀 Exemplo Completo: Página de Categorias

**categories.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Categorias</title>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <div class="container">
        <h1>Gerenciar Categorias</h1>
        
        <!-- Formulário -->
        <form id="categoryForm" class="mb-4">
            <input type="hidden" id="categoryId">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="categoryName" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Descrição</label>
                <textarea id="categoryDesc" class="form-control"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" id="submitCategoryBtn">Criar</button>
            <button type="button" class="btn btn-secondary" id="resetCategoryBtn">Limpar</button>
        </form>
        
        <!-- Tabela -->
        <div data-api="categories"></div>
    </div>

    <script type="module">
        import { setCategoryTable, createCategory, updateCategory } from "/assets/js/services/categories_service.js"
        
        // Carregar tabela ao iniciar
        window.addEventListener('load', () => setCategoryTable())
        
        // Formulário submit
        document.getElementById('categoryForm').addEventListener('submit', async (e) => {
            e.preventDefault()
            const formData = {
                nome: document.getElementById('categoryName').value,
                descricao: document.getElementById('categoryDesc').value
            }
            const id = document.getElementById('categoryId').value
            
            if (id) {
                await updateCategory(id, formData)
            } else {
                await createCategory(formData)
            }
            document.getElementById('categoryForm').reset()
        })
        
        // Reset
        document.getElementById('resetCategoryBtn').addEventListener('click', () => {
            document.getElementById('categoryForm').reset()
            document.getElementById('categoryId').value = ""
            document.getElementById('submitCategoryBtn').textContent = "Criar"
        })
    </script>
</body>
</html>
```

---

## ✅ Checklist de Testes

Para testar uma integração completa:

- [ ] Login funciona e token é armazenado
- [ ] Página carrega dados com GET
- [ ] Formulário cria novo registro com POST
- [ ] Botão Edit carrega dados e permite PATCH
- [ ] Botão Delete remove registro
- [ ] Toast notifications aparecem
- [ ] Tabela se atualiza após cada operação
- [ ] Console sem erros (F12)
- [ ] Headers incluem token (F12 → Network)

---

## 📦 Arquivos Criados

**Models (12 novos):**
- `/assets/js/models/categories.js`
- `/assets/js/models/brands.js`
- `/assets/js/models/providers.js`
- `/assets/js/models/employees.js`
- `/assets/js/models/orders.js`
- `/assets/js/models/invoices.js`
- `/assets/js/models/releases.js`
- `/assets/js/models/parts.js`
- `/assets/js/models/config.js`
- `/assets/js/models/stores.js`
- `/assets/js/models/files.js`
- `/assets/js/models/email.js`

**Services (12 novos):**
- `/assets/js/services/categories_service.js`
- `/assets/js/services/brands_service.js`
- `/assets/js/services/providers_service.js`
- `/assets/js/services/employees_service.js`
- `/assets/js/services/orders_service.js`
- `/assets/js/services/invoices_service.js`
- `/assets/js/services/releases_service.js`
- `/assets/js/services/parts_service.js`
- `/assets/js/services/config_service.js`
- `/assets/js/services/file_service.js`
- `/assets/js/services/email_service.js`

**Atualizados:**
- `/assets/js/models/products.js` - CRUD completo
- `/assets/js/models/sales.js` - CRUD completo
- `/assets/js/main.js` - Imports dos novos services

---

## 🎯 Próximos Passos

1. Abrir as telas HTML e adicionar elementos com `data-api="..."` correspondentes
2. Importar os services em cada página
3. Chamar as funções de carregamento de tabelas ao iniciar
4. Conectar formulários aos métodos create/update
5. Testar CRUD completo em cada tela
6. Verificar console para erros
7. Validar tokens nos headers (F12 → Network)

---

## 💡 Dicas Importantes

1. **Grid.js**: Tabelas são renderizadas com Grid.js, suportam paginação automática
2. **Toast Notifications**: Use `show_toast(msg)` para sucesso e `show_toast(msg, "danger")` para erros
3. **Loading State**: Use `is_loading(true/false)` para feedback visual durante requisições
4. **API Geral**: Endpoints `/api/lojas`, `/api/email`, `/api/files` usam `type: "general"` nos Models
5. **Filtros**: Passar `"id=5"` ou `"name=test"` como filter para GET personalizado

✅ **Integração API completa pronta para uso!**
