# Requerimiento de Práctica: Task Manager Dashboard

## Contexto
Crear un dashboard de gestión de tareas tipo Kanban con funcionalidad de drag & drop, utilizando las nuevas características de Angular 18.

## Objetivos de Aprendizaje
- Implementar Signals para manejo de estado reactivo
- Utilizar RxJS para operaciones asíncronas y flujos de datos
- Aplicar CDK Drag & Drop
- Componentes standalone
- Nueva sintaxis de control flow (@for, @if)

---

## 📝 Requerimientos Funcionales

### 1. Dashboard Principal (40 puntos)
Crear un componente `DashboardComponent` que muestre:

#### Panel de Estadísticas (15 puntos)
- Total de tareas
- Tareas en progreso
- Tareas completadas
- Tareas vencidas (overdue)
- Las estadísticas deben actualizarse automáticamente usando `computed signals`

#### Board Kanban (25 puntos)
- 4 columnas: "To Do", "In Progress", "Review", "Done"
- Cada columna muestra el contador de tareas
- Implementar drag & drop entre columnas usando `@angular/cdk/drag-drop`

---

### 2. Servicio de Tareas (30 puntos)

Crear `TaskService` que maneje:

```typescript
// Estructura de datos requerida
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
}
```

#### Implementación requerida:
- ✅ Usar `signal<Task[]>` para almacenar las tareas
- ✅ Crear `computed signals` para filtrar tareas por estado:
  - `todoTasks()`
  - `inProgressTasks()`
  - `reviewTasks()`
  - `doneTasks()`
- ✅ Crear `computed signal` para estadísticas generales
- ✅ Método para actualizar estado de tarea
- ✅ Método para crear nueva tarea
- 🎁 **Bonus:** Usar RxJS para simular API call con delay

---

### 3. Componente Task Card (20 puntos)

Crear `TaskCardComponent` que:
- Reciba la tarea como `@Input()`
- Emita eventos con `@Output()` para:
  - Click en la tarjeta
  - Cambio de estado (toggle done)
- Muestre prioridad con código de colores
- Muestre fecha de vencimiento

---

### 4. Funcionalidad de Búsqueda - Bonus (10 puntos)

Implementar búsqueda de tareas usando:
- `signal` para el término de búsqueda
- `computed signal` o RxJS operator para filtrar tareas
- Debounce de 300ms usando RxJS

---

## ✨ Mejoras Adicionales (Opcional)

Si terminas antes del tiempo estimado, considera agregar:

- [ ] Persistencia en localStorage
- [ ] Animaciones para drag & drop
- [ ] Filtros por prioridad
- [ ] Ordenamiento de tareas
- [ ] Edición inline de tareas
- [ ] Modo oscuro/claro
- [ ] Tests unitarios con Jasmine/Jest

---

**¡Buena suerte! 🚀**
