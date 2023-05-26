import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainAppComponent } from './main-app/main-app.component';
import {FormsModule} from "@angular/forms";
import {DBConfig, NgxIndexedDBModule} from 'ngx-indexed-db';

const dbConfig: DBConfig  = {
  name: 'todoMyDB',
  version: 1,
  objectStoresMeta: [{
    store: 'task',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'task_id', keypath: 'task_id', options: { unique: false } },
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'complete', keypath: 'complete', options: { unique: false } }
    ]
  }]
};

@NgModule({
  declarations: [
    AppComponent,
    MainAppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
