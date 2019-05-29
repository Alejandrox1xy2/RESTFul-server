import { Component, OnInit } from '@angular/core';

import { TaskService } from '../../services/task.service'
import { Task } from '../../Task'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {
  //Propiedades accesibles desde el código HTML asociado  (tasks.component.html)
  tasks: Task[]; //Lista con todas las tareas actuales
  titulo: string; //Descripción para crear una nueva tarea

  //2a fase: Constructor: recuperar del servicio API RESTFul todas las tareas
  constructor(private taskService: TaskService) {
    this.taskService.getTasks().subscribe(tasks => {
      console.log(tasks);
      this.tasks = tasks;
    })
  }
  
  ngOnInit() {
  }

  //Método para añadir una nueva tarea
  addTask($event) {
    event.preventDefault(); //No dejamos que refresque pantalla

    const newTask: Task = {
      title: this.titulo,
      isDone: false
    }
    this.taskService.addTask(newTask).subscribe(task => {
      console.log(task);
      this.tasks.push(task); //Tengo agregada en mi lista local la tarea
      this.titulo = '';
    });
  }

  //Método para actualizar el estado de la tarea
  updateStatus(task: Task) {
    const newTask: Task = {
      title: task.title,
      isDone: !task.isDone
    };

    this.taskService.updateTask(task._id, newTask).subscribe(res => {
      console.log(res);
      task.isDone = !task.isDone;
    });

  }
  deleteTask(id:any){
    const response = confirm('¿Éstas seguro de que deseas eliminar la tarea?');
    if(response){
      const tasks = this.tasks;
      this.taskService.deleteTask(id).subscribe(res =>{
        console.log(res)
        if(res.n === 1){
          for (let i = 0; i < tasks.length; i++) {
            if(tasks[i]._id === id){
              tasks.splice(i, 1);
            }
          }
        }
      })
    }
  }
}