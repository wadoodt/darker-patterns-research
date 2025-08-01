import type { SupportTicket } from "@api/domains/support/types";

export const mockKnowledgeBaseArticles = [
  {
    id: "kl-1",
    title: "Integrating with Third-Party APIs",
    description: "A guide on how to connect your account with other services.",
    category: "Integrations",
    url: "#",
    translations: {
      en: {
        title: "Integrating with Third-Party APIs",
        description:
          "A guide on how to connect your account with other services.",
        category: "Integrations",
        body: "To integrate with a third-party API, navigate to the Settings > Integrations page. From there, you can select from a list of supported services. Click “Connect” and follow the on-screen instructions to authorize the connection. You will typically need an API key from the third-party service.",
      },
      es: {
        title: "Integración con APIs de Terceros",
        description:
          "Una guía sobre cómo conectar tu cuenta con otros servicios.",
        category: "Integraciones",
        body: "Para integrar con una API de terceros, ve a la página de Ajustes > Integraciones. Desde allí, puedes seleccionar de una lista de servicios compatibles. Haz clic en “Conectar” y sigue las instrucciones en pantalla para autorizar la conexión. Generalmente, necesitarás una clave de API del servicio de terceros.",
      },
    },
  },
  {
    id: "kl-2",
    title: "Advanced Email Automation Rules",
    description: "Learn how to create complex automation workflows.",
    category: "Automation",
    url: "#",
    translations: {
      en: {
        title: "Advanced Email Automation Rules",
        description: "Learn how to create complex automation workflows.",
        category: "Automation",
        body: "Our automation builder allows you to create powerful workflows. Start by selecting a trigger, such as “Subscriber joins a list.” Then, add actions like “Send an email” or “Add a tag.” You can create complex logic with conditions and branching to tailor the experience for your audience.",
      },
      es: {
        title: "Reglas Avanzadas de Automatización de Correo",
        description:
          "Aprende a crear flujos de trabajo de automatización complejos.",
        category: "Automatización",
        body: "Nuestro constructor de automatización te permite crear flujos de trabajo potentes. Comienza seleccionando un disparador, como “Suscriptor se une a una lista.” Luego, añade acciones como “Enviar un correo” o “Añadir una etiqueta.” Puedes crear lógica compleja con condiciones y ramificaciones para personalizar la experiencia de tu audiencia.",
      },
    },
  },
  {
    id: "kl-3",
    title: "Understanding Your Analytics Dashboard",
    description:
      "Deep dive into the metrics and what they mean for your campaigns.",
    category: "Analytics",
    url: "#",
    translations: {
      en: {
        title: "Understanding Your Analytics Dashboard",
        description:
          "Deep dive into the metrics and what they mean for your campaigns.",
        category: "Analytics",
        body: "The analytics dashboard provides key metrics like open rate, click-through rate, and conversion rate. Use these insights to understand campaign performance and identify areas for improvement. You can filter by campaign, date range, and audience segment for a more granular view.",
      },
      es: {
        title: "Entendiendo tu Panel de Analíticas",
        description:
          "Profundiza en las métricas y lo que significan para tus campañas.",
        category: "Analíticas",
        body: "El panel de analíticas proporciona métricas clave como la tasa de apertura, la tasa de clics y la tasa de conversión. Utiliza estos conocimientos para comprender el rendimiento de la campaña e identificar áreas de mejora. Puedes filtrar por campaña, rango de fechas y segmento de audiencia para una vista más detallada.",
      },
    },
  },
  {
    id: "kl-4",
    title: "Customizing Email Templates",
    description: "Tips and tricks for making your emails stand out.",
    category: "Templates",
    url: "#",
    translations: {
      en: {
        title: "Customizing Email Templates",
        description: "Tips and tricks for making your emails stand out.",
        category: "Templates",
        body: "Customize your email templates using our drag-and-drop editor. You can add your logo, change colors, and select from a variety of fonts. For more advanced customization, you can edit the HTML source code directly. Remember to use responsive design principles to ensure your emails look great on all devices.",
      },
      es: {
        title: "Personalizando Plantillas de Correo",
        description: "Consejos y trucos para que tus correos destaquen.",
        category: "Plantillas",
        body: "Personaliza tus plantillas de correo electrónico con nuestro editor de arrastrar y soltar. Puedes añadir tu logotipo, cambiar colores y seleccionar entre una variedad de fuentes. Para una personalización más avanzada, puedes editar el código fuente HTML directamente. Recuerda utilizar principios de diseño responsivo para asegurar que tus correos se vean bien en todos los dispositivos.",
      },
    },
  },
  {
    id: "kl-5",
    title: "General Advice",
    description: "General advice for using the platform.",
    category: "General",
    url: "#",
    translations: {
      en: {
        title: "General Advice",
        description: "General advice for using the platform.",
        category: "General",
        body: "General advice for using the platform."
      },
      es: {
        title: "Consejos Generales",
        description: "Consejos generales para usar la plataforma.",
        category: "General",
        body: "Consejos generales para usar la plataforma."
      },
    },
  },
  {
    id: "kl-6",
    title: "General Advice",
    description: "General advice for using the platform.",
    category: "General",
    url: "#",
    translations: {
      en: {
        title: "General Advice",
        description: "General advice for using the platform.",
        category: "General",
        body: "General advice for using the platform."
      },
      es: {
        title: "Consejos Generales",
        description: "Consejos generales para usar la plataforma.",
        category: "General",
        body: "Consejos generales para usar la plataforma."
      },
    },
  },
  {
    id: "kl-7",
    title: "General Advice",
    description: "General advice for using the platform.",
    category: "General",
    url: "#",
    translations: {
      en: {
        title: "General Advice",
        description: "General advice for using the platform.",
        category: "General",
        body: "General advice for using the platform."
      },
      es: {
        title: "Consejos Generales",
        description: "Consejos generales para usar la plataforma.",
        category: "General",
        body: "Consejos generales para usar la plataforma."
      },
    },
  },
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "tkt-1",
    subject: "Cannot connect my Gmail account",
    email: "test.user@example.com",
    status: "open",
    createdAt: "2023-10-26T10:00:00Z",
    updatedAt: "2023-10-26T10:00:00Z",
    messages: [
      {
        author: "user",
        content:
          "I am trying to connect my Gmail account from the integrations page, but I keep getting an authentication error. I have double-checked my password and even tried an app password. Can you help?",
        createdAt: "2023-10-26T10:00:00Z",
      },
    ],
  },
  {
    id: "tkt-2",
    subject: "Question about automation rules",
    email: "another.user@example.com",
    status: "in_progress",
    createdAt: "2023-10-25T14:30:00Z",
    updatedAt: "2023-10-26T11:00:00Z",
    messages: [
      {
        author: "user",
        content:
          "Is it possible to create an automation rule that tags a user based on which link they click in an email? I want to segment my audience based on their interests.",
        createdAt: "2023-10-25T14:30:00Z",
      },
      {
        author: "support",
        content:
          "Yes, that is possible! You can use our link-click trigger in the automation builder. Let me know if you need help setting it up.",
        createdAt: "2023-10-26T11:00:00Z",
      },
    ],
  },
  {
    id: "tkt-3",
    subject: "Billing issue",
    email: "jane.doe@example.com",
    status: "closed",
    createdAt: "2023-10-24T09:00:00Z",
    updatedAt: "2023-10-25T17:45:00Z",
    messages: [
      {
        author: "user",
        content:
          "I was charged twice for my subscription this month. Please investigate and issue a refund.",
        createdAt: "2023-10-24T09:00:00Z",
      },
      {
        author: "support",
        content:
          "Apologies for the error. I have processed a refund for the duplicate charge. It should appear on your statement in 3-5 business days.",
        createdAt: "2023-10-25T17:45:00Z",
      },
    ],
  },
  {
    id: "tkt-4",
    subject: "Feature Request: Dark Mode",
    email: "feature.lover@example.com",
    status: "open",
    createdAt: "2023-10-27T11:20:00Z",
    updatedAt: "2023-10-27T11:20:00Z",
    messages: [
      {
        author: "user",
        content:
          "The app is great, but my eyes would really appreciate a dark mode. Any plans to add this?",
        createdAt: "2023-10-27T11:20:00Z",
      },
    ],
  },
];
