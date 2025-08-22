#!/bin/bash

# Verifica se foi passado um argumento
if [ -z "$1" ]; then
  echo "Uso: ./build-hml.sh <versao>"
  exit 1
fi

VERSAO=$1
IMAGE_NAME="dinho28/hml-quero-pao-app"

echo "🗑️ Limpando versões antigas de $IMAGE_NAME (exceto $VERSAO)..."

# Remover outras tags desse repositório que não sejam a versão atual
docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | grep "$IMAGE_NAME" | grep -v ":$VERSAO" | awk '{print $2}' | xargs -r docker rmi

# Remover imagens sem tag (dangling)
docker images -f "dangling=true" -q | xargs -r docker rmi

echo "Compilação da nova versão $VERSAO"
echo "🔧 Compilando projeto .NET..."
echo "📁 Diretório atual: $(pwd)"
dotnet build

docker rmi dinho28/hml-quero-pao-app:1.0

echo "🐳 Criando imagem Docker com tag dinho28/hml-quero-pao-app:$VERSAO..."
echo "📁 Diretório atual: $(pwd)"
docker build -t dinho28/hml-quero-pao-app:$VERSAO .

echo "📤 Enviando imagem para o Docker Hub..."
echo "📁 Diretório atual: $(pwd)"
docker push dinho28/hml-quero-pao-app:$VERSAO

echo "✅ Build e push concluídos com sucesso para a versão $VERSAO"
