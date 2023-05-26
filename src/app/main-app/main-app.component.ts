import { Component } from '@angular/core';
import {delay, filter, from, map, Observable, of} from "rxjs";
import {NgxIndexedDBService} from "ngx-indexed-db";

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent {
  listTask: Task[] = [];
  list$:Observable<Task> = new Observable<Task>();
  taskName:string= '';
  isErrorTask = false;
  task?:any;
  collectionName = 'task'
  showAllData = false;
  constructor(private dbService: NgxIndexedDBService) {}

  ngOnInit() {
    this.dbService.getAll<Task>(this.collectionName).subscribe((tasks) => {
      this.listTask = tasks;
    });
  }
  addTask() {
    if(this.taskName===''){
      if(!this.isErrorTask){
        this.showError();
      }
    }else {
      let task_id =  new Date().getTime();
      let task:Task = { task_id: task_id, name: this.taskName, complete: false ,date: new Date(),disable:false,visible:true};
      this.listTask.push(task);
      this.taskName='';
      this.dbService
        .add(this.collectionName ,task)
        .subscribe((key) => {
          console.log('key: ', key);
        });
    }
  }

  remove(id: number) {
    if(confirm("are you sure")){
      this.list$ = from(this.listTask);
      this.listTask = [];
      this.list$.pipe(filter(e=>e.id!==id)).subscribe(
        element=>{
          this.listTask.push(element);
        }
      );

      this.dbService.deleteByKey(this.collectionName, id).subscribe((status) => {
        console.log('Deleted?:', status);
      });
      }
  }

  setDone(task: Task) {
    task.complete = !task.complete
    this.updateTask(task);
  }

  setDisable(task:Task){
    task.disable = !task.disable;
    this.updateTask(task);
  }

  setVisible(task:Task){
    task.visible = !task.visible;
    this.updateTask(task);
  }

  updateTaskName(task: Task){
    if(task.name===''){
      this.showError();
      return
    }else {
      task.editable=!task.editable;
      this.updateTask(task);
    }

  }

  showError(){
    this.isErrorTask=true;
    of('').pipe(delay(5000)).subscribe(data=>{
      this.isErrorTask=false;
    });
  }

  private updateTask(task: Task){
    this.dbService
      .update(this.collectionName, task)
      .subscribe((storeData) => {
        console.log('storeData: ', storeData);
      });
  }
}
export interface Task {
  id?:number;
  task_id: number;
  name?: string;
  complete?: boolean;
  date?:Date;
  disable:boolean;
  visible:boolean;
  editable?:boolean
}
