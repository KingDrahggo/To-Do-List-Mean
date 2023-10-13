import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  selectedTodo!: Todo;
  todos: Todo[] = [];
  readonly url = 'http://localhost:3000/todolist';

  constructor(private http : HttpClient) { }

  postTodo(tdl : Todo){
    return this.http.post(this.url,tdl)
  }

  getTodo() {
    return this
    .http
    .get(`${this.url}`);
  }
}
