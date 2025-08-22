window.onload = function () {
    carregarProdutos();

    getUserLocation();
};

const userLocation = { latitude: null, longitude: null, mapsLink: null };


function carregarProdutos() {

    const selectProdutos = document.getElementById("produtos");
    // selectProdutos.innerHTML = ''

    const listaProdutos = [
        { id: '0', nome: 'Selecione o Produto', preco: 0.00 },
        { id: '1', nome: 'Pão Francês', preco: 3.00 },
        { id: '2', nome: 'Bolo de Milho Natural', preco: 20.00 }
    ];

    listaProdutos.forEach(produto => {
        const option = document.createElement("option");
        option.value = produto.id;
        option.textContent = produto.nome;
        option.setAttribute("data-preco", produto.preco.toFixed(2));

        if (produto.id === '0') {
            option.selected = true;
            option.disabled = true;
        }
        if (selectProdutos != null)
            selectProdutos.appendChild(option);
    });

}

//Ajustes na função
function isWeekend() {
    const dataEntrega = document.getElementById('data');
    const valor = dataEntrega?.value?.trim();

    if (!valor) {
        showAlert("Por favor, selecione uma data válida.");
        return true;
    }

    const parts = valor.split("-");
    const dataLocal = new Date(parts[0], parts[1] - 1, parts[2]); // YYYY, MM (0-based), DD
    const dayOfWeek = dataLocal.getDay();

    console.log("Data corrigida:", dataLocal.toString());
    console.log("Dia da semana:", dayOfWeek);

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        showAlert("Lamentamos informar que não estaremos atendendo nesta data.");
        return true;
    }

    return false;
}


function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                userLocation.latitude = latitude;
                userLocation.longitude = longitude;
                userLocation.mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
            },
            error => alert("Não foi possível obter sua localização.")
        );
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
}

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.color = type === 'error' ? 'red' : 'green';
    messageElement.style.display = 'block';

    setTimeout(() => messageElement.style.display = 'none', 5000);
}

function toggleSubmitButton() {
    const checkbox = document.getElementById('acceptTerms');
    const button = document.getElementById('enviar');
    button.disabled = !checkbox.checked;

    if (checkbox.checked) {
        button.disabled = false;
        button.style.backgroundColor = "#6C9A8B";
    } else {
        button.disabled = true;
        button.style.backgroundColor = "#B7C7C0";
    }
}

function entregaPostergada() {

    const selectProduto = document.getElementById('produtos');



    selectProduto.addEventListener('input', function () {
        console.log("Selecionado:", this.value);

    });

}

function atualizaData() {

    const dataEntrega = document.getElementById('data');

    const dataAtual = new Date();

    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');

    const dataFormatada = `${ano}-${mes}-${dia}`;

    dataEntrega.value = dataFormatada;


}


function alterarLabelBtn(texto, desablitar = true) {
    const btnSubmit = document.getElementById('enviar');
    btnSubmit.textContent = texto;
    btnSubmit.disabled = desablitar;
}

function showError(message) {
    const errorMessage = document.getElementById('message');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'block';

    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successMessage = document.getElementById('message');

    successMessage.textContent = message;
    successMessage.style.display = 'block';
    successMessage.style.color = 'green';
    successMessage.style.backgroundColor = '#d4edda';
    successMessage.style.padding = '10px';
    successMessage.style.border = '1px solid #c3e6cb';
    successMessage.style.borderRadius = '5px';

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 20000);
}

function showAlert(message) {
    const successMessage = document.getElementById('message');

    successMessage.textContent = message;
    successMessage.style.display = 'block';
    successMessage.style.color = 'orange';
    successMessage.style.backgroundColor = '#d4edda';
    successMessage.style.padding = '10px';
    successMessage.style.border = '1px solid #c3e6cb';
    successMessage.style.borderRadius = '5px';

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 20000);
}



function adicionarProduto() {
    const selectProduto = document.getElementById("produtos");
    const selectQuantidade = document.getElementById("quantidade");
    const tabela = document.getElementById("tabelaProdutos").getElementsByTagName("tbody")[0];


    const nomeProduto = selectProduto.options[selectProduto.selectedIndex].text;
     
    if (nomeProduto == "Selecione o Produto") {
        showMessage("Você precisa selecionar um produto!", 'error');
        return false;
    }

    const precoUnitario = parseFloat(selectProduto.options[selectProduto.selectedIndex].getAttribute("data-preco"));
    const quantidade = parseInt(selectQuantidade.value);

    if (Number.isNaN(quantidade)) {
        showMessage("Você precisa selecionar uma quantidade!", 'error');
        return false;
    }

    if (quantidade === 0) return;

    const total = (precoUnitario * quantidade).toFixed(2);

    // Verifica se o produto já existe na tabela
    const linhas = tabela.getElementsByTagName("tr");
    let produtoExistente = false;

    for (let i = 0; i < linhas.length; i++) {
        const celulaProduto = linhas[i].cells[0];
        if (celulaProduto && celulaProduto.innerText === nomeProduto) {
            produtoExistente = true;
            break;
        }
    }

    if (produtoExistente) return;

    // Se não existe, adiciona nova linha
    const novaLinha = tabela.insertRow();
    novaLinha.insertCell(0).innerText = nomeProduto;


    const colunaQtde = novaLinha.insertCell(1);
    const textQtde = document.createElement("span");
    textQtde.className = "content-center";
    textQtde.innerText = quantidade;

    colunaQtde.appendChild(textQtde);

    novaLinha.insertCell(2).innerText = `${total}`;

    const celulaAcoes = novaLinha.insertCell(3);
    const iconeRemover = document.createElement("span");
    iconeRemover.className = "oi oi-trash content-center";

    iconeRemover.setAttribute("aria-hidden", "true");
    iconeRemover.style.cursor = "pointer";
    iconeRemover.style.color = "red";

    iconeRemover.onclick = function () {
        tabela.deleteRow(novaLinha.rowIndex - 1);
    };

    celulaAcoes.appendChild(iconeRemover);


    atualizarTotalGeral();

    const resultado = obterProdutosDoCarrinho()
        .map(p => `${p.quantidade} ${p.nome}  = ${p.total.toFixed(2)}`)
        .join('\n');

    if (resultado.includes('Bolo')) {
        Swal.fire({
            icon: 'info',
            title: 'Atenção!',
            html: `
                <p>O <strong>Bolo de Milho</strong> é natural e artesanal, feito sob encomenda. 
                Por isso, a entrega precisa ser agendada com pelo menos um dia de antecedência.
                </p>
                <p>Quer combinar um horário certinho? Fale com a gente pelo WhatsApp:</p> <p>📲 (11) 98486-2560</p>
                <p>Caso não entre em contato, ele será entregue com no mínimo 24h depois do pedido!</p>`,
            confirmButtonText: 'Entendido!'
        }).then(() => {
            console.log("O Bolo de Milho será entregue em 1 dia.");
        });
    }


}
function atualizarTotalGeral() {

    const tabela = document.getElementById("tabelaProdutos");

    let soma = 0;

    for (let i = 0; i < tabela.rows.length; i++) {

        if (i > 0) {
            const total = parseFloat(tabela.rows[i].cells[2].innerText.replace('R$', ''));
            soma += total;

        }
    }

    document.getElementById("total").value = `Total Geral: R$ ${soma.toFixed(2)}`;
}

function obterProdutosDoCarrinho() {
    const linhas = document.querySelectorAll("#tabela-pedido tbody tr");
    const produtos = [];

    const tabela = document.getElementById("tabelaProdutos");

    let soma = 0;

    for (let i = 0; i < tabela.rows.length; i++) {

        if (i > 0) {
            const nome = tabela.rows[i].cells[0].innerText;
            const quantidade = parseInt(tabela.rows[i].cells[1].innerText);
            const total = parseFloat(tabela.rows[i].cells[2].innerText);

            produtos.push({ nome, quantidade, total });
        }
    }

    return produtos;
}


function validar() {

    const form = document.getElementById("pedidoForm");
    const checkbox = document.getElementById('acceptTerms');

    const tabela = document.getElementById("tabelaProdutos");

    if (tabela.rows.length === 1) {
        showMessage('Você precisa adicionar pelo menos um produto!', 'error');
        return false;
    }

    if (!checkbox.checked) {
        showMessage("Você precisa aceitar os termos!", 'error');
        return false;
    }

    if (!form.nome.value.trim() || !form.endereco.value.trim() || !form.quantidade.value.trim() || !form.total.value.trim()) {
        showMessage("Preencha todos os campos obrigatórios!", 'error');
        return false;
    }

    if (form.endereco.value == "bl-apt") {
        showMessage('Selecione o seu Bloco e apartamento!', 'error');
        return false;
    }


    if (isWeekend()) return;

    return true;
}

function calcularTotalGeral() {
    const produtos = obterProdutosDoCarrinho();
    return produtos.reduce((acc, item) => acc + item.total, 0).toFixed(2);
}

function calcularQuantidadeProdutos() {
    const produtos = obterProdutosDoCarrinho();
    return produtos.reduce((acc, item) => acc + item.quantidade, 0);
}

async function enviarPedido(event) {

    event.preventDefault();

    if (!validar()) return;


    const form = document.getElementById("pedidoForm");
    const checkbox = document.getElementById('acceptTerms');

    const resultado = obterProdutosDoCarrinho()
        .map(p => `${p.quantidade} ${p.nome}  = ${p.total.toFixed(2)}`)
        .join('\n');

    const pedido = {
        contato: form.contato.value.trim(),
        dataEntrega: form.data.value || new Date().toISOString().split("T")[0],
        latitude: userLocation.latitude != null ? `${userLocation.latitude}` : "",
        localEntrega: form.endereco.value.trim(),
        longitude: userLocation.longitude != null ? `${userLocation.longitude}` : "",
        mapsLink: userLocation.mapsLink != null ? userLocation.mapsLink : "",
        nome: form.nome.value.trim(),
        pagamento: "Indefinido",
        produto: resultado,
        quantidade: calcularQuantidadeProdutos(),
        termoAceite: checkbox.checked,
        total: calcularTotalGeral()
    };

    try {
        alterarLabelBtn("Enviando...");

        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido),
        });

        if (response.ok) {
            showSuccess(
                "Pedido enviado com sucesso. Aguarde, seu pedido está a caminho. Qualquer dúvida, nos informe através do nosso WhatsApp."
            );
            alterarLabelBtn("Enviar Pedido", false);
            form.reset();

            const tabela = document.getElementById("tabelaProdutos");
            // Remove todas as linhas, exceto a primeira (cabeçalho)
            while (tabela.rows.length > 1) {
                tabela.deleteRow(1);
            }
        } else {
            showError("Erro ao enviar o pedido. Tente novamente. Certifique-se de que todos os dados estejam preenchidos!");
            alterarLabelBtn("Enviar Pedido", false);
        }
    } catch (error) {
        console.error("Erro ao enviar pedido:", error);
        showError("Erro ao enviar o pedido. Verifique sua conexão.");
        alterarLabelBtn("Enviar Pedido", false);
    }

    // Simulação de envio de pedido (por exemplo, uma chamada de API)
    console.log(pedido);
}
