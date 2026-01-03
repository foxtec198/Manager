let activeInput = null; // Confere se o input esta ativo ou nao

// ============================================================ NUMERIC KEYBOARD ==============================================
function create_numeric_keyboard() {
    
}

function openNumericKeyboard(input) { // Função responsavel por abrir o keyboard
    activeInput = input;
    // document.getElementById('numeric-keyboard').classList.remove('hidden');
    create_modal_keyboard("modal_keyboard", "Adicione o valor pago").show()
}

function closeNumericKeyboard() { // Função responsavel por fechar o keyboard
    document.getElementById('numeric-keyboard').classList.add('hidden');
    activeInput = null;
}

document.querySelectorAll('#numeric-keyboard button').forEach(btn => { // Logica para que o item funcione ao clicar
    btn.addEventListener('click', () => {
        if (!activeInput) return; // Se o input nao estiver ativo, apenas passa
        const key = btn.dataset.key; // Obtem p dataset key do objeto
        // Confirma se clicou no clear
        if (key === 'clear') { 
            activeInput.value = '';
            return;
        }
        
        // Confirma se clicou no backspace
        if (key === 'back') {
            activeInput.value =
            activeInput.value.slice(0, -1);
            return;
        }
        
        // Em nenhum dos casos acima somente adiciona o numero
        activeInput.value += key;
    });
});

// ============================================================  EVENTOS DE INPUTS ==============================================

const inputteste = document.getElementById('valorAA');
inputteste?inputteste.addEventListener('click', (e) => {
    e.preventDefault();
    inputteste.blur();
    openNumericKeyboard(inputteste);
}):null