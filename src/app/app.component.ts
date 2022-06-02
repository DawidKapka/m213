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
  @ViewChild('wordContainer') wordContainer: ElementRef;
  private selectedChar: string;

  ngOnInit() {
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.handleKeyPress(event);
    })
    this.word = words[0];
    this.wordIndex = 0;
    setTimeout(() => this.setElement(0, 'selected'), 100)
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key.match(/[a-z]/i)) {
      this.handleLetterPress(event.key);
    }
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
}
