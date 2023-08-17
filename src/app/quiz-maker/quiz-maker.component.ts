import {Component, OnInit} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {Observable, shareReplay} from 'rxjs';
import {QuizService} from '../quiz.service';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent implements OnInit {


  categories$: Observable<Category[]>| undefined = undefined ;
  subCategories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  selectedCategoryId: null | undefined | string | number = null; // todo typing
  showSubCategories = false;
  questions$: Observable<Question[]>| undefined = undefined ;
  mainCategories$: Observable<Category[]> | undefined = undefined;

  constructor(private quizService: QuizService) {

  }

  ngOnInit() {
    this.categories$ = this.quizService.getAllCategories().pipe(shareReplay(1));
    this.mainCategories$ = this.categories$.pipe(
      map(categories =>
        categories.map(category => category.name.split(':')[0])
          .filter((value, index, self) => self.indexOf(value) === index)
          .map(mainCategoryName => ({
            id: categories.find(category => category.name.startsWith(mainCategoryName))?.id || 0,
            name: mainCategoryName
          }))
      )
    );
  }

  onMainCategoryChange(selectedMainCategoryName: string) {
    this.categories$?.pipe(
      map(categories => ({
        mainCategory: categories.find(category => category.name.split(':')[0] === selectedMainCategoryName),
        subCategories: categories.filter(category => category.name.startsWith(selectedMainCategoryName + ':'))
      }))
    ).subscribe(({mainCategory, subCategories}) => {
      this.selectedCategoryId = mainCategory?.id;
      this.showSubCategories = subCategories.length > 0;
      this.subCategories$.next(subCategories);
    });
  }


  onSubCategoryChange(selectedSubCategory: string) {
    this.selectedCategoryId = selectedSubCategory;
  }

  createQuiz(difficulty: string) {
    console.log(this.selectedCategoryId, difficulty)
    if (this.selectedCategoryId) {
      this.questions$ = this.quizService.createQuiz(this.selectedCategoryId.toString(), difficulty as Difficulty); // typing todo ls
    }
  }

  protected readonly undefined = undefined;
}


