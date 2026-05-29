# 🏥 Clinical Request Tracker

A healthcare-style request management system that allows users to submit service requests, track progress, and manage workflows through a central dashboard.

The project was built to simulate a business application that could later be integrated with Microsoft Power Platform technologies such as Power Apps, Power Automate, SharePoint Lists, or Dataverse.

---

## 🚀 Features

### Request Submission

Users can:

* Submit new requests
* Select request type
* Choose department
* Set request priority
* Provide request details

---

### Request Management

Authorised users can:

* View all submitted requests
* Update request status
* Mark requests as:

  * No Action
  * In Progress
  * Approved
  * Rejected
  * Completed
  * Archived

---

### Excel Data Storage

All request data is stored in an Excel workbook using Python and OpenPyXL.

Each request is written as a new row containing:

* Request ID
* Request Type
* Department
* Priority
* Description
* Status
* Submission Date

---

### REST API

The application exposes REST endpoints using Flask.

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| GET    | /requests      | Retrieve all requests |
| POST   | /requests      | Create a request      |
| PATCH  | /requests/{id} | Update status         |
| DELETE | /requests/{id} | Delete request        |

---

## 🏗️ Architecture

```text
User
 │
 ▼
Frontend (HTML/CSS/JavaScript)
 │
 ▼
Flask REST API
 │
 ▼
Excel Workbook (requests.xlsx)
```

---

## 🧰 Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Flask
* Flask-CORS

### Data Layer

* OpenPyXL
* Microsoft Excel

### Development Environment

* Ubuntu (WSL2)
* Git
* GitHub

---

## 📋 Example Workflow

1. User submits a request.
2. Request is sent to Flask API.
3. Flask validates request data.
4. Request is stored in Excel.
5. Request appears in the management dashboard.
6. Administrator updates status.
7. Changes are written back to Excel.

---

## 🔮 Future Enhancements

* User authentication
* Role-based access control
* SLA tracking
* Email notifications
* Audit history
* Search and filtering
* SharePoint List integration
* Dataverse integration
* Power Automate workflow integration
* Dashboard reporting

---

## 💡 What This Project Demonstrates

* Frontend development
* REST API development
* Data persistence
* Business workflow automation
* Request lifecycle management
* CRUD operations
* Integration-ready architecture
* Healthcare-style service management workflows

---

## ▶️ Running Locally

### Backend

```bash
cd backend

python3 -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

python app.py
```

### Frontend

Open:

```text
frontend/index.html
```

in your browser.

---

## 📚 Learning Objectives

This project was created to explore how business applications can be designed and automated using concepts commonly found in enterprise platforms such as Microsoft Power Platform, SharePoint, Dataverse, and workflow automation tools.