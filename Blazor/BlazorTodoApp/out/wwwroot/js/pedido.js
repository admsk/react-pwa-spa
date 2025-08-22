async function enviarPedido() {
    const form = document.getElementById("pedidoForm");
    const dados = {
      produto: form.produto.value,
      quantidade: form.quantidade.value,
    };

    alert(dados.produto.value);
    
    const resposta = await fetch("/api/pedidos/enviar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (resposta.ok) {
      alert("Pedido enviado com sucesso!");
    } else {
      alert("Erro ao enviar o pedido.");
    }
  }