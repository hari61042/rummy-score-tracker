import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { AppComponent } from './app.component';
import { ScoreTrackerComponent } from './score-tracker/score-tracker.component';

@NgModule({
  declarations: [AppComponent, ScoreTrackerComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    TableModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
