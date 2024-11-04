import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-show-todo',
  templateUrl: './show-todo.component.html',
  styleUrls: ['./show-todo.component.css']
})
export class ShowTodoComponent implements OnInit {
  @Input() todos: Todo[] = [];
  @Output() editTodo = new EventEmitter<Todo>();

  constructor(public todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodo().subscribe((data: Todo[]) => {
      this.todos = data;
    });
  }

  onEdit(todo: Todo) {
    this.editTodo.emit(todo); // Emit the to-do for editing
  }

  onDelete(todo: Todo) {
    this.todoService.deleteTodo(todo._id).subscribe(
      () => {
        // Remove the deleted to-do from the local array
        this.todos = this.todos.filter(t => t._id !== todo._id);
        console.log('Deleted todo:', todo); // Debugging log
      },
      error => {
        console.error('Delete error:', error); // Error log
      }
    );
  }
}
