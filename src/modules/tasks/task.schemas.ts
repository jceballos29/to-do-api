import { z } from "zod";

export const getTasksSchema = z.object({
  query: z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
      error: 'El estado debe ser uno de los siguientes valores: PENDING, IN_PROGRESS, COMPLETED'
    }).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
      error: 'La prioridad debe ser uno de los siguientes valores: LOW, MEDIUM, HIGH'
    }).optional(),
    page: z.string().regex(/^\d+$/, {
      error: 'El número de página debe ser un número entero positivo'
    }).optional(),
    limit: z.string().regex(/^\d+$/, {
      error: 'El número de tareas por página debe ser un número entero positivo'
    }).optional(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc'], {
      error: 'El orden debe ser uno de los siguientes valores: asc, desc'
    }).optional(),
    search: z.string().min(2).max(100).optional()
  })
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string(
      {
        error: 'El título es obligatorio',
      }
    ).min(2,
      {
        error: 'El título debe tener al menos 2 caracteres'
      }
    ).max(100,
      {
        error: 'El título debe tener como máximo 100 caracteres'
      }
    ),
    description: z.string(
      {
        error: 'La descripción es obligatoria',
      }
    ).min(5,
      {
        error: 'La descripción debe tener al menos 5 caracteres'
      }
    ).max(500,
      {
        error: 'La descripción debe tener como máximo 500 caracteres'
      }
    ),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
      error: 'La prioridad debe ser uno de los siguientes valores: LOW, MEDIUM, HIGH'
    }).optional(),
  })
});

export const getTaskSchema = z.object({
  params: z.object({
    id: z.string({
      error: 'El ID de la tarea es obligatorio',
    })
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string({
      error: 'El ID de la tarea es obligatorio',
    })
  }),
  body: z.object({
    title: z.string({
      error: 'El título es obligatorio',
    }).min(2,
      {
        error: 'El título debe tener al menos 2 caracteres'
      }
    ).max(100,
      {
        error: 'El título debe tener como máximo 100 caracteres'
      }
    ).optional(),
    description: z.string(
      {
        error: 'La descripción es obligatoria',
      }
    ).min(5,
      {
        error: 'La descripción debe tener al menos 5 caracteres'
      }
    ).max(500,
      {
        error: 'La descripción debe tener como máximo 500 caracteres'
      }
    ).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
      error: 'La prioridad debe ser uno de los siguientes valores: LOW, MEDIUM, HIGH'
    }).optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
      error: 'El estado debe ser uno de los siguientes valores: PENDING, IN_PROGRESS, COMPLETED'
    }).optional(),
  })
});

export const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string({
      error: 'El ID de la tarea es obligatorio',
    })
  })
});

export type GetTasksInput = z.infer<typeof getTasksSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type GetTaskInput = z.infer<typeof getTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
