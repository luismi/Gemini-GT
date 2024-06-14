import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { defineFlow, startFlowsServer } from '@genkit-ai/flow';
import { geminiPro } from '@genkit-ai/googleai';
import * as z from 'zod';
import { googleAI } from '@genkit-ai/googleai';

configureGenkit({
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// Define a schema
const OutputSchema = z.object({
  tipo: z.string().describe("Cazador', 'Pastor', 'Asistencia', 'Pelea', 'Tiro'"),
  peso: z.string().describe("El peso debe ser en kilos"),
  antepasados: z.array(z.string()).optional(),
  patologias: z.string().optional(),
  discoveredBy: z.string().optional(),
  discoveryDate: z.string().optional(),
  descripcion: z.string().optional()
});


export const menuSuggestionFlow = defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: OutputSchema,
  },
  async (subject) => {
    const llmResponse = await generate({
      prompt: `Eres un experto criador de perros, hablame de la raza ${subject}`,
      model: geminiPro,
      output : {schema: OutputSchema},
      config: {
        temperature: 1,
      },
    });

    return llmResponse.output()!;
  }
);

startFlowsServer();
