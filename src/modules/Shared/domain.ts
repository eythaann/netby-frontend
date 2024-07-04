export enum Service {
  Auth = "auth",
  Tasks = "tasks",
}

export const BaseUrlByService: Record<Service, string> = {
  [Service.Auth]: "http://localhost:3001/auth/v1",
  [Service.Tasks]: "http://localhost:3001/tasks/v1",
};