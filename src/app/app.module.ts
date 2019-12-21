import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserInputComponent } from './user-input/user-input.component';
import { AutoCompleteListComponent } from './auto-complete-list/auto-complete-list.component';
import { GithubLinkComponent } from './github-link/github-link.component';

@NgModule({
  declarations: [
    AppComponent,
    UserInputComponent,
    AutoCompleteListComponent,
    GithubLinkComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
