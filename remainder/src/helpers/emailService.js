import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};


export const sendReminderEmail = async ({
  to,
  eventTitle,
  eventDescription,
  eventDate,
  location,
  reminderTimeMinutes = 60,
}) => {
  try {
    const transporter = createTransporter();

    // Format the event date
    const eventDateFormatted = new Date(eventDate).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const reminderText =
      reminderTimeMinutes >= 60
        ? `${Math.floor(reminderTimeMinutes / 60)} hour${
            Math.floor(reminderTimeMinutes / 60) > 1 ? "s" : ""
          }`
        : `${reminderTimeMinutes} minute${reminderTimeMinutes > 1 ? "s" : ""}`;

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .event-details {
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
          }
          .detail-row {
            margin: 10px 0;
          }
          .detail-label {
            font-weight: bold;
            color: #555;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #777;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📅 Event Reminder</h2>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>This is a reminder that you have an event coming up in <strong>${reminderText}</strong>:</p>
            
            <div class="event-details">
              <div class="detail-row">
                <span class="detail-label">Event:</span> ${eventTitle}
              </div>
              ${eventDescription ? `
              <div class="detail-row">
                <span class="detail-label">Description:</span> ${eventDescription}
              </div>
              ` : ""}
              <div class="detail-row">
                <span class="detail-label">Date & Time:</span> ${eventDateFormatted}
              </div>
              ${location ? `
              <div class="detail-row">
                <span class="detail-label">Location:</span> ${location}
              </div>
              ` : ""}
            </div>
            
            <p>Don't forget to attend!</p>
          </div>
          <div class="footer">
            <p>This is an automated reminder email from the Event Management System.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Event Reminder System" <${process.env.SMTP_USER}>`,
      to,
      subject: `Reminder: ${eventTitle} starts in ${reminderText}`,
      html: emailHTML,
      text: `
        Event Reminder
        
        You have an event coming up in ${reminderText}:
        
        Event: ${eventTitle}
        ${eventDescription ? `Description: ${eventDescription}\n` : ""}
        Date & Time: ${eventDateFormatted}
        ${location ? `Location: ${location}\n` : ""}
        
        Don't forget to attend!
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending reminder email to ${to}:`, error);
    return { success: false, error: error.message };
  }
};

