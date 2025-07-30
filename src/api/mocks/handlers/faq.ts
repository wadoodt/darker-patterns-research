import { db } from "../db";

export const getFAQs = async (): Promise<Response> => {
  const faqs = db.faqs.findMany({});
  return new Response(JSON.stringify(faqs), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const createFAQ = async (request: Request): Promise<Response> => {
  try {
    const body = await request.json();
    if (!body || !body.question || !body.answer) {
      return new Response("Invalid request body", { status: 400 });
    }
    const newFAQ = db.faqs.create({
      ...body,
      category: body.category || "pricing",
    });
    return new Response(JSON.stringify(newFAQ), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to create FAQ", { status: 500 });
  }
};

export const updateFAQ = async (
  request: Request,
  { id }: { id: string }
): Promise<Response> => {
  const body = await request.json();
  const updatedFAQ = db.faqs.update({
    where: { id },
    data: body,
  });

  if (!updatedFAQ) {
    return new Response("FAQ not found", { status: 404 });
  }

  return new Response(JSON.stringify(updatedFAQ), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteFAQ = async ({ id }: { id: string }): Promise<Response> => {
  const deletedFAQ = db.faqs.delete({ where: { id } });
  
  if (!deletedFAQ) {
    return new Response("FAQ not found", { status: 404 });
  }

  return new Response(null, { status: 204 });
};
