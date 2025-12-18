import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  @ViewChildren('statCounterRef', { read: ElementRef }) counters!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;
  private animationStarted = false;

  constructor() {}


  //Efecto para los contadores animados de la seccion de estadisticas
  ngAfterViewInit(): void {

    this.observer = new IntersectionObserver(this.handleIntersection, {
      root: null, 
      rootMargin: '0px',
      threshold: 0.5 
    });

    this.counters.forEach(counter => {
      this.observer.observe(counter.nativeElement);
    });
  }

  private handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.animationStarted) {

        this.animationStarted = true;
        
        this.counters.forEach(counterEl => {
          this.animateCount(counterEl.nativeElement);
        });

        this.observer.disconnect();
      }
    });
  };

  private animateCount(element: HTMLElement): void {
    const target = parseInt(element.getAttribute('data-target') || '0', 10);
    let count = 0;
    const duration = 2000; 
    const increment = target / (duration / 16); 

    const spanElement = element.querySelector('span'); 
    if (!spanElement) return;

    const timer = setInterval(() => {
      count += increment;

      if (count >= target) {
        clearInterval(timer);
        count = target; 
        spanElement.textContent = count + '+';
      } else {
        spanElement.textContent = Math.ceil(count) + '+';
      }
    }, 16);
  }
  
  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}

