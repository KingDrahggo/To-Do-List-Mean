export interface Todo {
  _id?: string;
  name: String;
  description: String;
  date: number; // Changed from Number to number for compatibility with date pipe
  isCompleted?: boolean;
}
