import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-500 ease-out" 
         (click)="onCancel()" 
         (keydown.escape)="onCancel()"
         tabindex="0">
      <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in zoom-in-90 slide-in-from-bottom-8 duration-500 ease-out transform relative" 
           (click)="$event.stopPropagation()"
           (keydown)="$event.stopPropagation()"
           tabindex="-1">
        
        <button (click)="onCancel()" class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
             <span class="material-icons-outlined text-xl">close</span>
        </button>
        
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
            <span class="material-icons-outlined text-2xl">priority_high</span>
          </div>
          <h3 class="text-xl font-bold text-zinc-900 dark:text-white mb-2">{{ title() }}</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ message() }}</p>
        </div>

        <div class="flex gap-3">
          <button (click)="onCancel()" class="flex-1 py-2.5 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            {{ cancelText() }}
          </button>
          <button (click)="onConfirm()" class="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-colors">
            {{ confirmText() }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  title = input<string>('ยืนยันการลบ');
  message = input<string>('คุณแน่ใจหรือไม่ที่จะลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้');
  confirmText = input<string>('ลบรายการ');
  cancelText = input<string>('ยกเลิก');

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
