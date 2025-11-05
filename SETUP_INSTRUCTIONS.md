# **Restaurante ERP - Bar do Morcego (TIS-GE Grupo 1)**

Este é o repositório oficial para o Sistema de Gerenciamento de Restaurante.

O sistema é construído com **React**, **TypeScript**, **Vite** e **Supabase** (conforme a DOCUMENTATION.md), com componentes de UI do **shadcn/ui** e **Tailwind CSS**.

## **Como Rodar o Projeto Localmente (Windows)**

Para garantir que o ambiente de desenvolvimento seja configurado corretamente, siga estes passos.

### **Pré-requisitos**

*   **Node.js:** Certifique-se de que você tem o [Node.js](https://nodejs.org/) (versão LTS) instalado.
*   **Git:** Você precisa do Git para clonar o repositório.

### **1. Clone o Repositório**

Primeiro, clone o projeto do GitHub para a sua máquina local:

```bash
git clone [URL_DO_SEU_REPOSITORIO_GITHUB]
cd [NOME_DA_PASTA_DO_PROJETO]
2. Execute o Script de Inicialização (Obrigatório)

Não execute npm install manualmente. Nós criamos um script que automatiza todo o processo de setup.

Na pasta raiz do projeto, encontre o arquivo:

run_project.batDê um clique duplo no arquivo run_project.bat para executar.

O script fará o seguinte por você:
[PASSO 1] Verifica se a pasta node_modules existe. Se não existir, ele executa o npm install automaticamente para baixar todas as dependências (React, Supabase, Tailwind, lovable-tagger, etc.).
[PASSO 2] Verifica se o arquivo .env existe. Se não existir, ele cria o arquivo .env automaticamente e insere as chaves públicas corretas do Supabase (projeto kaawfenarygpipzedaao).
[PASSO 3] Verifica se o Tailwind CSS (tailwind.config.js) está configurado.
[PASSO 4] Inicia o servidor de desenvolvimento (npm run dev).
3. Acesse o Aplicativo

Após o script terminar, o terminal mostrará que o servidor está rodando. Você pode acessar o projeto no seu navegador, geralmente no endereço:

http://localhost:8080🐧 Usuários de Mac/Linux

O script .bat é exclusivo para Windows. Se você estiver usando macOS ou Linux, deverá seguir os passos manuais (que o script automatiza):
Execute npm install.
Crie manualmente um arquivo .env na raiz do projeto.
Copie o conteúdo abaixo para o seu .env:
VITE_SUPABASE_URL="[https://kaawfenarygpipzedaao.supabase.co](https://kaawfenarygpipzedaao.supabase.co)"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJI..." # (Pegue a chave completa no Insomnia ou com o Lucas)
Verifique se o tailwind.config.js existe. Se não, rode npx tailwindcss init -p.
Execute npm run dev.\