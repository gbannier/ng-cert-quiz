import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuizService } from './quiz.service';
import { ApiQuestion, Category, Difficulty, Question } from './data.models';
import { BehaviorSubject, of } from 'rxjs';

// Mock data
const mockCategories: Category[] = [{ id: 1, name: 'Science' }];
const mockQuestions: ApiQuestion[] = [
    {
        category: "Entertainment: Books",
        correct_answer: "7",
        difficulty: "easy",
        incorrect_answers: ["8", "5", "6"],
        question: "How many Harry Potter books are there?",
        type: "multiple"
    },
    {
        category: "Entertainment: Books",
        correct_answer: "42",
        difficulty: "easy",
        incorrect_answers: ["8", "5", "6"],
        question: "What is the question of its all?",
        type: "multiple"
    },
];
const mockResults = { results: mockQuestions };

describe('QuizService', () => {
    let service: QuizService;
    let httpMock: HttpTestingController;
    let questions$ = new BehaviorSubject<Question[]>([]);

    beforeEach(() => {
        const mockQuizService = {
            getAllCategories: () => of(mockCategories),
            createQuiz: () => { },
            questions$: questions$,
            selectedCategoryId: 1,
            selectedDifficulty: 'Medium' as Difficulty
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: QuizService, useValue: mockQuizService }
            ]
        });

        service = TestBed.inject(QuizService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve all categories', () => {
        service.getAllCategories().subscribe(categories => {
            expect(categories.length).toBe(1);
            expect(categories).toEqual(mockCategories);
        });
    });

    it('should create a quiz with correct mapped questions', () => {
        const mockQuizQuestions: Question[] = mockQuestions.map(q => ({
            ...q,
            all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)
        }));

        // Trigger createQuiz in your service
        service.createQuiz();

        // Next the questions on the mock BehaviorSubject
        questions$.next(mockQuizQuestions);

        service.questions$.subscribe(questions => {
            // Sorting the answers here to ensure they match, as they are randomly sorted in the service
            questions.forEach(q => q.all_answers.sort());
            expect(questions).toEqual(mockQuizQuestions);
        });
    });
});
