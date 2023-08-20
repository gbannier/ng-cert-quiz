import {ComponentFixture, TestBed} from '@angular/core/testing';
import {QuizService} from '../quiz.service';
import {QuizMakerComponent} from './quiz-maker.component';
import {BehaviorSubject, of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from '@angular/core';
import {Category} from '../data.models';

// Mock child components
@Component({ selector: 'app-auto-filter-dropdown', template: '' })
class AutoFilterDropdownStubComponent {
  @Input() options: any;
  @Output() selectionChange = new EventEmitter();
}

@Component({ selector: 'app-quiz', template: '' })
class QuizStubComponent {
  @Input() questions: any;
}

describe('QuizMakerComponent', () => {
  let component: QuizMakerComponent;
  let fixture: ComponentFixture<QuizMakerComponent>;
  let quizService: jasmine.SpyObj<QuizService>;
  const categoriesMock = of([
    { id: 1, name: 'Science' },
  ]);
  beforeEach(() => {
    const quizServiceSpy = {
      getAllCategories: jasmine.createSpy('getAllCategories').and.returnValue(categoriesMock),
      createQuiz: jasmine.createSpy('createQuiz'),
      showChangeQuestionButtons$: new BehaviorSubject<boolean>(true)
    };
    TestBed.configureTestingModule({
      declarations: [QuizMakerComponent, AutoFilterDropdownStubComponent, QuizStubComponent],
      providers: [{ provide: QuizService, useValue: quizServiceSpy }],
      schemas:[NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(QuizMakerComponent);
    component = fixture.componentInstance;
    quizService = TestBed.inject(QuizService) as jasmine.SpyObj<QuizService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Create Quiz Button', () => {
    it('should call createQuiz method when clicked', () => {
      const button = fixture.debugElement.query(By.css('#createBtn'));
      spyOn(component, 'createQuiz');
      button.triggerEventHandler('click', null);
      expect(component.createQuiz).toHaveBeenCalled();
    });
  });

  describe('Dropdown selection changes', () => {
    it('should call onMainCategoryChange method when main category changes', () => {
      const dropdown = fixture.debugElement.query(By.directive(AutoFilterDropdownStubComponent));
      spyOn(component, 'onMainCategoryChange');
      dropdown.triggerEventHandler('selectionChange', { value: 1, label: 'Category' });
      expect(component.onMainCategoryChange).toHaveBeenCalledWith({ value: 1, label: 'Category' });
    });
  });

  describe('onMainCategoryChange', () => {
    it('should update subCategories and selectedCategoryId', () => {
      const categories: Category[] = [{ id: 1, name: 'Category:SubCategory' }];
      quizService.getAllCategories.and.returnValue(of(categories));
      component.categories$ = of(categories);
      component.onMainCategoryChange({ value: 1, label: 'Category' });

      expect(quizService.selectedCategoryId).toEqual(1);
      expect(component.showSubCategories).toBeTrue(); // Or false, depending on your implementation
    });
  });

  describe('onSubCategoryChange', () => {
    it('should update selectedCategoryId', () => {
      component.onSubCategoryChange({ value: 1, label: 'SubCategory' });

      expect(quizService.selectedCategoryId).toEqual(1);
    });
  });

  describe('onDifficultyChange', () => {
    it('should update selectedDifficulty in the quizService', () => {
      component.onDifficultyChange({ value: 'Easy', label: 'Easy' });

      expect(quizService.selectedDifficulty).toEqual('Easy');
    });
  });

  describe('Initialization', () => {
    it('should assign questions$ from quizService', () => {
      expect(component.questions$).toEqual(quizService.questions$);
    });
  });


  describe('createQuiz', () => {
    it('should create a quiz with selectedCategoryId and selectedDifficulty', () => {
      quizService.selectedCategoryId = 1;
      quizService.selectedDifficulty = 'Medium';
      component.createQuiz();

      expect(quizService.createQuiz).toHaveBeenCalled();
    });

    it('should not create a quiz without selectedCategoryId and selectedDifficulty', () => {
      component.createQuiz();

      expect(quizService.createQuiz).not.toHaveBeenCalled();
    });
  });
});
