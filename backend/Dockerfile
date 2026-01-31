# Usa uma imagem leve do Python
FROM python:3.9-slim

# Instala o mdbtools (Crucial para ler arquivos Access no Linux)
RUN apt-get update && apt-get install -y \
    mdbtools \
    && rm -rf /var/lib/apt/lists/*

# Configura diretório de trabalho
WORKDIR /app

# Copia e instala dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código
COPY . .

# Comando para rodar o servidor (usando Gunicorn para produção)
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "app:app"]
