# Estúdio 66

66 estilos de vídeo animado para Reels, TikTok e Shorts, feitos em código com Claude e renderizados na nuvem.

**Comece por aqui:** `INSTALAR.md` para configurar pelo celular e `ESTILOS.md` para escolher entre os 66 estilos.

## Como funciona sem computador

1. Você conversa com Claude pelo celular e escolhe tema, duração, estilo e voz.
2. Claude cria/edita o projeto em `films/<slug>/` no repositório GitHub conectado.
3. GitHub Actions renderiza o vídeo em um runner Ubuntu temporário.
4. Você baixa o MP4 em **GitHub → Actions → execução → Artifacts**.

O telefone é a interface; o render acontece na nuvem. Claude não cria o MP4 sozinho e o GitHub precisa concluir a execução.

## Arquivos principais

| Arquivo / pasta | Função |
|---|---|
| `SKILL.md` | Instruções que Claude segue |
| `AGENTS.md` | Regras gerais para agentes |
| `REELS.md` | Formato vertical, área segura, gancho, voz e som |
| `ESTILOS.md` | Os 66 estilos e seus usos |
| `INSTALAR.md` | Configuração e uso pelo celular |
| `.github/workflows/render-film.yml` | Renderização remota |
| `exemplos/` | Reels de referência adaptados para vertical |
| `biblioteca/` | Biblioteca de estilos e ferramentas de renderização |
| `scripts/` | Verificação e instalação para modo local opcional |

## Exemplos de pedidos

- “Faz um reel de 30 segundos sobre 5 ferramentas de IA, estilo pixel art.”
- “Transforma este roteiro num vídeo estilo quadro-negro.”
- “Cria um vídeo de 20 segundos para minha loja, estilo anime anos 80.”
- “Quais estilos combinam com uma curiosidade sobre o Egito Antigo?”

## Licença e uso

- Os vídeos criados são do usuário, inclusive para clientes, sem marca d'água ou crédito obrigatório da biblioteca.
- O Estúdio 66 é de uso pessoal: não pode ser revendido nem compartilhado (veja `LICENCA.md`).
- A biblioteca em `biblioteca/` permanece sob sua licença MIT.
