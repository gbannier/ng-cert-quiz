import {Component, OnInit} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {Observable} from 'rxjs';
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
    this.categories$ = this.quizService.getAllCategories();
    this.mainCategories$ = this.categories$.pipe(
      map(categories => {
        const uniqueMainCategories: Category[] = [];
        const seenNames = new Set<string>();
        for (const category of categories) {
          const mainCategoryName = category.name.split(':')[0];
          if (!seenNames.has(mainCategoryName)) {
            uniqueMainCategories.push({id: category.id, name: mainCategoryName});
            seenNames.add(mainCategoryName);
          }
        }
        return uniqueMainCategories;
      })
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


