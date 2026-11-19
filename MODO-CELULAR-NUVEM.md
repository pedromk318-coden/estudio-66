# Modo celular + renderização na nuvem

O celular é usado para conversar com Claude e acompanhar o GitHub. Node.js, Python, Chromium e FFmpeg são instalados em um runner temporário do GitHub Actions; não são instalados no telefone.

## Fluxo

1. Repositório GitHub com o conteúdo do Estúdio 66 e `.github/workflows/render-film.yml`.
2. Claude cria o projeto em `films/<slug>/`, incluindo `build.sh`.
3. O usuário ou uma integração autorizada inicia **Actions → Render film in the cloud** e informa `films/<slug>`.
4. O workflow instala dependências, executa `build.sh` e publica MP4 como Artifact.
5. O usuário baixa o ZIP em Artifacts.

## Contrato do projeto

- `films/<slug>/build.sh` deve usar `LIB` do ambiente, chamar ferramentas a partir de `$LIB` e produzir MP4 dentro da pasta do projeto.
- O workflow não consegue acessar arquivos que existam apenas no telefone. Imagens, áudio e fontes necessários precisam estar no repositório ou ser obtidos por fontes autorizadas e documentadas.
- Não inclua tokens ou credenciais no repositório.

## Limitações

O runner padrão não garante GPU dedicada; 3D/WebGL pode ser lento. GitHub Actions possui cotas de uso, armazenamento e tempo por conta. O vídeo só está pronto após execução bem-sucedida e artefato disponível.
