# Etapa 1: Build da aplicação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Ajusta permissões do diretório de trabalho
RUN mkdir -p /app/out && chmod -R 777 /app

# Copia o código para dentro do container
COPY . ./

# Publica o build da aplicação
RUN dotnet publish -c Release -o /app/out

# Etapa 2: Criação do runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copia os arquivos do build para o runtime
COPY --from=build /app/out .

# Expõe a porta usada pela aplicação
EXPOSE 80

# Configura a porta padrão do ASP.NET Core
ENV ASPNETCORE_URLS=http://+:80

# Comando para iniciar a aplicação
ENTRYPOINT ["dotnet", "BlazorTodoApp.dll"]
