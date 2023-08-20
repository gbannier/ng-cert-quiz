import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from "../quiz.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit{

  @Input({required: true}) question!: Question;
  @Input() correctAnswer?: string;
  @Input() userAnswer?: string;
  @Output() changeAnswer = new EventEmitter<string>();
  @Output() changeQuestion = new EventEmitter<boolean>();
  currentSelection!: string;
  showChangeQuestionButton$: Observable<boolean> | undefined= undefined;

  constructor(private quizService: QuizService) {
  }

  ngOnInit() {
    this.showChangeQuestionButton$ =this.quizService.showChangeQuestionButtons$;
  }

  buttonClicked(answer: string): void {
    this.currentSelection = answer;
    this.changeAnswer.emit(answer);
  }
  getButtonClass(answer: string): string {
    if (! this.userAnswer) {
      if (this.currentSelection == answer)
        return "tertiary";
    } else {
      if (this.userAnswer == this.correctAnswer && this.userAnswer == answer)
        return "tertiary";
      if (answer == this.correctAnswer)
        return "secondary";
    }
    return "primary";
  }

  changeQuestionButtonclicked() {
    this.changeQuestion.emit()
  }
}
