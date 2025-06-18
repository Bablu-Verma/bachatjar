// lib/sendMessage.ts
import Message from "@/model/Message";

interface SendMessageOptions {
  userId: string;
  title: string;
  body: string;
}

export async function sendMessage({ userId, title, body }: SendMessageOptions) {
  if (!userId || !title || !body) {
    throw new Error("Missing required fields for sending message.");
  }

  const message = await Message.create({
    userId,
    title,
    body,
    read: 'FALSE',
  });

  return message;
}
