import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import base64


class GmailSender:
    def __init__(self, client_secrets_file):
        self.client_secrets_file = client_secrets_file
        self.SCOPES = ['https://www.googleapis.com/auth/gmail.send']
        self.creds = None
        self.service = None

    def authenticate(self):
        """Authenticate with Gmail API"""
        # Check if we have valid credentials
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                self.creds = pickle.load(token)

        # If credentials are invalid or don't exist, get new ones
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.client_secrets_file,
                    self.SCOPES,
                    redirect_uri='http://localhost:8080'
                )
                self.creds = flow.run_local_server(port=8080)  # Fixed port

            # Save credentials for future use
            with open('token.pickle', 'wb') as token:
                pickle.dump(self.creds, token)

        # Build the Gmail service
        self.service = build('gmail', 'v1', credentials=self.creds)

    def create_message(self, sender, to, subject, message_text, html=None):
        """Create email message"""
        msg = MIMEMultipart('alternative')
        msg['to'] = to
        msg['from'] = sender
        msg['subject'] = subject

        # Add plain text version
        msg.attach(MIMEText(message_text, 'plain'))

        # Add HTML version if provided
        if html:
            msg.attach(MIMEText(html, 'html'))

        # Encode the message
        raw_msg = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')
        return {'raw': raw_msg}

    def send_email(self, sender, to, subject, message_text, html=None):
        """Send email using Gmail API"""
        try:
            if not self.service:
                self.authenticate()

            message = self.create_message(sender, to, subject, message_text, html)
            sent_message = self.service.users().messages().send(
                userId='me', body=message).execute()
            print(f'Message Id: {sent_message["id"]}')
            return True
        except Exception as e:
            print(f'An error occurred: {e}')
            return False


# Main execution code
if __name__ == "__main__":
    # Path to your client secrets file
    # client_secrets_file = 'client_secrets.json'  # Make sure this file is in your project directory
    client_secrets_file = 'client_secret_521178691585-quhpkvpbvddm3c906s48j5ml55v97591.apps.googleusercontent.com.json'

    # Create Gmail sender instance
    gmail_sender = GmailSender(client_secrets_file)

    # Example email details
    sender = "shophashmal@gmail.com"
    to = "anzori94@gmail.com"
    subject = "Test Email from Gmail API"
    message_text = "This is a test email sent using the Gmail API"
    html = """
    <html>
        <body>
            <h1>Test Email</h1>
            <p>This is a test email sent using the <b>Gmail API</b></p>
        </body>
    </html>
    """

    # Send the email
    success = gmail_sender.send_email(
        sender=sender,
        to=to,
        subject=subject,
        message_text=message_text,
        html=html
    )

    if success:
        print("Email sent successfully!")
    else:
        print("Failed to send email.")