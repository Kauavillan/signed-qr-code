import { z } from "zod";

// Schemas de campos individuais reutilizáveis
export const emailSchema = z
  .string({
    required_error: "E-mail é obrigatório",
    invalid_type_error: "E-mail inválido",
  })
  .min(1, "E-mail é obrigatório")
  .email("E-mail inválido")
  .nonempty("Obrigatório");

export const passwordSchema = z
  .string({
    required_error: "Senha é obrigatória",
    invalid_type_error: "Senha inválida",
  })
  .min(1, "Senha é obrigatória")
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .refine(
    (value) => /[0-9]/.test(value) || /[^A-Za-z0-9]/.test(value),
    "A senha deve conter pelo menos um número ou caractere especial"
  );

export const nameSchema = z
  .string({
    required_error: "Nome é obrigatório",
    invalid_type_error: "Nome inválido",
  })
  .min(1, "Nome é obrigatório")
  .min(3, "O nome deve ter no mínimo 3 caracteres");

export const phoneSchema = z
  .string({
    required_error: "Telefone é obrigatório",
    invalid_type_error: "Telefone inválido",
  })
  .min(1, "Telefone é obrigatório")
  .regex(
    /^\(\d{2}\) \d{4,5}-\d{4}$/,
    "Formato de telefone inválido. Use (XX) XXXXX-XXXX"
  );

export const tokenSchema = z
  .string({
    required_error: "O token é obrigatório",
    invalid_type_error: "Token inválido",
  })
  .length(4, "O token deve ter exatamente 4 caracteres")
  .regex(/^\d{4}$/, "O token deve conter apenas números");

// Schemas de formulários completos
export const loginFormSchema = z.object({
  identifier: z
    .string({
      required_error: "Informe o e-mail ou nome de usuário",
      invalid_type_error: "Campo inválido",
    })
    .min(1, "Informe o e-mail ou nome de usuário"),
  password: passwordSchema,
});

export const signUpFormSchema = z
  .object({
    username: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string({
        required_error: "Confirmação de senha é obrigatória",
        invalid_type_error: "Confirmação de senha inválida",
      })
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const emailOnlySchema = z.object({
  email: emailSchema,
});

export const tokenOnlySchema = z.object({
  token: tokenSchema,
});

export const qrCodeContentSchema = z.object({
  content: z
    .string({
      required_error: "Conteúdo do QR Code é obrigatório",
      invalid_type_error: "Conteúdo do QR Code inválido",
    })
    .max(2500, "O conteúdo do QR Code deve ter no máximo 2500 caracteres"),
});

export const userDataSchema = z
  .object({
    username: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string({
        required_error: "Confirmação de senha é obrigatória",
        invalid_type_error: "Confirmação de senha inválida",
      })
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
  });

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string({
        required_error: "Confirmação de senha é obrigatória",
        invalid_type_error: "Confirmação de senha inválida",
      })
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// Campo opcional com mínimo de 5 caracteres caso seja fornecido
export const complaintReportSchema = z.object({
  details: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || value.trim().length === 0 || value.trim().length >= 5,
      {
        message: "A descrição deve ter no mínimo 5 caracteres",
        path: ["details"],
      }
    ),
});

// Tipos inferidos dos schemas
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type EmailOnlyData = z.infer<typeof emailOnlySchema>;
export type QrCodeContentData = z.infer<typeof qrCodeContentSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
export type TokenOnlyData = z.infer<typeof tokenOnlySchema>;
export type UserData = z.infer<typeof userDataSchema>;
export type ComplaintReportFormData = z.infer<typeof complaintReportSchema>;
