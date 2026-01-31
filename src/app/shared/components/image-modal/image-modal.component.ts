import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-image-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 ease-out" 
         (click)="onBackdropClick()" 
         (keydown)="onKeydown($event)"
         tabindex="0">
      <!-- Header / Close -->
      <button (click)="closeModal.emit(); $event.stopPropagation()" class="fixed top-6 right-6 z-[120] w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md cursor-pointer">
          <span class="material-icons-outlined pointer-events-none">close</span>
      </button>

      <div class="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center animate-in zoom-in-95 duration-300 ease-out">

        @if (title()) {
            <h3 class="text-white font-medium text-lg mb-4 drop-shadow-md">{{ title() }}</h3>
        }

        <!-- Image -->
        <img [src]="imageUrl()" 
             class="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain cursor-default"
             (click)="$event.stopPropagation()"
             (keydown)="$event.stopPropagation()"
             tabindex="0"
             alt="Full size view">
      </div>
    </div>
  `
})
export class ImageModalComponent {
    imageUrl = input.required<string>();
    title = input<string>('');
    closeModal = output<void>();

    onBackdropClick() {
        // We trust that specific interactive elements (like the image) will stop propagation.
        // Everything else (backdrop, empty space, container) should close the modal.
        this.closeModal.emit();
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
            this.closeModal.emit();
        }
    }
}
