import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import words from '../assets/words.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'm213';
  health: number = 100;
  word: string;
  wordIndex: number;
  private selectedChar: string;
  private currentWordTransformation = 0;
  private wordFallDelay: number = 1200;
  private wordFallInterval = 0;
  public points: number = 0;
  public gameFinished: boolean = false;
  public gameStarted: boolean = false;

  @ViewChild('wordContainer') wordContainer: ElementRef;
  @ViewChild('fallingWord') fallingWord: ElementRef;

  ngOnInit() {
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key.match(/[a-z]/i)) {
      this.handleLetterPress(event.key);
    }
  }

  private moveWord() {
    const word = this.fallingWord.nativeElement.children[0] as HTMLElement;
    this.currentWordTransformation += 10;
    if (this.currentWordTransformation === 110) {
      this.currentWordTransformation = 0;
      this.wordIndex++;
      if (this.wordIndex === words.length) this.wordIndex = 0;
      this.word = words[this.wordIndex];
      this.health -= (1 / 3) * 100;
      this.points += 100;
      this.wordFallDelay += 250;
      if (this.wordFallDelay > 1200) this.wordFallDelay = 1200;
      clearInterval(this.wordFallInterval);
      this.wordFallInterval = setInterval(() => {
        this.moveWord()
      }, this.wordFallDelay);
      this.clearTypedLetters();
      this.setElement(0, 'selected');
      if (this.health === 0) {
        this.stopGame();
      }
    }
    word.style.top = `${this.currentWordTransformation}%`;
  }

  private stopGame() {
    clearInterval(this.wordFallInterval);
    this.gameFinished = true;
    this.gameStarted = false;
  }

  private handleLetterPress(key: string) {
    const selected: string = (this.wordContainer.nativeElement.children[this.getSelectedCharIndex()].children[0] as HTMLParagraphElement).innerText;
    if (selected.toLowerCase() === key.toLowerCase()) {
      if ((this.getSelectedCharIndex() + 1) === this.wordContainer.nativeElement.children.length) {
        this.handleFinishedWord();
      } else {
        this.setElement(this.getSelectedCharIndex(), 'typed');
        this.setElement(this.getSelectedCharIndex() + 1, 'selected');
      }
    }
  }

  private handleFinishedWord() {
    this.wordIndex++;
    if (this.wordIndex === words.length) this.wordIndex = 0;
    this.word = words[this.wordIndex];
    this.currentWordTransformation = 0;
    this.wordFallDelay -= 50;
    if (this.wordFallDelay < 100) this.wordFallDelay = 100;
    this.points += 100;
    clearInterval(this.wordFallInterval);
    this.wordFallInterval = setInterval(() => {
      this.moveWord()
    }, this.wordFallDelay);
    (this.fallingWord.nativeElement.children[0] as HTMLElement).style.top = `${this.currentWordTransformation}%`;
    setTimeout(() => {
      this.clearTypedLetters();
      this.setElement(0, 'selected');
    }, 100)
  }

  private setElement(index: number, type: 'selected' | 'typed') {
    const searchedElement: HTMLElement = this.wordContainer.nativeElement.children[index]
    this.selectedChar = (searchedElement.children[0] as HTMLParagraphElement).innerText;
    if (!searchedElement.children[0].classList.contains(type)) {
      searchedElement.children[0].classList.add(type);
    }
    if (type === 'selected') {
      for (let el of this.wordContainer?.nativeElement.children) {
        if (el !== searchedElement && (el as HTMLElement).children[0].classList.contains(type)) {
          (el as HTMLElement).children[0].classList.remove(type);
        }
      }
    }
  }

  private getSelectedCharIndex(): number {
    for (let i = 0; i < this.wordContainer.nativeElement.children.length; i++) {
      if ((this.wordContainer.nativeElement.children[i] as HTMLElement).children[0].classList.contains('selected')) {
        return i
      }
    }
    return 0;
  }

  private clearTypedLetters() {
    for (let el of this.wordContainer?.nativeElement.children) {
      if ((el as HTMLElement).children[0].classList.contains('typed')) {
        (el as HTMLElement).children[0].classList.remove('typed');
      }
    }
  }

  startGame() {
    this.gameStarted = true;
    this.gameFinished = false;
    this.wordFallDelay = 1200;
    this.wordFallInterval = setInterval(() => {
      this.moveWord()
    }, this.wordFallDelay);
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.handleKeyPress(event);
    })
    this.word = words[0];
    this.wordIndex = 0;
    setTimeout(() => {
      this.setElement(0, 'selected');
      (this.fallingWord.nativeElement as HTMLElement).style.transform = 'translateY(0px)';
    }, 100);
  }
}
