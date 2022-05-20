from decouple import config
import smtplib
import re
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.mime.text import MIMEText


def make_number(val):
    if val == None:
        return None
    if type(val) == float or type(val) == int:
        return val
    val = re.sub(r'[^0-9.,]', '', val)
    if not '.' in val and not ',' in val:
        return val
    if '.' in val and ',' in val:
        if val.index(',') < val.index('.'):
            # comma comes first
            val = re.sub(r',', '', val)
        else:
            # dot comes first
            val = re.sub(r'\.', '', val)
    val = re.sub(r',', '.', val)
    if len(re.findall(r'\.', val)) > 1:
        return None
    return val



en_html = """\
        <html>
        <body>
            <p>Dear Sir or Madam,<br><br>
            The party renting the vehicle {amt} on {dat} at {uhr} was:<br><br>
            {forename}<br>
            {surname}<br>
            {street}<br>
            {zip} {city}<br>
            {country}<br><br>
            DOB: {birthDay}<br><br>
            We remain at your disposal if you have any further questions.<br><br>
            Kind regards,<br><br>
            </p>
        </body>
        </html>
        """

de_html = """\
        <html>
        <body>
            <p>Sehr geehrte Damen und Herren,<br><br>
            Mieter des Fahrzeugs mit dem amtlichen Kennzeichen {amt} am {dat} um {uhr} war:<br><br>
            {forename}<br>
            {surname}<br>
            {street}<br>
            {zip} {city}<br>
            {country}<br><br>
            
            Geburtsdatum: {birthDay}<br><br>
            Der Fahrer ist uns nicht bekannt.<br><br>
            Mit freundlichen Grüßen<br><br>
            </p>
        </body>
        </html>
        """

def get_normalized_uhr(uhr):
    uhr = str(uhr).zfill(4)
    return uhr[:2] + ":" + uhr[-2:]

def get_normalized_dat(dat):
    if dat.count('-') != 2:
        return dat
    dats = dat.split('-')
    return dats[2] + "." + dats[1] + "." + dats[0]

def send_driver_information(mail, owiData, driverData, lang):
    recipients = [mail]
    
    html = de_html if lang == "de" else en_html 
    
    html = html.format(amt=owiData["amt"], 
            dat=get_normalized_dat(owiData["dat"]),
            uhr=get_normalized_uhr(owiData["uhr"]), 
            forename=driverData["forename"], 
            surname=driverData["surname"], 
            street=driverData["street"], 
            zip=driverData["zip"], 
            city=driverData["city"],
            country=driverData["driverCountry"],
            birthDay=driverData["birthDay"]
            )

    html += """
    <img src="cid:sixt.png" alt="Sixt Logo" width="150"><br><br>
    Sixt GmbH & Co. Autovermietung KG · Grubenstraße 27 · 18055 Rostock<br>
    Sitz der Gesellschaft: Pullach, Landkreis München<br>
    Handelsregister beim Amtsgericht München: HRA 81 061<br>
    Persönlich haftende Gesellschafterin: Sixt Verwaltungs-GmbH<br>
    Sitz der persönlich haftenden Gesellschafterin: Wien, Österreich<br>
    Firmenbuch des LG Wiener Neustadt: FN 474075w<br>
    Geschäftsführer: Dirk Hünten, Lars-Eric Peters, Vinzenz Pflanz, Timo Schuster<br>
    """
    
    msg = MIMEMultipart()
    msg["Subject"] = "Aktenzeichen " + owiData["aktz"] if lang == "de" else "Reference " + owiData["aktz"]
    msg["To"] = mail

    msg.attach(MIMEText(html, 'html', 'utf-8'))

    # determine the sender
    rate = driverData["rate"] or ""
    rate = rate.lower()
    sender = "traffic-offences@sixt.com"
    # sender mail address will be set depending on driver address
    if rate.startswith("be") or rate.startswith("nl") or rate.startswith("lu"):
        sender = "traffic-benelux@sixt.com"
    elif rate.startswith("de"):
        sender = "traffic-de@sixt.com"
    elif rate.startswith("gb"):
        sender = "traffic-uk@sixt.com"
    elif rate.startswith("at"):
        sender = "fines-at@sixt.com"
    elif rate.startswith("ch"):
        sender = "fines-ch@sixt.com"
    elif rate.startswith("fr"):
        sender = "fines-fr@sixt.com"

    msg["From"] = sender
    with open("sixt.png", 'rb') as f:
        sixt_logo = MIMEImage(f.read())
    sixt_logo.add_header("Content-ID", "<sixt.png>")
    msg.attach(sixt_logo)

    with smtplib.SMTP(config("SMTP_SERVER"), config("SMTP_PORT")) as server:
        server.sendmail(sender, recipients, msg.as_string())
    
    return True