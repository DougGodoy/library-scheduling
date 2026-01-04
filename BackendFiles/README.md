
# Sistema de Agendamento de Computadores - Backend

Este é o backend desenvolvido com Spring Boot 3 para o gerenciamento de reservas da biblioteca.

## 🚀 Como Executar

1. **Pré-requisitos:** JDK 17+ e Maven.
2. **Execução:**
   ```bash
   mvn spring-boot:run
   ```
3. **Acesso:** O servidor rodará em `http://localhost:8080`.
4. **Banco de Dados:** H2 em memória. Console em `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:librarydb`, User: `sa`, Password: `password`).

## 📡 Documentação da API (Endpoints)

### 1. Computadores
- `POST /computers`: Cadastra novo computador.
  - Exemplo JSON: `{"name": "PC Gamer 01", "description": "Core i9, 32GB RAM"}`
- `GET /computers`: Lista todos os cadastrados.
- `GET /computers/available?dateTime=2024-12-31T15:00:00`: Busca computadores sem reserva para este horário exato.
- `DELETE /computers/{id}`: Remove um computador.

### 2. Reservas
- `POST /reservations`: Cria um agendamento.
  - Exemplo JSON: `{"computerId": 1, "userName": "Alice Silva", "dateTime": "2024-12-31T15:00:00"}`
  - **Regra:** Retorna erro 400 se o computador já estiver ocupado no mesmo `dateTime`.
- `GET /reservations`: Lista todas as reservas ativas.
- `DELETE /reservations/{id}`: Cancela uma reserva.

## 🛠️ Detalhes Técnicos
- **Arquitetura:** Camadas (Controller -> Service -> Repository).
- **Validação:** Verificação de conflito de horário no Service.
- **Segurança:** Configuração de CORS liberada para integração com o frontend.
