# pass.in

O pass.in é uma aplicação de **gestão de participantes em eventos presenciais**.

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.

## Requisitos

### Requisitos Funcionais (RFs)

- [x] O organizador deve poder cadastrar um novo evento;
- [ ] O organizador deve poder visualizar dados de um evento;
- [ ] O organizador deve poder visualizar a lista de participantes;
- [x] O participante deve poder se inscrever em um evento;
- [ ] O participante deve poder visualizar seu crachá de inscrição;
- [ ] O participante deve poder realizar check-in no evento;

### Regras de Negócio (RNs)

- [x] O participante só pode se inscrever em um evento um única vez;
- [x] O participante só pode se inscrever em eventos com vagas disponíveis;
- [ ] O participante só pode realizar check-in em um evento uma única vez;

### Requisitos Não-Funcionais (RNFs)

- [ ] O check-in no evento será realizado através de um QRCode;
