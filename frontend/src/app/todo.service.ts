import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  selectedTodo!: Todo;
  todos: Todo[] = [];
  readonly url = 'http://localhost:3000/todolist';

  constructor(private http: HttpClient) { }

  postTodo(tdl: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.url, tdl);
  }

  getTodo(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.url);
  }

  // New method for updating a todo item
  updateTodo(id: string, updatedTodo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.url}/${id}`, updatedTodo);
  }

  // New method for deleting a todo item
  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
