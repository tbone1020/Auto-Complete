import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserInputComponent } from './user-input/user-input.component';
import { AutoCompleteListComponent } from './auto-complete-list/auto-complete-list.component';

@NgModule({
  declarations: [
    AppComponent,
    UserInputComponent,
    AutoCompleteListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
