import re
from flask import Flask, redirect, url_for, request, session, render_template
from globals import select, db_exec
import bcrypt
from decouple import config
from functools import wraps
from flask_cors import CORS
from datetime import datetime
import logging

logging.basicConfig(filename='cipher.log', format='%(levelname)s:%(message)s', level=logging.DEBUG)
logging.getLogger().addHandler(logging.StreamHandler())

app = Flask(__name__, static_folder='./build', static_url_path='/')#, static_folder=config('PROD_PDF_FLASK'))
app.config["SECRET_KEY"] = config("FLASK_SECRET_KEY")
CORS(app)

def is_logged_in(f):
    @wraps(f)
    def _is_logged_in(*args, **kwargs):
        if 'username' not in session:
            logging.info("USER IS NOT AUTHENTICATED")
            return render_template("login.html")
        return f(*args, **kwargs)
    return _is_logged_in

# Login with username and password,
# Set Session cookie if operation has been successful
@app.route("/login", methods=["POST"])
def post_login():
    if 'username' in session:
        # return app.send_static_file('index.html'), 200
        return redirect(url_for("index"))
    rows = select("SELECT PASW FROM USERS WHERE UNAM = :1", [request.form["username"]])
    for row in rows:
        pasw = request.form["password"]
        db_pasw = row[0].encode(encoding='utf8')
        if bcrypt.checkpw(pasw.encode(encoding='utf8'), db_pasw):
            session["username"] = request.form["username"]
            return redirect(url_for("index"))
        else:
            return render_template("login.html", error="Passwort falsch"), 200
    # no row found, user does not exist
    return render_template("login.html", error="Nutzer existiert nicht"), 200

# Return Login Page
@app.route("/login", methods=["GET"])
def get_login():
    return render_template("login.html")

@app.route("/driver_info", methods=["POST"])
@is_logged_in
def post_driver_info():
    AMT = request.json["amt"]
    DAT = request.json["dat"]
    UHR = get_normalized_uhr(request.json["uhr"])
    print(AMT)
    print(DAT)
    print(UHR)
    OWITIMESTAMP = datetime.strptime(DAT + " " + UHR, "%Y-%m-%d %H:%M")
    rows = select("""SELECT RNTL_DRIVER_FIRST_NAME, RNTL_DRIVER_LAST_NAME, RNTL_DRIVER_STREET, RNTL_DRIVER_POSTAL_CODE, RNTL_DRIVER_CITY,
                    RNTL_DRIVER_LICENSE_DATE, RNTL_DRIVER_BIRTHDAY, RATE_PRL, RNTL_MVNR, DRIVER_COUNTRY FROM MVS WHERE VHCL_PLATE = :1 AND :2 BETWEEN RNTL_HANDOVER_DATM AND RNTL_RETURN_DATM ORDER BY RNTL_HANDOVER_DATM DESC """,
                    [AMT, OWITIMESTAMP])
    for row in rows:
        return {
            "success": True, 
            "driverData": {
                "forename": row[0],
                "surname": row[1],
                "street": row[2],
                "zip": row[3],
                "city": row[4],
                "licDate": datetime.strftime(row[5], '%d.%m.%Y') if row[5] != None else '',
                "birthDay": datetime.strftime(row[6], '%d.%m.%Y') if row[6] != None else '',
                "rate": row[7],
                "mvnr": row[8],
                "driverCountry": row[9]
            }
        }
    return {
        "success": False, 
    }

from helpers import *

@app.route("/announce_driver", methods=["POST"])
@is_logged_in
def post_announce_driver():
    dat = request.json
    mail = dat["mail"]
    owiData = dat["owiData"]
    driverData = dat["driverData"]
    lang = "de" if mail.endswith(".de") or mail.endswith(".at") or mail.endswith(".ch") else "en"
    # first, store accouncement data in DB
    uhrs = get_normalized_uhr(owiData["uhr"])
    driverData["driverCountry"] = request.json["driverCountry"]
    OWITIMESTAMP = datetime.strptime(owiData["dat"] + " " + uhrs, "%Y-%m-%d %H:%M")
    db_exec("INSERT INTO DRIVER_ANNOUNCEMENTS VALUES (:1, :2, :3, :4, :5, :6, :7, :8)", [
        owiData["amt"], OWITIMESTAMP, owiData["aktz"], mail, session["username"], datetime.now(), driverData["forename"], driverData["surname"]
    ])
    logging.info("Stored driver info for " + owiData["aktz"] + " in DB by user " + session["username"])
    return {
        "success": send_driver_information(mail, owiData, driverData, lang)
    }

@app.route("/supplier_search", methods=["POST"])
@is_logged_in
def post_supplier_search():
    suppliers = []
    params = []

    param = str(request.json["param"]).lower()
    zip = str(request.json["zip"]).lower()
    mandant = re.findall(r'\d+', request.json["mandant"])[0]

    sql = "SELECT S_KR_KREDITOR, S_KR_NAME1 || ' ' || S_KR_NAME2, S_KR_STRASSE, S_KR_POSTLEITZAHL || ' ' || S_KR_ORT, S_KR_IBAN, S_KR_USTID, S_KR_STEUERNUMMER, S_KR_BEREICHSKENNZEICHEN FROM S_KR_KREDITOR WHERE upper(S_KR_NAME1) NOT LIKE '%GESPERRT%' AND upper(S_KR_NAME1) NOT LIKE '%BLOCKED%' AND "
    mandant_rows = select("SELECT S_MD_HAUPT_LAND FROM S_MD_MANDANTEN WHERE S_MD_FIR = :1", [mandant])
    for row in mandant_rows:
        if row[0] == "FR":
            logging.info("Land is FR")
            sql += "S_KR_LAND = 'FR' "
        else:
            logging.info("Using client")
            sql += "S_KR_MANDANT = :1 "
            params.append(mandant)
        break
    
    if param != "":
        sql += "AND (to_char(S_KR_KREDITOR, 'FM99999999') = :2 OR lower(S_KR_NAME1) LIKE :3 OR lower(S_KR_NAME2) LIKE :4 OR lower(S_KR_STRASSE) LIKE :5 OR lower(S_KR_IBAN) LIKE :6 OR lower(S_KR_USTID) LIKE :7 OR lower(S_KR_STEUERNUMMER) LIKE :8) "
        params.append(param)
        for i in range(6):
            params.append("%" + param + "%")
    if zip != "":
        sql += "AND (lower(S_KR_ORT) LIKE :9 OR lower(S_KR_POSTLEITZAHL) LIKE :10) "
        for i in range(2):
            params.append(zip + "%")


    sql += "AND ROWNUM < 51"
    logging.info("Selecting supplier:")
    logging.info(sql)
    logging.info(params)
    rows = select(sql, params)
    for row in rows:
        suppliers.append({
            "id": row[0],
            "name": row[1],
            "street": row[2],
            "zip": row[3],
            "iban": row[4],
            "vat": row[5],
            "ste": row[6],
            "akb": row[7]
        })
    return { "suppliers": suppliers }

# We might not need this in the first version
@app.route("/fetch_free_invoices_val", methods=["GET"])
@is_logged_in
def get_fetch_free_invoices_val():
    invs = []
    rows = select("""SELECT M_CN_ID, M_CN_MAIL_ID, M_IV_BARCODE, M_IV_MANDANT, M_IV_INVOICENUMBER, M_IV_KINDOFINVOICE, M_IV_INVOICETYPE, M_IV_KREDITOR, M_IV_IBAN,
    M_IV_INVOICEDATE, M_IV_DELIVERYDATE, M_IV_DELIVERYDATE, M_IV_DELIVERYDATE_BIS, M_IV_ORDERID, M_IV_INVOICEAMOUNT, M_IV_TOTALAMOUNT, M_IV_TAXRATE1, M_IV_NETBASE1,
    M_IV_TAXRATE2, M_IV_NETBASE2, M_IV_SYSINSERTDATE, M_IV_KOMMENTAR, M_IV_TAXAMOUNT1, M_IV_TAXAMOUNT2, M_IV_TOTALTAXAMOUNT FROM CHRONOS_EKSADH WHERE M_IV_STATUS = 'Validation' AND M_IV_RESERVEDBY IS NULL""")
    for row in rows:
        invs.append({
            "M_IV_ID": row[0],
            "MAIL_ID": row[1],
            "M_IV_BARCODE": row[2],
            "M_IV_MANDANT": row[3],
            "M_IV_INVOICENUMBER": row[4],
            "M_IV_KINDOFINVOICE": row[5],
            "M_IV_INVOICETYPE": row[6],
            "M_IV_KREDITOR": row[7],
            "M_IV_IBAN": row[8],
            "M_IV_INVOICEDATE": datetime.strftime(row[9], '%Y-%m-%d') if row[9] is not None else None,
            "M_IV_DELIVERYDATE": datetime.strftime(row[10], '%Y-%m-%d') if row[10] is not None else None,
            "M_IV_DELIVERYDATE_BIS": datetime.strftime(row[11], '%Y-%m-%d') if row[11] is not None else None,
            "M_IV_ORDERID": row[12],
            "M_IV_INVOICEAMOUNT": row[13],
            "M_IV_TOTALAMOUNT": row[14],
            "M_IV_TAXRATE1": row[15],
            "M_IV_NETBASE1": row[16],
            "M_IV_TAXRATE2": row[17],
            "M_IV_NETBASE2": row[18],
            "M_IV_SYSINSERTDATE": row[19],
            "M_IV_KOMMENTAR": row[20],
            "M_IV_TAXAMOUNT1": row[21],
            "M_IV_TAXAMOUNT2": row[22],
            "M_IV_TOTALTAXAMOUNT": row[23]
        })
    return { "invoices": invs } 

@app.route("/get_free_invoice_val", methods=["GET"])
@is_logged_in
def get_get_free_invoice():
    rows = select("SELECT M_IV_BARCODE FROM CHRONOS_EKSADH WHERE M_IV_STATUS = 'Validation' AND (M_IV_RESERVEDBY IS NULL) AND M_IV_KREDITOR NOT IN (SELECT M_IV_KREDITOR FROM CHRONOS_TEMPLATE_SUPPLIERS) AND ROWNUM = 1", [])
    for row in rows:
        return { "M_IV_BARCODE": row[0] }
    return { "M_IV_BARCODE": 0 }

@app.route("/get_free_invoice_val", methods=["POST"])
@is_logged_in
def post_get_free_invoice_val():
    logging.info("Returning invoice for barcode " + request.json["M_IV_BARCODE"] + " to user " + session["username"])
    rows = select("""SELECT M_CN_ID, M_CN_MAIL_ID, M_IV_BARCODE, M_IV_MANDANT, M_IV_INVOICENUMBER, M_IV_KINDOFINVOICE, M_IV_INVOICETYPE, M_IV_KREDITOR,
    M_IV_IBAN, M_IV_INVOICEDATE, M_IV_DELIVERYDATE, M_IV_DELIVERYDATE_BIS, M_IV_ORDERID, M_IV_INVOICEAMOUNT, M_IV_TOTALAMOUNT, M_IV_TAXRATE1, M_IV_NETBASE1,
    M_IV_TAXRATE2, M_IV_NETBASE2, M_IV_SYSINSERTDATE, M_IV_KOMMENTAR, M_IV_TAXAMOUNT1, M_IV_TAXAMOUNT2, M_IV_TOTALTAXAMOUNT, S_KR_NAME1 || ' ' || S_KR_NAME2, M_IV_MAIL_SUBJECT, M_IV_CURRENCY FROM CHRONOS_EKSADH LEFT JOIN S_KR_KREDITOR ON M_IV_KREDITOR = S_KR_KREDITOR WHERE M_IV_BARCODE = :1""", [request.json["M_IV_BARCODE"]])
    for row in rows:
        # block invoice first
        db_exec("UPDATE CHRONOS_EKSADH SET M_IV_RESERVEDBY = :1 WHERE M_CN_ID = :2", [session["username"], row[0]])
        inv_typ = row[6]
        if inv_typ == "EKS":
            inv_typ = "Standard"
        elif inv_typ == "REP":
            inv_typ = "Reparatur"
        elif inv_typ == "GUT":
            inv_typ = "Gutachten"
        elif inv_typ == "TRA":
            inv_typ = "Transport"
        kind_of_invoice = row[5]
        if kind_of_invoice == "RE":
            kind_of_invoice = "Rechnung"
        elif kind_of_invoice == "GU":
            kind_of_invoice = "Gutschrift"
        return {
            "M_IV_ID": row[0],
            "MAIL_ID": row[1],
            "M_IV_BARCODE": row[2],
            "M_IV_MANDANT": row[3],
            "M_IV_INVOICENUMBER": row[4],
            "M_IV_KINDOFINVOICE": kind_of_invoice,
            "M_IV_INVOICETYPE": inv_typ,
            "M_IV_KREDITOR": row[7],
            "M_IV_IBAN": row[8],
            "M_IV_INVOICEDATE": datetime.strftime(row[9], '%Y-%m-%d') if row[9] is not None else None,
            "M_IV_DELIVERYDATE": datetime.strftime(row[10], '%Y-%m-%d') if row[10] is not None else None,
            "M_IV_DELIVERYDATE_BIS": datetime.strftime(row[11], '%Y-%m-%d') if row[11] is not None else None,
            "M_IV_ORDERID": row[12],
            "M_IV_INVOICEAMOUNT": row[13],
            "M_IV_TOTALAMOUNT": row[14],
            "M_IV_TAXRATE1": row[15],
            "M_IV_NETBASE1": row[16],
            "M_IV_TAXRATE2": row[17],
            "M_IV_NETBASE2": row[18],
            "M_IV_SYSINSERTDATE": row[19],
            "M_IV_KOMMENTAR": row[20],
            "M_IV_TAXAMOUNT1": row[21],
            "M_IV_TAXAMOUNT2": row[22],
            "M_IV_TOTALTAXAMOUNT": row[23],
            "S_KR_NAME": row[24],
            "M_IV_MAIL_SUBJECT": row[25],
            "M_IV_CURRENCY": row[26]
        }
    return { "M_IV_ID": 9999999 }

# empty all reserved invoices
@app.route("/reset_reserved", methods=["GET"])
@is_logged_in
def get_reset_reserved():
    if db_exec("UPDATE CHRONOS_EKSADH SET M_IV_RESERVEDBY = null WHERE M_IV_RESERVEDBY = :1", [session["username"]]):
        return { "success": True }
    return { "success": False }

# logout from Highway
@app.route("/logout", methods=["GET"])
@is_logged_in
def get_logout():
    if "username" in session:
        session.pop("username")
    return render_template("login.html")

# save the changes in an invoice
@app.route("/save_data", methods=["POST"])
@is_logged_in
def post_save_data():
    logging.info(request.json)
    gross = make_number(request.json["M_IV_TOTALAMOUNT"])
    if int(request.json["M_IV_MANDANT"]) == 88:
        gross = make_number(request.json["M_IV_INVOICEAMOUNT"])
    inv_typ = request.json["M_IV_INVOICETYPE"]
    if inv_typ == "Standard":
        inv_typ = "EKS"
    elif inv_typ == "Reparatur":
        inv_typ = "REP"
    elif inv_typ == "Gutachten":
        inv_typ = "GUT"
    elif inv_typ == "Transport":
        inv_typ = "TRA"
    kind_of_invoice = request.json["M_IV_KINDOFINVOICE"]
    if kind_of_invoice == "Rechnung":
        kind_of_invoice = "RE"
    elif kind_of_invoice == "Gutschrift":
        kind_of_invoice = "GU"
    if db_exec("""UPDATE CHRONOS_EKSADH SET M_IV_MANDANT = :1, M_IV_INVOICENUMBER = :2, M_IV_KINDOFINVOICE = :3, M_IV_INVOICETYPE = :4, 
            M_IV_KREDITOR = :5, M_IV_INVOICEDATE = :6, M_IV_DELIVERYDATE = :7, M_IV_DELIVERYDATE_BIS = :8, M_IV_ORDERID = :9, 
            M_IV_INVOICEAMOUNT = :10, M_IV_TOTALAMOUNT = :11, M_IV_TAXRATE1 = :12, M_IV_NETBASE1 = :13, M_IV_TAXRATE2 = :14, M_IV_NETBASE2 = :15, M_IV_KOMMENTAR = :16, M_IV_TAXAMOUNT1 = :17, M_IV_TAXAMOUNT2 = :18, M_IV_TOTALTAXAMOUNT = :19, M_IV_CURRENCY = :20 WHERE M_CN_ID = :21""", [
                request.json["M_IV_MANDANT"],
                request.json["M_IV_INVOICENUMBER"],
                kind_of_invoice,
                inv_typ,
                request.json["M_IV_KREDITOR"],
                datetime.strptime(request.json["M_IV_INVOICEDATE"], '%Y-%m-%d') if request.json["M_IV_INVOICEDATE"] is not None else None,
                datetime.strptime(request.json["M_IV_DELIVERYDATE"], '%Y-%m-%d') if request.json["M_IV_DELIVERYDATE"] is not None else None,
                datetime.strptime(request.json["M_IV_DELIVERYDATE_BIS"], '%Y-%m-%d') if request.json["M_IV_DELIVERYDATE_BIS"] is not None else None,
                request.json["M_IV_ORDERID"],
                make_number(request.json["M_IV_INVOICEAMOUNT"]),
                gross,
                make_number(request.json["M_IV_TAXRATE1"]),
                make_number(request.json["M_IV_NETBASE1"]),
                make_number(request.json["M_IV_TAXRATE2"]),
                make_number(request.json["M_IV_NETBASE2"]),
                request.json["M_IV_KOMMENTAR"],
                make_number(request.json["M_IV_TAXAMOUNT1"]),
                make_number(request.json["M_IV_TAXAMOUNT2"]),
                make_number(request.json["M_IV_TOTALTAXAMOUNT"]),
                request.json["M_IV_CURRENCY"],
                request.json["M_IV_ID"],
            ]):
        return { "success": True }
    return { "success": False, "messages": ["Es gibt ein Problem mit dem Server, bitte Laurenz Bescheid geben"] }

@app.route("/finish_validation", methods=["POST"])
@is_logged_in
def post_finish_validation():
    # first, check if all fields are filled
    if request.json["NEW_STATUS"] != "Validated":
        if db_exec("UPDATE CHRONOS_EKSADH SET M_IV_VALIDATIONDATE = sysdate, M_IV_VALIDATEDBY = :1, M_IV_STATUS = :2 WHERE M_CN_ID = :3", [session["username"], request.json["NEW_STATUS"], request.json["M_IV_ID"]]):
            return { "success": True }
        return { "success": False, "messages": ["Es gibt ein Problem mit dem Server, bitte Laurenz Bescheid geben"] }
    elif select("""SELECT COUNT(*) FROM CHRONOS_EKSADH INNER JOIN S_MD_MANDANTEN ON S_MD_FIR = M_IV_MANDANT INNER JOIN S_KR_KREDITOR ON M_IV_KREDITOR = S_KR_KREDITOR WHERE M_CN_ID = :1 AND M_IV_MANDANT IS NOT NULL AND M_IV_INVOICENUMBER IS NOT NULL AND M_IV_CURRENCY IS NOT NULL AND M_IV_KINDOFINVOICE IS NOT NULL AND
                M_IV_INVOICETYPE IS NOT NULL AND M_IV_KREDITOR IS NOT NULL AND M_IV_INVOICEDATE IS NOT NULL AND M_IV_INVOICEAMOUNT IS NOT NULL AND M_IV_TOTALAMOUNT IS NOT NULL AND abs(M_IV_TOTALAMOUNT - M_IV_INVOICEAMOUNT - M_IV_TOTALTAXAMOUNT) <= 0.05 """, [request.json["M_IV_ID"]])[0][0] == 1:
        if db_exec("UPDATE CHRONOS_EKSADH SET M_IV_VALIDATIONDATE = sysdate, M_IV_VALIDATEDBY = :1, M_IV_STATUS = :2 WHERE M_CN_ID = :3", [session["username"], request.json["NEW_STATUS"], request.json["M_IV_ID"]]):
            return { "success": True }
        else:
            return { "success": False, "messages": ["Es gibt ein Problem mit dem Server, bitte Laurenz Bescheid geben"] }
    else:
        return { "success": False, "messages": ["Es sind nicht alle Pflichtfelder gefüllt"] }

@app.route('/')
@is_logged_in
def index():
    return app.send_static_file('index.html')



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=config("SERVER_PORT"))