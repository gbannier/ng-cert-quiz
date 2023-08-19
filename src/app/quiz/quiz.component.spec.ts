import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizComponent } from './quiz.component';
import {QuizService} from "../quiz.service";
import {Router} from "@angular/router";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let mockQuizService: jasmine.SpyObj<QuizService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockQuizService = jasmine.createSpyObj('QuizService', ['computeScore']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [QuizComponent],
      providers: [
        {provide: QuizService, useValue: mockQuizService},
        {provide: Router, useValue: mockRouter}
      ],
      schemas:[NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute score and navigate to "/result"', () => {
    component.questions = [];
    component.submit();

    expect(mockQuizService.computeScore).toHaveBeenCalledWith(component.questions, component.userAnswers);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/result");
  });
});
