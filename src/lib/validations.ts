import { z } from "zod";

export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Вкажіть ім'я")
    .max(120, "Занадто довге ім'я"),
  contact: z
    .string()
    .trim()
    .min(5, "Вкажіть телефон або спосіб зв'язку")
    .max(180, "Занадто довгий контакт"),
  hasMilitaryExperience: z.enum(["yes", "no", "unknown"]).optional(),
  direction: z.string().trim().max(120).optional(),
  vacancyId: z.string().uuid().optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional(),
  privacyAccepted: z.boolean().refine((v) => v === true, {
    message: "Потрібно підтвердити ознайомлення з політикою конфіденційності",
  }),
  website: z.string().max(0).optional(), // honeypot
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const loginSchema = z.object({
  email: z.string().email("Некоректний email"),
  password: z.string().min(8, "Мінімум 8 символів"),
});
