import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  signupForm: FormGroup;
  editMode: boolean = false;
  currentTodoId: string | null = null;
  todos: Todo[] = []; // Manage the list of todos here

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });
    this.loadTodos(); // Load existing todos when the component initializes
  }

  // Load todos from the service
  loadTodos() {
    this.todoService.getTodo().subscribe((data: Todo[]) => {
      this.todos = data;
    });
  }

  // Add or update a to-do item
  addOrUpdateTodo() {
    if (this.signupForm.valid) {
      if (this.editMode && this.currentTodoId) {
        // Update an existing to-do
        const updatedTodo: Todo = {
          _id: this.currentTodoId,
          ...this.signupForm.value
        };

        this.todoService.updateTodo(this.currentTodoId, updatedTodo).subscribe(
          (response: Todo) => {
            // Find the index of the to-do to update
            const index = this.todos.findIndex(todo => todo._id === this.currentTodoId);
            if (index > -1) {
              // Create a new array instance to ensure Angular detects the change
              this.todos = [
                ...this.todos.slice(0, index),
                { ...response },
                ...this.todos.slice(index + 1)
              ];
            }

            // Reset the form and variables
            this.signupForm.reset();
            this.editMode = false;
            this.currentTodoId = null;
          },
          error => {
            console.error('Failed to update the to-do:', error);
          }
        );
      } else {
        // Logic for adding a new to-do
        const newTodo: Todo = { ...this.signupForm.value };
        this.todoService.postTodo(newTodo).subscribe(
          (createdTodo: Todo) => {
            this.todos.push(createdTodo);
            this.signupForm.reset();
          },
          error => {
            console.error('Failed to add a new to-do:', error);
          }
        );
      }
    } else {
      console.error('Form is invalid');
    }
  }





  // Handle editing a to-do item
  onEdit(todo: Todo) {
    this.editMode = true;
    this.currentTodoId = todo._id;
    this.signupForm.setValue({
      name: todo.name,
      description: todo.description,
      date: todo.date
    });
  }

  // Handle deleting a to-do item
  onDelete(todo: Todo) {
    this.todoService.deleteTodo(todo._id).subscribe(() => {
      this.todos = this.todos.filter(t => t._id !== todo._id); // Remove the deleted to-do from the local array
    });
  }
}
