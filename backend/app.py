import os
import json
import base64
import subprocess
import pandas as pd
import io
from flask import Flask, jsonify
from flask_cors import CORS
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

app = Flask(__name__)
CORS(app) # Permite chamadas do seu frontend React

# --- CONFIGURAÇÕES ---
# Pegamos o ID do arquivo da variável de ambiente definida no Render
FILE_ID = os.environ.get('DRIVE_FILE_ID')

def get_credentials():
    """
    Decodifica as credenciais da Service Account armazenadas em Base64
    na variável de ambiente GOOGLE_CREDENTIALS_B64.
    """
    creds_b64 = os.environ.get('GOOGLE_CREDENTIALS_B64')
    if not creds_b64:
        raise ValueError("Credenciais não encontradas. Verifique a variável GOOGLE_CREDENTIALS_B64.")
    
    try:
        creds_json = base64.b64decode(creds_b64)
        creds_dict = json.loads(creds_json)
        return service_account.Credentials.from_service_account_info(
            creds_dict, scopes=['https://www.googleapis.com/auth/drive.readonly'])
    except Exception as e:
        raise ValueError(f"Erro ao decodificar credenciais: {str(e)}")

def mdb_to_pandas(db_path, table_name):
    """
    Usa o comando 'mdb-export' do sistema linux para converter uma tabela
    específica do MDB para CSV, e então lê com Pandas.
    """
    try:
        print(f"Lendo tabela: {table_name}")
        # Executa comando linux: mdb-export arquivo.mdb NOME_TABELA
        process = subprocess.Popen(
            ['mdb-export', db_path, table_name],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            print(f"Erro ao exportar tabela {table_name}: {stderr.decode()}")
            return pd.DataFrame()

        # Lê o CSV resultante da memória
        # dtype=str garante que CPFs e telefones não percam zeros à esquerda
        return pd.read_csv(io.BytesIO(stdout), dtype=str)
    except Exception as e:
        print(f"Erro processando tabela {table_name}: {e}")
        return pd.DataFrame()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/api/sync', methods=['GET'])
def sync_data():
    if not FILE_ID:
        return jsonify({"error": "DRIVE_FILE_ID não configurado"}), 500

    temp_filename = "temp_db.mdb"
    
    try:
        # 1. Autentica e Baixa do Drive
        print("Iniciando download do Drive...")
        creds = get_credentials()
        service = build('drive', 'v3', credentials=creds)

        request = service.files().get_media(fileId=FILE_ID)
        file_io = io.BytesIO()
        downloader = MediaIoBaseDownload(file_io, request)
        
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            # print(f"Download {int(status.progress() * 100)}%.")

        # Salva arquivo físico para o mdbtools ler
        with open(temp_filename, "wb") as f:
            f.write(file_io.getbuffer())

        # 2. Converte as tabelas
        # Mapeamento para estrutura do Frontend (AppData)
        # IMPORTANTE: Os nomes ("CLIENTES", "SEGUROS") devem ser iguais aos do seu Access
        
        clientes_df = mdb_to_pandas(temp_filename, "CLIENTES")
        seguros_df = mdb_to_pandas(temp_filename, "SEGUROS")
        sinistros_df = mdb_to_pandas(temp_filename, "CABSINISTRO")
        producao_df = mdb_to_pandas(temp_filename, "FINANCEIRO")

        # Tratamento básico de dados nulos
        data = {
            "clientes": clientes_df.fillna('').to_dict(orient='records'),
            "seguros": seguros_df.fillna('').to_dict(orient='records'),
            "sinistros": sinistros_df.fillna('').to_dict(orient='records'),
            "producao": producao_df.fillna('').to_dict(orient='records'),
            "loaded": True,
            "filename": "Sincronizado via Drive"
        }
        
        return jsonify(data)

    except Exception as e:
        print(f"Erro Fatal: {e}")
        return jsonify({"error": str(e)}), 500
        
    finally:
        # Limpa arquivo temporário
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == '__main__':
    # Rodar localmente: python app.py
    app.run(debug=True, port=5000)
