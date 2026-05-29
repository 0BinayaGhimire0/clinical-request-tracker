from flask import Flask, request, jsonify
from flask_cors import CORS
from openpyxl import Workbook, load_workbook
from zipfile import BadZipFile
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

EXCEL_FILE = "requests.xlsx"
COMMENTS_SHEET = "Ticket Comments"

HEADERS = [
    "ID",
    "Title",
    "Request Type",
    "Department",
    "Priority",
    "Description",
    "Status",
    "Submitted Date",
]

COMMENTS_HEADERS = [
    "Request ID",
    "Author",
    "Comment",
    "Commented Date",
]


def create_excel_file():
    workbook = Workbook()
    requests_sheet = workbook.active
    requests_sheet.title = "Clinical Requests"
    requests_sheet.append(HEADERS)

    comments_sheet = workbook.create_sheet(COMMENTS_SHEET)
    comments_sheet.append(COMMENTS_HEADERS)

    workbook.save(EXCEL_FILE)


def ensure_excel_file_exists():
    # If the file doesn't exist or is empty, create a fresh workbook
    if not os.path.exists(EXCEL_FILE) or os.path.getsize(EXCEL_FILE) == 0:
        create_excel_file()
        return

    # Try to load the workbook; if it's corrupted (not a zip/xlsx), recreate it
    try:
        workbook = load_workbook(EXCEL_FILE)
    except BadZipFile:
        create_excel_file()
        return
    except Exception:
        # Any other load error — safest to recreate the file to ensure consistency
        create_excel_file()
        return

    # Ensure comments sheet exists
    if COMMENTS_SHEET not in workbook.sheetnames:
        comments_sheet = workbook.create_sheet(COMMENTS_SHEET)
        comments_sheet.append(COMMENTS_HEADERS)
        workbook.save(EXCEL_FILE)


def generate_ticket_id():
    workbook = load_workbook(EXCEL_FILE)
    sheet = workbook.active
    max_row = sheet.max_row - 1
    ticket_number = max(max_row, 0) + 1
    return f"TKT-{ticket_number:06d}"


@app.route("/requests", methods=["POST"])
def create_request():
    ensure_excel_file_exists()

    data = request.get_json()

    workbook = load_workbook(EXCEL_FILE)
    sheet = workbook.active

    request_id = generate_ticket_id()

    new_row = [
        request_id,
        data.get("title"),
        data.get("requestType"),
        data.get("department"),
        data.get("priority"),
        data.get("description"),
        "Open",
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    ]

    sheet.append(new_row)
    workbook.save(EXCEL_FILE)

    return (
        jsonify(
            {
                "message": "Ticket created successfully",
                "request": {
                    "id": request_id,
                    "title": data.get("title"),
                    "requestType": data.get("requestType"),
                    "department": data.get("department"),
                    "priority": data.get("priority"),
                    "description": data.get("description"),
                    "status": "Open",
                },
            }
        ),
        201,
    )


@app.route("/requests", methods=["GET"])
def get_requests():
    ensure_excel_file_exists()

    workbook = load_workbook(EXCEL_FILE)
    sheet = workbook.active

    requests = []

    for row in sheet.iter_rows(min_row=2, values_only=True):
        requests.append(
            {
                "id": row[0],
                "title": row[1],
                "requestType": row[2],
                "department": row[3],
                "priority": row[4],
                "description": row[5],
                "status": row[6],
                "submittedDate": row[7],
            }
        )

    return jsonify(requests)


def get_comments_for_request(request_id):
    workbook = load_workbook(EXCEL_FILE)
    comments = []

    if COMMENTS_SHEET not in workbook.sheetnames:
        return comments

    comments_sheet = workbook[COMMENTS_SHEET]
    for row in comments_sheet.iter_rows(min_row=2, values_only=True):
        if row[0] == request_id:
            comments.append(
                {
                    "author": row[1],
                    "comment": row[2],
                    "commentedDate": row[3],
                }
            )

    return comments


@app.route("/requests/<request_id>/comments", methods=["GET"])
def get_request_comments(request_id):
    ensure_excel_file_exists()
    return jsonify(get_comments_for_request(request_id))


@app.route("/requests/<request_id>/comments", methods=["POST"])
def add_request_comment(request_id):
    ensure_excel_file_exists()

    data = request.get_json()
    author = data.get("author", "Anonymous")
    comment_text = data.get("comment")

    if not comment_text:
        return jsonify({"error": "Comment text is required"}), 400

    workbook = load_workbook(EXCEL_FILE)
    comments_sheet = workbook[COMMENTS_SHEET]
    comments_sheet.append(
        [
            request_id,
            author,
            comment_text,
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        ]
    )
    workbook.save(EXCEL_FILE)

    return jsonify({"message": "Comment added successfully"}), 201


@app.route("/requests/<request_id>", methods=["PATCH"])
def update_request_status(request_id):
    ensure_excel_file_exists()

    data = request.get_json()
    new_status = data.get("status")

    workbook = load_workbook(EXCEL_FILE)
    sheet = workbook.active

    for row_number in range(2, sheet.max_row + 1):
        current_id = sheet.cell(row=row_number, column=1).value

        if current_id == request_id:
            sheet.cell(row=row_number, column=7).value = new_status
            workbook.save(EXCEL_FILE)

            return jsonify({"message": "Request status updated in Excel successfully"})

    return jsonify({"error": "Request not found"}), 404


@app.route("/requests/<request_id>", methods=["DELETE"])
def delete_request(request_id):
    ensure_excel_file_exists()

    workbook = load_workbook(EXCEL_FILE)
    sheet = workbook.active
    deleted = False

    for row_number in range(2, sheet.max_row + 1):
        current_id = sheet.cell(row=row_number, column=1).value

        if current_id == request_id:
            sheet.delete_rows(row_number)
            deleted = True
            break

    if deleted:
        comments_sheet = workbook[COMMENTS_SHEET]
        rows_to_remove = []

        for row_number in range(2, comments_sheet.max_row + 1):
            current_comment_id = comments_sheet.cell(row=row_number, column=1).value
            if current_comment_id == request_id:
                rows_to_remove.append(row_number)

        for offset, row_number in enumerate(rows_to_remove):
            comments_sheet.delete_rows(row_number - offset)

        workbook.save(EXCEL_FILE)
        return jsonify({"message": "Request deleted successfully"})

    return jsonify({"error": "Request not found"}), 404


if __name__ == "__main__":
    ensure_excel_file_exists()
    app.run(debug=True)
