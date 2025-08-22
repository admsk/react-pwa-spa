using System.Globalization;
using System.Linq.Expressions;
using System.Net.Http.Headers;
using System.Text;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using Newtonsoft.Json;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace QueroPao.Controllers
{
    [ApiController]
    [Route("api/pedidos")]
    public class PedidosController : ControllerBase
    {
        [HttpPost]
        public IActionResult EnviarPedido([FromBody] PedidoDto pedido)
        {
            try
            {
                // Configurar o e-mail liliamendesgs@gmail.com
                var mensagem = new MimeMessage();
                mensagem.From.Add(new MailboxAddress("ALK", "liliamendesgs@gmail.com"));
                mensagem.To.Add(new MailboxAddress("Destinatário", "liliamendesgs@gmail.com"));
                mensagem.Subject =
                    $"[Quero Pão] - Novo Pedido: {pedido.Nome} - {pedido.DataEntrega}";

                var aceitou = pedido.TermoAceite ? "Sim" : "Não";

                mensagem.Body = new TextPart("html")
                {
                    Text =
                        $@"
                <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.5; color: #333;'>
                    <h2 style='color: #007BFF;'>Detalhes do Pedido</h2>
                    <p><strong>Nome:</strong> {pedido.Nome}</p>
                    <p><strong>Contato:</strong> {pedido.Contato}</p>
                    <p><strong>Local de entrega:</strong> {pedido.LocalEntrega}</p>
                    <p><strong>Data de entrega:</strong> {pedido.DataEntrega}</p>
                    <p><strong>Produto(s):</strong> {pedido.Produto}</p>
                    <p><strong>Quantidade:</strong> {pedido.Quantidade}</p>
                    <p><strong>Aceitou os termos:</strong> {(pedido.TermoAceite ? "Sim" : "Não")}</p>
                    <p><strong>Total:</strong> R$ {pedido.Total}</p>
                    <p><strong>Localização:</strong></p>
                    <ul>
                        <li><strong>Latitude:</strong> {pedido.Latitude}</li>
                        <li><strong>Longitude:</strong> {pedido.Longitude}</li>
                    </ul>
                    <p><a href='{pedido.MapsLink}' style='color: #007BFF;'>Abrir no Google Maps</a></p>
                </body>
                </html>",
                };

                // Enviar o e-mail
                using var cliente = new SmtpClient();
                cliente.Connect(
                    "smtp.gmail.com",
                    587,
                    MailKit.Security.SecureSocketOptions.StartTls
                );

                cliente.Authenticate("adrianomendes28@gmail.com", "yjcb hbku ubqg zxds");
                cliente.Send(mensagem);
                cliente.Disconnect(true);

                _ = SalvaNoSharePointAsync(pedido);

                return Ok("E-mail enviado com sucesso!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao enviar o e-mail: {ex.Message}");
            }
        }

        public string SerializarPedido(PedidoDto pedido)
        {
            var serializer = new JsonSerializer();

            using (var stringWriter = new StringWriter())
            {
                serializer.Serialize(stringWriter, pedido);
                return stringWriter.ToString();
            }
        }

        private async Task SalvaNoSharePointAsync(PedidoDto item)
        {
            var httpClient = new HttpClient();

            try
            {
                var pedido = new PedidoDto
                {
                    Nome = item.Nome,
                    LocalEntrega = item.LocalEntrega,
                    DataEntrega = DateTime
                        .Parse(item.DataEntrega, new CultureInfo("pt-BR"))
                        .ToString("yyyy-MM-ddT00:00:00.001Z"),
                    Produto = item.Produto,
                    Quantidade = item.Quantidade,
                    TermoAceite = true,
                    Latitude = item.Latitude,
                    Longitude = item.Longitude,
                    Total = item.Total,
                };

                var content = new StringContent(
                    SerializarPedido(pedido),
                    Encoding.UTF8,
                    "application/json"
                );

                var credentials = Convert.ToBase64String(
                    Encoding.UTF8.GetBytes(
                        $"nvs:90D9C01E621918F19990C7DEFBA6176700BBCCA05D6116F7FA79737B6B5AC9F9"
                    )
                );

                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                    "Basic",
                    credentials
                );

                var response = await httpClient.PostAsync(
                    "https://nvs-api.azurewebsites.net/api/v1/Pedido/NovoPedido",
                    content
                );

                Console.WriteLine(content);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Pedido enviado com sucesso.");
                }
                else
                {
                    Console.WriteLine($"Erro ao enviar o pedido: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }

    // DTO para receber os dados do formulário
    public class Message
    {
        public string Telefone { get; set; }
        public string Messagem { get; set; }
    }

    public class PedidoDto
    {
        public string Nome { get; set; }
        public string LocalEntrega { get; set; }
        public string Produto { get; set; }
        public int Quantidade { get; set; }
        public string DataEntrega { get; set; }
        public bool TermoAceite { get; set; }
        public string Contato { get; set; }
        public string Pagamento { get; set; }
        public string Total { get; set; }

        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string MapsLink { get; set; }
    }
}
