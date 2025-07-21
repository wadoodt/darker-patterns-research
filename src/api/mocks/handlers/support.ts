import { db } from '../db';

// Corresponds to GET /api/support/articles
export const getSupportArticles = async () => {
  const articles = db.supportArticles.findMany({});

  // Simulate network delay to make loading states visible
  await new Promise(resolve => setTimeout(resolve, 1000));

  return new Response(JSON.stringify(articles), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
};

// Corresponds to POST /api/support/contact
export const createContactSubmission = async (request: Request) => {
  const submission = await request.json();

  // Basic validation
  if (!submission.name || !submission.email || !submission.message) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const newSubmission = db.contactSubmissions.create(submission);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return new Response(JSON.stringify(newSubmission), {
    status: 201, // Created
    headers: { 'Content-Type': 'application/json' },
  });
};
