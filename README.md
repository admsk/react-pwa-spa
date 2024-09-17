[![version](https://img.shields.io/badge/version-1.0.0-yellow.svg)](https://semver.org)


## Escopo, pré-requisitos e objetivo
Este caso de estudo exemplifica duas abordagens de desenvolvimento de aplicações Web em uma única aplicação.

## Conteúdos

- [PWA (Progressive Web App)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [SPA (Single Page Application)](https://developer.mozilla.org/en-US/docs/Glossary/SPA)


# Tecnologias 
![version](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)

![version](https://img.shields.io/badge/TypeScript-4.9.5-blue?logo=typescript&logoColor=white)

# Bibliotecas
![version](https://img.shields.io/badge/Material%20UI-5.11.0-blue?logo=mui&logoColor=white&link=https://mui.com/)


## Compilando a aplicação pelo terminal
Para compilação da aplicação, primeiro é necessário realizar o clone do projeto ou baixa-lo para a sua máquina.
Siga as intruções abaixo:

Para clonar: 

Abra um terminal no seu computador

Navegue até um diretório da sua escolha

Execute o comando: 

git clone git@github.com:admsk/react-pwa-spa.git

Depois de clonado ou baixado navegue até a pasta criada

Execute  o comando: 

cd [pasta criada]

Ainda dentro da pasta criada, agora com todos os arquivos, instale as dependencias: 

Execute  o comando: 

npm install

Abra o projeto caso queira visualizar o projeto e os seus arquivos

Execute  o comando: 

code .

Execute  o comando: 

npm start

Se a aplicação não abrir automaticamente no browser, abra manualmente informando  http://localhost:3000 no browser.

## Pré-requisitos
Estou considerando que você já tenha o node instalado na sua máquina, mas caso não tenha, baixo-o e instale.

![NODE]([https://dotnet.microsoft.com/pt-br/download/dotnet/8.0](https://nodejs.org/en/about/previous-releases))

## Compilando a aplicação em um container pelo docker
Abra o  terminal e navegue até o local onde o projeto foi clonado.

Crie a imagem do container com o comando abaixo:

Docker build -t react-spa-pwa:1.0 .

Aguarde a imagem ser criada

Para ver as suas imagens criadas, execute o comando abaixo:

docker images

Agora vamos executar a aplicação através do container

docker container run -p 3000:3000 react-spa-pwa:1.0

Aguarde o processo ser finalizado. As Urls para acesso serão exeibidas na saida do terminal, parecida com as linhas abaixo, basta acessar a url e navegar na aplicação.

  Local:            http://localhost:3000
  
  On Your Network:  http://172.17.0.2:3000

## Pré-requisitos
É necessário que seja instalado o Docker.

![DOCKER]([https://docs.docker.com/desktop/install/windows-install/))
