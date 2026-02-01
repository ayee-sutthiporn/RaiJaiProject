import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-image-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-[110] flex items-center justify-center animate-in fade-in duration-300" 
         tabindex="0"
         (keydown.escape)="closeModal.emit()">
      
      <!-- 1. The Backdrop Layer (Click changes here close the modal) -->
      <div class="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer" 
           (click)="closeModal.emit()"
           aria-hidden="true">
      </div>

      <!-- 2. Close Button (Fixed on top right, separate from content) -->
      <button (click)="closeModal.emit()" 
              class="absolute top-6 right-6 z-[130] w-14 h-14 flex items-center justify-center bg-zinc-800/50 hover:bg-zinc-700 text-white rounded-full transition-all backdrop-blur-md border border-white/10 shadow-xl hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="ปิด (Close)"
              aria-label="Close">
          <span class="material-icons-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">close</span>
      </button>

      <!-- 3. Title (Top Center) -->
      @if(title()) {
        <div class="absolute top-8 left-1/2 -translate-x-1/2 z-[120] pointer-events-none">
             <span class="bg-black/40 text-white/90 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md border border-white/5 shadow-lg">
                 {{ title() }}
             </span>
        </div>
      }

      <!-- 4. Main Image Content -->
      <div class="relative z-[120] p-4 pointer-events-none max-w-5xl w-full h-full flex items-center justify-center">
          <img [src]="imageUrl()" 
               class="pointer-events-auto max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 ease-out select-none drop-shadow-2xl"
               alt="Full size view">
      </div>

      <!-- 5. Bottom Toolbar -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[130] flex gap-4 pointer-events-auto animate-in slide-in-from-bottom-4 duration-500 delay-75">
          <a [href]="imageUrl()" download="image" target="_blank" 
             class="flex items-center gap-2 px-6 py-3 bg-zinc-800/80 hover:bg-zinc-700 border border-white/10 text-white rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-sm font-medium shadow-xl hover:no-underline group">
              <span class="material-icons-outlined group-hover:animate-bounce">download</span>
              ดาวน์โหลดรูปภาพ
          </a>
      </div>

    </div>
  `
})
export class ImageModalComponent {
    imageUrl = input.required<string>();
    title = input<string>('');
    closeModal = output<void>();
}
