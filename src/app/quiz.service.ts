import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';
import {ApiQuestion, Category, Difficulty, Question, Results} from './data.models';

@Injectable({
    providedIn: 'root'
})
export class QuizService {

    showChangeQuestionButtons$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    questions$: BehaviorSubject<Question[]> = new BehaviorSubject<Question[]>([]);
    selectedCategoryId: null | undefined | string | number = undefined; // todo typing
    selectedDifficulty: Difficulty | undefined = undefined;
    private API_URL = "https://opentdb.com/";
    private latestResults!: Results;

    constructor(private http: HttpClient) {
    }

    getAllCategories(): Observable<Category[]> {
        return this.http.get<{ trivia_categories: Category[] }>(this.API_URL + "api_category.php").pipe(
            map(res => res.trivia_categories)
        );
    }

    createQuiz(): void {
        if (this.selectedCategoryId && this.selectedDifficulty) {
            this.http.get<{ results: ApiQuestion[] }>(
                `${this.API_URL}/api.php?amount=5&category=${this.selectedCategoryId}&difficulty=${this.selectedDifficulty.toString().toLowerCase()}&type=multiple`)
                .pipe(
                    map(res => {
                        const quiz: Question[] = res.results.map(q => (
                            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
                        ));
                        return quiz;
                    })
                ).subscribe(questions => this.questions$.next(questions));
        }

    }

    computeScore(questions: Question[], answers: string[]): void {
        let score = 0;
        questions.forEach((q, index) => {
            if (q.correct_answer == answers[index])
                score++;
        })
        this.latestResults = {questions, answers, score};
    }

    getLatestResults(): Results {
        return this.latestResults;
    }

    changeQuestion(index: number) {
        if (this.selectedCategoryId && this.selectedDifficulty) {
            this.http.get<{ results: ApiQuestion[] }>(
                `${this.API_URL}/api.php?amount=1&category=${this.selectedCategoryId}&difficulty=${this.selectedDifficulty.toString().toLowerCase()}&type=multiple`)
                .pipe(
                    map(res => {
                        const quiz: Question[] = res.results.map(q => (
                            {...q, all_answers: [...q.incorrect_answers, q.correct_answer]}
                        ));
                        return quiz[0];
                    })
                )
                .subscribe(newQuestion => {
                    const currentQuestions = this.questions$.getValue();
                    const updatedQuestions = [...currentQuestions];
                    updatedQuestions[index] = newQuestion;
                    this.questions$.next(updatedQuestions);

                    this.showChangeQuestionButtons$.next(false);
                });
        }
    }
}
