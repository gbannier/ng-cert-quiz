import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {QuizMakerComponent} from './quiz-maker/quiz-maker.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuestionComponent } from './question/question.component';
import { AnswersComponent } from './answers/answers.component';
import { AutoFilterDropdownComponent } from './quiz-maker/auto-filter-dropdown/auto-filter-dropdown.component';
import { HighlightDirective } from './quiz-maker/auto-filter-dropdown/highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    QuizMakerComponent,
    QuizComponent,
    QuestionComponent,
    AnswersComponent,
    AutoFilterDropdownComponent,
    HighlightDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
