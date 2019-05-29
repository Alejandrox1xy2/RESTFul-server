import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Task } from '../Task';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  apiRestDir: string = "http://localhost:3000/api/tareas";
  constructor(private http: HttpClient) { }

  getTasks(){
    return this.http.get<Task[]>(`${this.apiRestDir}`)
    .pipe(map(res => res));
  }
  
  
  addTask(newTask: Task){
    return this.http.post<Task>(`${this.apiRestDir}`,newTask)
    .pipe(map(res => res));
  }
  
  deleteTask(id: any){
    return this.http.delete<any>(`${this.apiRestDir}/${id}`)
    .pipe(map(res => res));
  }
  
  updateTask(id: any, newDataTask: any){
    return this.http.put<any>(`${this.apiRestDir}/${id}`,newDataTask)
    .pipe(map(res => res));
  }
}

