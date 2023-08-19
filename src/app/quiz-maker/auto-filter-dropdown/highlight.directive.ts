import {Directive, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnChanges{
  @Input('appHighlight') label='';
  @Input() filterText='';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges() {
    const start = this.label.toLowerCase().indexOf(this.filterText.toLowerCase());
    if (start === -1 || !this.filterText || this.filterText.length <= 1) {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.label);
      return;
    }
    const end = start + this.filterText.length;
    const highlightedLabel = (
        this.label.substring(0, start) +
        '<strong>' +
        this.label.substring(start, end) +
        '</strong>' +
        this.label.substring(end)
    );
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', highlightedLabel);
  }

}

