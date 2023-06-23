# Projeto de Engenharia Web 2023 - 3º ano - MIEI

## Plataforma de Gestão e Disponibilização de Recursos Educativos

### Sobre

Este projeto consiste num serviço web implementado com NodeJS, Express e MongoDB que permite a produtores de recursos educativos publicar e gerir recursos dentro da plataforma para que consumidores possam aceder, decarregar e comentar os mesmos.

### Como executar o serviço

Siga as instruções abaixo para executar os servidores do projeto na sua máquina local:

1. Clone o repositório para a sua máquina:
```bash
https://github.com/Eduard0Rocha/ProjetoEW.git
```
2. De seguida, na pasta principal, crie os containers para correr o projeto:
```bash
docker up -d --build
```
3. Para restaurar a base de dados execute os seguintes comandos:
```bash
docker cp Backup/backupDB gfich-mongodb:/backup
```
```bash
docker exec gfich-mongodb mongorestore --drop --db gfich /backup/gfich
```
Poderá adicionar também à base de dados o conteúdos dos ficheiros .json presentes na pasta Data relativos aos cursos e ao administrador com o comando "mongoimport".
Com isto, o projeto fica acessível através do link: http://localhost:3000.
