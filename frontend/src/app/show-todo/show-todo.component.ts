import { Component, Input, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-show-todo',
  templateUrl: './show-todo.component.html',
  styleUrls: ['./show-todo.component.css']
})
export class ShowTodoComponent implements OnInit {

  @Input() todos: Todo[] = [];

  constructor(public todoService: TodoService) { }

  ngOnInit(): void {

  }

  onEdit(todo: Todo){
    this.todoService.selectedTodo = todo;

  }
}
