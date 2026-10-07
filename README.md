# Office Queue Management

Office Queue Management is a web application for managing customer queues in a public office.

The system is designed for different types of users. Customers can request a ticket for a service, officers can manage the customers to be served, managers can access statistics, and administrators can configure the services and counters. A public display is also provided to show queue information inside the office.

## System areas

The application is organized into the following areas:

- **Customer** – request a ticket for a selected service and view the information related to the issued ticket.
- **Officer** – manage the customers to be served at a counter.
- **Manager** – access statistics about the office activity.
- **Administrator** – configure services and counters.
- **Public Display** – show queue and call information to customers waiting in the office.

The application starts from a role-selection page that gives access to the different areas.

## Technology stack

- **Frontend:** React + Vite
- **Routing:** React Router
- **Backend:** Node.js + Express
- **Database:** SQLite
- **API:** REST + JSON
- **Client-server communication:** Fetch API
- **Version control:** GitHub

## General architecture

The project is divided into a React frontend and a Node.js/Express backend.

```text
React frontend
      |
      | REST / JSON
      v
Express backend
      |
      v
Service layer
      |
      v
DAO layer
      |
      v
SQLite database
```

The backend follows a layered structure:

- **routes** handle HTTP requests and responses;
- **services** contain business logic and validation;
- **DAO modules** contain database queries;
- **database modules** manage the SQLite connection and initialization.

## Project structure

```text
office-queue-management/
├── frontend/          React application
├── backend/           Express API and SQLite database
├── README.md
└── .gitignore
```

Frontend routes are organized around the main system areas:

```text
/            Role selection
/customer    Customer area
/officer     Officer area
/manager     Manager area
/admin       Administrator area
/display     Public display
```

## Current development

Sprint 1 focuses on the **Get Ticket** user story:

> As a customer  
> I want to select a service  
> So that I get served when my turn comes.

The first complete flow to be implemented is:

```text
Role selection
      ↓
Customer area
      ↓
Select a service
      ↓
Request a ticket
      ↓
Ticket stored in SQLite
      ↓
Ticket information shown to the customer
```

The other application areas are part of the overall structure and will be developed in later sprints.

## Backend

Detailed backend setup, configuration, database management, available scripts, API endpoints and testing instructions are documented in:

[`backend/README.md`](backend/README.md)
