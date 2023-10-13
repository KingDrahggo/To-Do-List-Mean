import { Component } from '@angular/core';

import { Todo } from './todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedTodos: Todo[] = [];

  onTodoAdded (todo: Todo) {
    this.storedTodos.push(todo)
  }
}
