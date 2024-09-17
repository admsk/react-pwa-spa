[![version](https://img.shields.io/badge/version-1.0.0-yellow.svg)](https://semver.org)


## Escopo, pré-requisitos e objetivo
Este caso de estudo exemplifica duas abordagens de desenvolvimento de aplicações Web.

## Conteúdos

- [PWA (Progressive Web App)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [SPA (Single Page Application)](https://developer.mozilla.org/en-US/docs/Glossary/SPA)


# Tecnologias 
React

## Iniciando...
Para compilação da aplicação, primeiro é necessário realizar o clone do projeto ou baixa-lo para a sua máquina.
Siga as intruções abaixo:
Para clonar: 

Abra um terminal no seu computador

Navegue até um diretório da sua escolha

Digite o comando: 

git clone git@github.com:admsk/react-pwa-spa.git

Depois de clonado ou baixado navegue até a pasta criada

Digite  o comando: 

cd [pasta criada]

Ainda dentro da pasta criada, agora com todos os arquivos, instale as dependencias: 
digite

npm install

Abra o projeto caso queira visualizar o projeto e os seus arquivos

code .

digite npm start

Se a aplicação não abrir automaticamente no browser, abra manualmente informando  http://localhost:3000 no browser.

## Pré-requisitos
Estou considerando que você já tenha o node instalado na sua máquina, mas caso não tenha, baixo-o e instale.

![NODE]([https://dotnet.microsoft.com/pt-br/download/dotnet/8.0](https://nodejs.org/en/about/previous-releases))

## Compilar e executar os projetos - [VSCODE] 
Usar o VSCode

Depois de atender ao pré-requisitos, estamos prontos para continuar.

Dentro da pasta criada, execute os comandos 
abaixo para subir a api.

dotnet run --project mcmvc.api

Acesse http://localhost:5094/participantes/all para ver os registros sendo trazidos pela api.


Digite o comando abaixo para subir a aplicação.

dotnet run --project mcmv.web

Aguarde a aplicação ser carregada ou acesse 
https://localhost:44441/

NOTA: Aguarde a aplicação ser carregada, pode ser que demore alguns segundos entre a compilação e a renderização.

Logo abaixo, algumas evidencias poderão ser visualizadas.

## Executar testes unitarios - [VISUAL STUDIO] 
Usar o Visual Studio (Preferencialmente o 2022)

Abra o projeto com o visual studio
Navegue até a aba "Test" e clique em "Run All Tests"

Na Janela que aparecerá ao lado o resultado dos testes serão exibidos.

## Evidências


[API](https://gitlab.com/admsk/mcmvappapi/-/blob/master/mcmv.web/ClientApp/imagens%20/endpoin-api-all.png?ref_type=heads)


[APLICACAO](https://gitlab.com/admsk/mcmvappapi/-/blob/master/mcmv.web/ClientApp/imagens%20/Captura%20de%20tela%20de%202024-09-16%2009-12-13.png?ref_type=heads)


[TESTES](https://gitlab.com/admsk/mcmvappapi/-/blob/master/mcmv.web/ClientApp/imagens%20/EvidenciaTestes.png?ref_type=heads)
