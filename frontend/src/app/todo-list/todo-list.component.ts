import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  signupForm: FormGroup;
  editMode: boolean = false;
  currentTodoId: string | null = null;
  todos: Todo[] = []; 

  constructor(
    private todoService: TodoService, 
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      date: new FormControl('', Validators.required)
    });
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodo().subscribe((data: Todo[]) => {
      // Sort: Pending first, then Completed. Within that, maybe by creation (not tracked) or name.
      // Let's sort by isCompleted (false first).
      this.todos = data.sort((a, b) => (Number(a.isCompleted) - Number(b.isCompleted)));
    });
  }

  addOrUpdateTodo() {
    if (this.signupForm.valid) {
      if (this.editMode && this.currentTodoId) {
        // Update
        const formValue = this.signupForm.value;
        const dateValue = formValue.date ? new Date(formValue.date).getTime() : Date.now();
        
        const updatedTodo: Todo = {
          _id: this.currentTodoId,
          name: formValue.name,
          description: formValue.description,
          date: dateValue,
          // Preserve isCompleted status from the existing todo in the list
          isCompleted: this.todos.find(t => t._id === this.currentTodoId)?.isCompleted
        };

        this.todoService.updateTodo(this.currentTodoId, updatedTodo).subscribe(
          (response: Todo) => {
            const index = this.todos.findIndex(todo => todo._id === this.currentTodoId);
            if (index > -1) {
              this.todos[index] = response;
              this.sortTodos();
            }
            this.showSnackBar('Task updated successfully!');
            this.resetForm();
          },
          error => console.error('Failed to update:', error)
        );
      } else {
        // Add
        const formValue = this.signupForm.value;
        const dateValue = formValue.date ? new Date(formValue.date).getTime() : Date.now();

        const newTodo: Todo = { 
          name: formValue.name,
          description: formValue.description,
          date: dateValue,
          isCompleted: false
        };
        this.todoService.postTodo(newTodo).subscribe(
          (createdTodo: Todo) => {
            this.todos.push(createdTodo);
            this.sortTodos();
            this.showSnackBar('Task added! Let\'s get it done.');
            this.resetForm();
          },
          error => console.error('Failed to add:', error)
        );
      }
    }
  }

  toggleCompletion(todo: Todo) {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    if (todo._id) {
       this.todoService.updateTodo(todo._id, updatedTodo).subscribe(
        (response: Todo) => {
          const index = this.todos.findIndex(t => t._id === todo._id);
          if (index > -1) {
            this.todos[index] = response;
            this.sortTodos();
            if (response.isCompleted) {
              this.showSnackBar('Great job! Task completed. 🎉'); // Rewarding feedback
            }
          }
        },
        error => console.error('Error updating completion:', error)
      );
    }
  }

  onEdit(todo: Todo) {
    this.editMode = true;
    this.currentTodoId = todo._id!;
    this.signupForm.setValue({
      name: todo.name,
      description: todo.description || '',
      date: todo.date ? new Date(Number(todo.date)) : new Date()
    });
    // Scroll to top or form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(todo: Todo) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: { message: `Are you sure you want to delete "${todo.name}"?` },
      panelClass: 'custom-dialog-shell'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.deleteTodo(todo._id).subscribe(() => {
          this.todos = this.todos.filter(t => t._id !== todo._id);
          this.showSnackBar('Task deleted.');
        });
      }
    });
  }

  resetForm() {
    this.signupForm.reset();
    this.editMode = false;
    this.currentTodoId = null;
  }

  private sortTodos() {
    this.todos.sort((a, b) => (Number(a.isCompleted || 0) - Number(b.isCompleted || 0)));
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-custom'] // We can style this in global css
    });
  }
}
