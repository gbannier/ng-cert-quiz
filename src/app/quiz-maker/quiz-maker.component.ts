import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {Observable, of, shareReplay} from 'rxjs';
import {QuizService} from '../quiz.service';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {DropdownOption} from "./auto-filter-dropdown/dropdown-option.model";

@Component({
    selector: 'app-quiz-maker',
    templateUrl: './quiz-maker.component.html',
    styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent implements OnInit {


    categories$: Observable<Category[]> | undefined = undefined;
    subCategories$: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
    selectedCategoryId: null | undefined | string | number = null; // todo typing
    showSubCategories = false;
    questions$: Observable<Question[]> | undefined = undefined;
    mainCategories$: Observable<Category[]> = of([]);
    labelModifierFn: ((label: string) => string) | undefined;
    difficultyOptions: DropdownOption[] = [
        {value: 'Easy', label: 'Easy'},
        {value: 'Medium', label: 'Medium'},
        {value: 'Hard', label: 'Hard'}
    ];
    selectedDifficulty: Difficulty | undefined = undefined;

    constructor(private quizService: QuizService, private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.labelModifierFn = (label) => label.split(':')[1]
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

    onMainCategoryChange(dropdownOption: DropdownOption) {
        this.showSubCategories = false;
        this.subCategories$.next([]);
        this.changeDetectorRef.detectChanges();
        this.categories$?.pipe(
            map(categories => ({
                mainCategory: categories.find(category => category.name.split(':')[0] === dropdownOption.label), // todo redundant`
                subCategories: categories.filter(category => category.name.startsWith(dropdownOption.label + ':'))
            }))
        ).subscribe(({mainCategory, subCategories}) => {
            this.showSubCategories = false
            this.selectedCategoryId = mainCategory?.id; // todo redundant`
            this.showSubCategories = subCategories.length > 0;
            this.subCategories$.next(subCategories);

        });
    }


    onSubCategoryChange(dropdownOption: DropdownOption) {
        this.selectedCategoryId = dropdownOption.value;
    }

    onDifficultyChange(dropdownOption: DropdownOption) {
        this.selectedDifficulty = dropdownOption.value as Difficulty;
    }

    createQuiz() {
        if (this.selectedCategoryId && this.selectedDifficulty) {
            this.questions$ = this.quizService.createQuiz(this.selectedCategoryId.toString(), this.selectedDifficulty); // typing todo
            this.quizService.showChangeQuestionButtons$.next(true);
        }
    }

    getCategoriesAsDropdownElement(categories: Category[]): DropdownOption[] {
        return categories.map(c => ({value: c.id, label: c.name})) || []
    }
}


