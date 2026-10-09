# API CONTRACT

Il documento definisce il funzionamento delle API necessarie alla User Story Get Ticket, i dati scambiati tra frontend e backend, la struttura dei dati e le regole che devono essere rispettate durante l'implementazione.

## OpenAPI / Swagger Specification

La specifica seguente descrive i due endpoint previsti, i dati richiesti, le risposte e il formato degli errori.

```
openapi: 3.0.4

info:
  title: Office Queue Management API
  description: REST API for Office Queue Management.
  version: 1.0.0

servers:
  - url: http://localhost:8080
    description: Local development server

paths:
  /api/services:
    get:
      summary: Returns a list of services
      description: Returns all services, including inactive ones.
      responses:
        "200":
          description: List of services retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ServiceModel'

        "500":
          description: An error occurred
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BasicErrorModel'

  /api/tickets:
    post:
      summary: Generates a new ticket
      description: Creates a ticket for an existing active service.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TicketModelRequest'

      responses:
        "201":
          description: Ticket created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TicketModelResponse'

        "500":
          description: An error occurred
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BasicErrorModel'

components:
  schemas:
    BasicErrorModel:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
          example: "ERR-100"
        message:
          type: string
          example: "Service not found"

    ServiceModel:
      type: object
      required:
        - code
        - name
        - active
      properties:
        code:
          type: string
          maxLength: 20
          pattern: '^[A-Z0-9_-]+$'
          example: "SHIP"
        name:
          type: string
          example: "Shipping"
        active:
          type: integer
          enum: [0, 1]
          example: 1

    TicketModelRequest:
      type: object
      required:
        - serviceCode
      properties:
        serviceCode:
          type: string
          maxLength: 20
          example: "SHIP"

    TicketModelResponse:
      type: object
      required:
        - ticketCode
        - serviceName
        - issuedAt
        - peopleAhead
      properties:
        ticketCode:
          type: string
          example: "T-000043"
        serviceName:
          type: string
          example: "Shipping"
        issuedAt:
          type: string
          format: date-time
          example: "2026-10-08T08:30:00.000Z"
        peopleAhead:
          type: integer
          minimum: 0
          example: 3
```

## 1. Funzionalità che copre Get Ticket

La User Story permette a un cliente di selezionare un servizio e ottenere un ticket associato alla relativa coda.

Il flusso previsto è:

1. Role Selection → Customer: il cliente accede all'area Customer.
2. GET /api/services: il frontend recupera tutti i servizi disponibili nel sistema, con l'indicazione di quali sono attivi.
3. Select Service: il cliente può selezionare soltanto un servizio attivo.
4. POST /api/tickets: il backend verifica il servizio, crea il ticket e lo salva nel database.
5. Ticket Result: il frontend mostra codice, servizio, ora di emissione e numero di persone davanti.

Get Ticket richiede soltanto questi due endpoint. La configurazione dei servizi, il calcolo del tempo di attesa, la chiamata allo sportello e l'aggiornamento del tabellone appartengono a funzionalità successive.

Non è richiesta autenticazione né identificazione del cliente. Il ticket viene mostrato digitalmente; la stampa non è prevista nello Sprint 1.

## 2. Come identifichiamo un servizio?

COINVOLGE: FEDERICO, GAIA, JENISSE

Ogni servizio è identificato da un codice stabile e univoco (serviceCode), indipendente dal nome visualizzato al cliente.

Per esempio:

```
{
  "serviceCode": "SHIP"
}
```

Nel database vengono utilizzati ID numerici per le relazioni, mentre nelle API viene utilizzato il codice del servizio.

### Struttura della tabella services

| Campo | Esempio | Significato |
| --- | --- | --- |
| `id` | `1` | Identificativo interno, primary key |
| `code` | `SHIP` | Codice univoco del servizio |
| `name` | `Shipping` | Nome visualizzato al cliente |
| `service_time_minutes` | `5` | Tempo medio previsto per il servizio |
| `active` | `1` | Indica se il servizio è attivo |

`service_time_minutes` sarà utilizzato nelle funzionalità successive per il calcolo dei tempi di attesa.

`active` assume i valori `1` (attivo) e `0` (non attivo).

Decisione definitiva: utilizziamo `code` nelle API e `service_id` come foreign key nella tabella `tickets`. Il campo `code` deve avere un vincolo `UNIQUE`.

## 3. GET /api/services

COINVOLGE: GAIA E JENISSE

Questa API permette di ottenere tutti i servizi registrati nel sistema, sia attivi sia non attivi.

### Endpoint

```
GET /api/services
```

Non richiede parametri né body.

### Risposta

200 OK

Content-Type: application/json

```
[
  {
    "code": "SHIP",
    "name": "Shipping",
    "active": 1
  },
  {
    "code": "INFO",
    "name": "Information",
    "active": 0
  }
]
```

Il backend restituisce tutti i servizi, ordinati per nome, senza filtrare quelli inattivi.

Il frontend utilizza `active` per stabilire quali servizi possono essere selezionati: quelli con `active = 0` vengono visualizzati ma non sono selezionabili.

Importante: il controllo lato frontend non è sufficiente per garantire la validità della richiesta. La POST dovrà verificare nuovamente che il servizio sia attivo, impedendo la creazione di ticket attraverso richieste inviate direttamente all'API.

Se non esistono servizi registrati, la GET restituisce `200 OK` con un array vuoto `[]`.

## 4. POST /api/tickets — Request

COINVOLGE: GAIA, JENISSE E LUCA

Questa API permette di creare un ticket per il servizio selezionato.

### Endpoint

```
POST /api/tickets
Content-Type: application/json
```

### Request body

```
{
  "serviceCode": "SHIP"
}
```

La POST riceve un unico campo obbligatorio: `serviceCode`. Il frontend non genera né invia altre informazioni relative al ticket.

### Validazione del serviceCode

Il backend deve verificare che:

- `serviceCode` sia presente e sia una stringa non vuota.
- Il valore venga normalizzato con `trim()` e `toUpperCase()`.
- Il formato contenga solo lettere, numeri, `_` e , con una lunghezza massima di 20 caratteri.
- Il servizio esista nel database.
- Il servizio sia attivo (`active = 1`).

L'ultimo controllo deve essere effettuato dal backend anche se il frontend rende impossibile selezionare un servizio inattivo.

Se una qualsiasi validazione fallisce, nessun ticket deve essere creato.

## 5. Generazione del codice del ticket

COINVOLGE: GAIA, FEDERICO, LUCA

Ogni ticket deve avere un codice univoco per l'intero ufficio, indipendentemente dal servizio selezionato.

La numerazione è globale e progressiva, basata sull'ID assegnato da SQLite.

Esempio:

| Ticket ID | Servizio | Codice |
| --- | --- | --- |
| 41 | Shipping | `T-000041` |
| 42 | Information | `T-000042` |
| 43 | Shipping | `T-000043` |

Il codice viene generato utilizzando il seguente formato:

```
function formatTicketCode(id) {
  return `T-${String(id).padStart(6, '0')}`;
}
```

### Memorizzazione

Nel database viene salvato soltanto l'ID numerico del ticket.

Il campo `ticketCode` non viene memorizzato separatamente, perché può essere ricavato dall'ID.

La numerazione non riparte da 1 al cambio di giornata e non viene mantenuto alcun contatore JavaScript in memoria.

## 6. Struttura della tabella tickets

COINVOLGE: FEDERICO E GAIA

La tabella deve contenere:

| Campo | Esempio | Significato |
| --- | --- | --- |
| `id` | `42` | Primary key e identificativo globale |
| `service_id` | `1` | Foreign key verso `services.id` |
| `status` | `WAITING` | Stato attuale del ticket |
| `issued_at` | `2026-10-08T08:30:00.000Z` | Data e ora di emissione |

### Stati del ticket

Gli stati previsti sono:

- `WAITING`: il ticket è in attesa.
- `IN_SERVICE`: il cliente è attualmente servito allo sportello.
- `SERVED`: il servizio è stato completato.

Nello Sprint 1 viene utilizzato solamente lo stato `WAITING`, assegnato automaticamente alla creazione del ticket.

Le transizioni agli altri stati saranno implementate nelle successive User Stories.

### Data e ora

`issued_at` viene generato dal backend al momento dell'emissione del ticket e memorizzato in formato ISO 8601 UTC.

Esempio:

`2026-10-08T08:30:00.000Z`

Il frontend può convertire questo valore nell'orario locale per la visualizzazione.

### Vincoli database

La tabella deve prevedere una primary key su `id`, una foreign key valida su `service_id` e i vincoli `NOT NULL` per `service_id`, `status` e `issued_at`.

definiamo l’ID cosi:
`id INTEGER PRIMARY KEY AUTOINCREMENT`

I valori dello stato devono essere limitati agli stati previsti.

## 7. Rappresentazione delle code e calcolo di peopleAhead

COINVOLGE: TUTTI

Non viene creata una tabella separata `queues`. Ogni coda è rappresentata dall'insieme dei ticket di uno stesso servizio in stato `WAITING`, appartenenti alla giornata corrente.

La coda può essere recuperata con una query di questo tipo:

```
SELECT *
FROM tickets
WHERE service_id = ?
  AND status = 'WAITING'
  AND issued_at >= ?
  AND issued_at < ?
ORDER BY issued_at, id;
```

I due limiti temporali rappresentano l'inizio e la fine della giornata corrente, convertiti in UTC.

### Calcolo di peopleAhead

`peopleAhead` rappresenta il numero di ticket dello stesso servizio, della stessa giornata, ancora in attesa e precedenti al ticket appena creato.

Per esempio, se nella coda Shipping sono presenti tre ticket in attesa, il nuovo ticket avrà:

`peopleAhead = 3`

Il conteggio deve considerare l'ordine della coda e non includere il nuovo ticket stesso.

Non è un valore da memorizzare permanentemente nella tabella: viene calcolato al momento dell'emissione e restituito nella risposta POST.

## 8. Gestione del cambio di giornata

COINVOLGE: FEDERICO E GAIA

Le code vengono gestite su base giornaliera, senza cancellare i ticket storici dal database.

La coda attiva considera soltanto i ticket della giornata corrente, mentre quelli delle giornate precedenti vengono conservati per le statistiche future.

Per definire il periodo giornaliero utilizziamo come riferimento il fuso orario dell'ufficio, `Europe/Rome`, con cambio giornata a mezzanotte.

L'inizio e la fine della giornata vengono convertiti in UTC prima di essere utilizzati nelle query.

In questo modo un ticket di ieri non viene conteggiato tra le persone in attesa oggi, anche se nel database è ancora presente con stato `WAITING`.

La stessa regola dovrà essere utilizzata in futuro per la funzionalità `Next Customer`.

## 9. POST /api/tickets — Response

COINVOLGE: GAIA E LUCA

Quando il ticket viene creato correttamente, il backend restituisce:

201 Created

Content-Type: application/json

```
{
  "ticketCode": "T-000043",
  "serviceName": "Shipping",
  "issuedAt": "2026-10-08T08:30:00.000Z",
  "peopleAhead": 3
}
```

### Significato dei campi

| Campo | Tipo | Significato |
| --- | --- | --- |
| `ticketCode` | string | Codice univoco del ticket |
| `serviceName` | string | Nome del servizio selezionato |
| `issuedAt` | string | Data e ora di emissione in ISO 8601 UTC |
| `peopleAhead` | integer | Numero di persone davanti nella coda |

La risposta contiene soltanto questi quattro campi.

`serviceCode` non viene restituito perché il frontend non ne ha bisogno nella schermata finale.

Non viene restituito neanche un tempo di attesa stimato, perché appartiene a una funzionalità futura.

## 10. Gestione degli errori e codici HTTP

COINVOLGE: GAIA, JENISSE E LUCA

Per lo Sprint 1 è stata scelta una gestione semplificata degli errori.

Le risposte di successo utilizzano:

- `200 OK` per il recupero dei servizi.
- `201 Created` per l'emissione del ticket.

Tutte le risposte di errore dell'API utilizzano HTTP 500, accompagnato da un messaggio che ne specifica il motivo.

Il frontend gestisce quindi un'unica tipologia di errore HTTP, visualizzando il messaggio ricevuto.

Questa convenzione è una semplificazione specifica del progetto: normalmente gli errori di validazione, i servizi inesistenti e quelli non disponibili utilizzerebbero codici HTTP distinti.

### Formato della risposta di errore

```
{
  "code": "ERR-100",
  "message": "Service not found"
}
```

Il campo `code` contiene un identificatore applicativo dell'errore; `message` contiene una descrizione comprensibile.

I messaggi possono variare in base al problema:

- `Invalid service code`
- `Service not found`
- `Service is not available`
- `An error occurred, please try later`

Il backend deve verificare le diverse condizioni e produrre il messaggio appropriato, senza creare il ticket se la richiesta non è valida.

Attenzione all'implementazione: l'attuale middleware Express usa un formato differente (`type`, `title`, `status`, `detail`). Dovrà essere allineato al formato `{code, message}` previsto dal contratto.

## 11. Comportamento delle interfacce

COINVOLGE: JENISSE E LUCA

### Service Selection — Jenisse

Quando il cliente entra in `/customer`, React chiama `GET /api/services` e visualizza l'elenco ricevuto dal backend.

La pagina deve gestire questi stati:

| Stato | Comportamento |
| --- | --- |
| Loading | Mostra `Loading services...` |
| Success | Mostra i servizi ricevuti |
| Empty | Mostra `No services available` |
| Error | Mostra il messaggio di errore e permette di riprovare |

I servizi con `active = 0` devono essere visibili ma non selezionabili.

Il pulsante Get Ticket rimane disabilitato finché non viene selezionato un servizio attivo.

Per la visualizzazione dei servizi, Jenisse sceglierà durante l'implementazione tra un dropdown e un'interfaccia a cards. La scelta non modifica il contratto API.

### Ticket Result — Luca

Dopo il click su Get Ticket, il pulsante viene disabilitato mentre la richiesta è in corso.

Quando il backend restituisce `201 Created`, il frontend mostra:

YOUR TICKET

# T-000043

Shipping

Issued at 10:30

3 people ahead

DONE

Quando il cliente preme `DONE`, il ticket visualizzato viene azzerato e la pagina torna alla selezione dei servizi.

Se la POST fallisce, la pagina rimane nella schermata di selezione, mostra il messaggio ricevuto dal backend e consente di riprovare.

### Organizzazione dei componenti

Jenisse implementa la selezione del servizio, mentre Luca implementa la visualizzazione del ticket.

Le due parti condividono lo stato all'interno di `CustomerPage` e rimangono sulla stessa route `/customer`, senza creare una pagina separata `/customer/result`.

## 12. Richieste ripetute e contemporanee

COINVOLGE: GAIA, FEDERICO, JENISSE E LUCA

### Caso 1 — Doppio click

Il frontend deve impedire che un cliente invii più richieste mentre è già in corso la creazione di un ticket.

Viene utilizzato uno stato `creatingTicket` per disabilitare il pulsante Get Ticket durante la POST.

### Caso 2 — Due clienti richiedono un ticket contemporaneamente

Il backend deve garantire che i due ticket vengano salvati correttamente e ricevano codici diversi.

L'unicità è garantita dall'ID generato da SQLite.

La creazione e il conteggio della posizione devono essere gestiti in modo coerente, utilizzando una transazione quando necessario.

Non vengono utilizzati contatori globali JavaScript in memoria.

### Limite noto — Risposta persa dopo la creazione

Se il backend salva correttamente il ticket ma la risposta non arriva al browser, un nuovo tentativo potrebbe generare un secondo ticket.

Questo comportamento viene mantenuto come limite noto dello Sprint 1. Non viene introdotto un meccanismo avanzato di idempotenza.

## 13. Comunicazione frontend–backend

COINVOLGE: GAIA, JENISSE E LUCA

L'architettura è composta da React/Vite sul frontend e Node.js/Express sul backend.

Durante lo sviluppo:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

Vite viene configurato per inoltrare le richieste `/api` al server Express:

```
/api → http://localhost:8080
```

In questo modo React può effettuare chiamate relative, senza inserire l'indirizzo completo del backend.

### Centralizzazione delle chiamate API

Le funzioni per comunicare con il backend vengono inserite in:

`frontend/src/API.js`

Le due funzioni principali sono:

`getServices()`

`createTicket(serviceCode)`

La prima effettua la GET dei servizi, mentre la seconda invia la richiesta di emissione del ticket.

### Organizzazione del backend

```
serviceRoutes / ticketRoutes
            ↓
serviceService / ticketService
            ↓
serviceDao / ticketDao
            ↓
SQLite
```

Le routes gestiscono HTTP, i services contengono la business logic e i DAO gestiscono le query SQL.

Le API utilizzano nomi dei campi in camelCase, per esempio `serviceCode`, `peopleAhead` e `issuedAt`, mentre il database utilizza snake_case, per esempio `service_id` e `issued_at`.

La conversione viene gestita dal backend.

## 14. Test e criteri di accettazione

COINVOLGE: FEDERICO E LUCA

Gli scenari seguenti verranno utilizzati come riferimento nei task di testing.

| Scenario | Risultato atteso |
| --- | --- |
| GET con servizi attivi e inattivi | `200` + tutti i servizi con `active` corretto |
| GET senza servizi registrati | `200` + `[]` |
| Frontend con servizio inattivo | Servizio visibile ma non selezionabile |
| POST con servizio inattivo inviata direttamente | `500` + messaggio appropriato, nessun ticket |
| POST primo ticket del servizio | `201` + `peopleAhead: 0` |
| POST secondo ticket dello stesso servizio | `201` + `peopleAhead: 1` |
| POST per un servizio diverso | Conteggio indipendente dalla prima coda |
| Due ticket di servizi diversi | `ticketCode` univoci |
| POST con body vuoto | `500` + messaggio, nessun ticket |
| POST con servizio inesistente | `500` + messaggio, nessun ticket |
| Ticket della giornata precedente | Non contribuisce alla coda corrente |
| Due richieste contemporanee | Ticket distinti e correttamente persistiti |
| Errore di salvataggio | Nessuna risposta `201` |
| Flusso frontend completo | Selezione ruolo → servizio → ticket → Done |

Federico si occupa degli unit test della business logic, mentre Luca si occupa degli integration test e del flusso E2E completo attraverso React, Express e SQLite.