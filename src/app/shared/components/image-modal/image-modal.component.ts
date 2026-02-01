import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-image-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
         (click)="onBackdropClick($event)"
         (keydown.escape)="closeModal.emit()"
         tabindex="0"
         role="button"
         aria-label="Close modal">
      
      <!-- Close Button (Moved out of wrapper for safety) -->
      <button (click)="closeModal.emit(); $event.stopPropagation()" 
              class="absolute top-6 right-6 z-[130] w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md cursor-pointer border border-white/10 hover:scale-105 active:scale-95 shadow-lg group focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close">
          <span class="material-icons-outlined text-2xl group-hover:rotate-90 transition-transform duration-300">close</span>
      </button>

      <!-- Title & Toolbar Wrapper (Pointer events none to pass through clicks to backdrop) -->
      <div class="absolute inset-x-0 top-0 p-4 flex justify-start pointer-events-none z-[120]">
         @if(title()) {
             <h3 class="pointer-events-auto text-white/90 font-medium text-lg drop-shadow-md bg-black/20 p-2 rounded-lg backdrop-blur-md">{{ title() }}</h3>
         }
      </div>

      <!-- Main Content -->
      <div class="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-10 pointer-events-none">
          <img [src]="imageUrl()" 
               class="pointer-events-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 ease-out select-none"
               alt="Full size view">
      </div>

      <!-- Bottom Toolbar (Download option) -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-[120] flex gap-3 pointer-events-auto animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <a [href]="imageUrl()" download="transaction-image" target="_blank" (click)="$event.stopPropagation()" class="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-sm font-medium shadow-lg hover:no-underline">
              <span class="material-icons-outlined text-lg">download</span>
              ดาวน์โหลด
          </a>
      </div>

    </div>
  `
})
export class ImageModalComponent {
    imageUrl = input.required<string>();
    title = input<string>('');
    closeModal = output<void>();

    onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            this.closeModal.emit();
        }
    }
}
