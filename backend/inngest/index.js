import { Inngest } from "inngest";
import Order from "../models/Order.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "luvowear-ecommerce",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

console.log("Inngest event key:", process.env.INNGEST_EVENT_KEY);

// // Define your background functions here
// const sendWelcomeEmail = inngest.createFunction(
//   { id: "welcome-email" },
//   { event: "user/registered" },

//   async ({ event, step }) => {
//     const { email } = event.data;
//     await step.sleep("wait-a-moment", "5s");
//     return `📧 Sending welcome email to ${email}`;
//   }
// );

const orderCreatedEmail = inngest.createFunction(
  { id: "order-confirmation-email" },
  { event: "order/created" },

  async ({ event }) => {
    const { orderId } = event.data;
    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const toEmail = order.user.email;
    const subject = `📦 ORDER CONFIRMATION — #${order._id}`;
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dzzwpscr0/image/upload/v1752256705/luvowear_icon_mhssvg.png" 
          alt="LuvoWear Logo" 
          style="width: 150px; height: auto;" />
      </div>
      <h2 style="margin-bottom: 20px;">Hi ${order.user.name},</h2>

      <p style="margin-bottom: 15px; font-weight: 5px; font-size: 17px;">Thank you for your order! We're excited to process it for you.</p>

      <table style="border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #ddd;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Order ID:</td>
          <td style="padding: 12px; border: 1px solid #ddd;">
            <a href="${process.env.BASE_URL}/orders/${
      order._id
    }" style="text-decoration: none; color: #09b6c8;">
              #${order._id}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Order Date:</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${new Date(
            order.createdAt
          ).toLocaleDateString()}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Total Amount:</td>
          <td style="padding: 12px; border: 1px solid #ddd; font-size: 18px; font-weight: bold;">$${order.totalPrice.toFixed(
            2
          )}</td>
        </tr>
      </table>

      <div style="background-color: #dafbff; padding: 15px 20px; border-radius: 5px; margin: 20px 0;">
        <strong>What's next?</strong><br>
        <p style="margin: 8px 0;">
          We will notify you once your order has been processed and shipped. You can track your order status in your account.
        </p>
      </div>

      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong style="color: #09b6c8;">The LuvoWear Team</strong>
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      
      <p style="font-size: 12px; color: #666; text-align: center;">
        This email was sent regarding your order. If you have any questions, please contact our support team.
      </p>
    </div>
    `;

    await transporter.sendMail({
      from: `"LuvoWear" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject,
      html: htmlContent,
    });
  }
);

const orderDeliveredEmail = inngest.createFunction(
  { id: "order-delivered-email" },
  { event: "order/delivered" },

  async ({ event }) => {
    const { orderId } = event.data;
    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      console.error(`Order not found: ${orderId}`);
      throw new Error(`Order ${orderId} not found`);
    }

    const deliveredDate = new Date(order.deliveredAt).toLocaleDateString();

    const htmlContent = `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/dzzwpscr0/image/upload/v1752256705/luvowear_icon_mhssvg.png" 
            alt="LuvoWear Logo" 
            style="width: 150px; height: auto;" />
      </div>

      <h2 style="margin-bottom: 20px;">Hi ${order.user.name},</h2>

      <p style="margin-bottom: 15px; font-weight: 500; font-size: 17px;">Your order has been successfully delivered! 🎉</p>

      <table style="border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #ddd;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Order ID:</td>
           <td style="padding: 12px; border: 1px solid #ddd;">
            <a href="${process.env.BASE_URL}/orders/${
      order._id
    }" style="text-decoration: none; color: #09b6c8;">
              #${order._id}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Delivered Date:</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${deliveredDate}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Total Amount:</td>
          <td style="padding: 12px; border: 1px solid #ddd; font-size: 18px; font-weight: bold;">$ ${order.totalPrice.toFixed(
            2
          )}</td>
        </tr>
      </table>

      <div style="background-color: #e7ffe9; padding: 15px 20px; border-radius: 5px; margin: 20px 0;">
        <strong>We hope you love your order!</strong><br>
        <p style="margin: 8px 0;">
          If you have any feedback or questions, feel free to reach out to our support team anytime.
        </p>
      </div>

      <p style="margin-top: 30px;">
        Thank you for choosing <strong style="color: #09b6c8;">LuvoWear</strong>.<br>
        We look forward to serving you again!
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

      <p style="font-size: 12px; color: #666; text-align: center;">
        This email is regarding your recent delivery. For assistance, contact support.
      </p>
    </div>
    `;

    await transporter.sendMail({
      from: `"LuvoWear" <${process.env.SMTP_USER}>`,
      to: order.user.email,
      subject: `✅ ORDER DELIVERED — #${order._id}`,
      html: htmlContent,
    });
  }
);

export const functions = [orderCreatedEmail, orderDeliveredEmail];
