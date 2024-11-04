// Parent component (AppComponent)
import { Component } from '@angular/core';
import { Todo } from './todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  todos: Todo[] = [];

  onTodoAddedOrUpdated(todo: Todo) {
    if (todo._id) {
      // Editing an existing to-do
      const index = this.todos.findIndex(t => t._id === todo._id);
      if (index > -1) {
        this.todos[index] = todo;
      }
    } else {
      // Adding a new to-do
      this.todos.push(todo);
    }
  }

  onEditReceived(todo: Todo) {
    console.log('To-do to be edited:', todo); // Debugging log
    // Logic to handle passing the to-do to TodoListComponent
  }
}
