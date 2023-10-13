import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  providers: [TodoService]

})
export class TodoListComponent implements OnInit {
  @Output() toDoData = new EventEmitter<Todo>()


  signupForm: FormGroup;
  numberRegEx = /\-?\d*\.?\d{1,2}/;

  constructor(public todoService: TodoService) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      name: new FormControl("",Validators.required),
      description: new FormControl("",Validators.required),
      date: new FormControl("",Validators.required),
    })

  }

  addTodo() {
    if (this.signupForm.valid) {
      this.todoService.postTodo(this.signupForm.value).subscribe((res) => {
        this.signupForm.reset();
        this.getToDoList();
      })
    } else {
      this.todoService.postTodo(this.signupForm.value).subscribe((res) => {
        this.signupForm.reset();
        this.getToDoList();
      })
    }
    const todo: Todo = {
      name: this.signupForm.value.name,
      description: this.signupForm.value.description,
      date: this.signupForm.value.date
    }
        // TODO: Use EventEmitter with form value
    this.toDoData.emit(todo);
    console.log(todo);

      this.getToDoList();
  }

  getToDoList(){
    this.todoService.getTodo().subscribe((res) => {
      this.todoService.todos = res as Todo[];
      console.log("i work")
      console.log(this.signupForm.value)
    })
  }



}
