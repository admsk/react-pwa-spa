#!/bin/bash

# Verifica se foi passado um argumento
if [ -z "$1" ]; then
  echo "Uso: ./build.sh <versao>"
  exit 1
fi

VERSAO=$1

echo "🗑️ Limpando versões antigas..."

docker images | grep dinho28/quero-pao-app | awk '{print $3}' | xargs docker rmi

echo "🔧 Compilando projeto .NET..."
echo "📁 Diretório atual: $(pwd)"
dotnet build

echo "🐳 Criando imagem Docker com tag dinho28/quero-pao-app:$VERSAO..."
echo "📁 Diretório atual: $(pwd)"
docker build -t dinho28/quero-pao-app:$VERSAO .

echo "📤 Enviando imagem para o Docker Hub..."
echo "📁 Diretório atual: $(pwd)"
docker push dinho28/quero-pao-app:$VERSAO

echo "✅ Build e push concluídos com sucesso para a versão $VERSAO"
