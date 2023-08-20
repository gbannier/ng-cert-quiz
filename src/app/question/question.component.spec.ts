import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionComponent } from './question.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionComponent],
      imports: [HttpClientTestingModule],
      schemas:[NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    component.question = {all_answers: [], correct_answer: "", incorrect_answers: [], question: ""};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set current selection and emit the answer', () => {
    const answer = 'Sample Answer';
    spyOn(component.changeAnswer, 'emit');

    component.buttonClicked(answer);

    expect(component.currentSelection).toBe(answer);
    expect(component.changeAnswer.emit).toHaveBeenCalledWith(answer);
  });

  it('should return "tertiary" if currentSelection equals answer and userAnswer is not defined', () => {
    component.currentSelection = 'answer1';
    const result = component.getButtonClass('answer1');
    expect(result).toEqual('tertiary');
  });

  it('should return "tertiary" if userAnswer equals correctAnswer and answer', () => {
    component.userAnswer = 'answer1';
    component.correctAnswer = 'answer1';
    const result = component.getButtonClass('answer1');
    expect(result).toEqual('tertiary');
  });

  it('should return "secondary" if answer equals correctAnswer but not userAnswer', () => {
    component.userAnswer = 'answer2';
    component.correctAnswer = 'answer1';
    const result = component.getButtonClass('answer1');
    expect(result).toEqual('secondary');
  });

  it('should return "primary" for all other cases', () => {
    component.userAnswer = 'answer2';
    component.correctAnswer = 'answer3';
    const result = component.getButtonClass('answer1');
    expect(result).toEqual('primary');
  });
});
