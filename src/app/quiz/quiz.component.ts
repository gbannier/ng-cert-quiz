import {Component, inject, Input} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input() questions: Question[] | null = []; // why union typing ? todo

  userAnswers: string[] = [];
  quizService = inject(QuizService); // why??todo
  router = inject(Router);// why??todo

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

  changeQuestion(i: number) {
   this.quizService.changeQuestion(i);
  }
}
