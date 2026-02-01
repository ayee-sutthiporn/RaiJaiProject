import { Component, input, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Transaction } from '../../../../core/models/transaction.interface';
import { ImageModalComponent } from '../../../../shared/components/image-modal/image-modal.component';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,

  imports: [CommonModule, DatePipe, DecimalPipe, ImageModalComponent],
  template: `
    <div class="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 h-full relative">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-zinc-900 dark:text-white">รายการล่าสุด</h3>
        <button class="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium hover:underline">ดูทั้งหมด</button>
      </div>

      <div class="space-y-4">
        @for (transaction of transactions(); track transaction.id) {
          <div class="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors group cursor-pointer">
            <div class="flex items-center gap-4">
              <div [class]="'w-10 h-10 rounded-full flex items-center justify-center ' + getCategoryColor()">
                <span class="text-lg">{{ getCategoryEmoji(transaction.category?.name || '') }}</span>
              </div>
              <div>
                <p class="font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                    {{ transaction.description || transaction.category?.name }}
                    @if (transaction.imageUrl) {
                        <button (click)="viewImage($event, transaction.imageUrl, transaction.description || 'รูปภาพ')" class="text-zinc-400 hover:text-emerald-500 transition-colors" title="ดูรูปภาพ">
                            <span class="material-icons-outlined text-[16px]">image</span>
                        </button>
                    }
                </p>
                <p class="text-xs text-zinc-500">{{ transaction.date | date:'dd-MM-yyyy, HH:mm' }} • {{ transaction.walletId | slice:0:2 }}..</p>
              </div>
            </div>
            <div class="text-right">
              <p [class]="'font-bold ' + (transaction.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-zinc-200')">
                {{ transaction.type === 'EXPENSE' ? '-' : '+' }}{{ transaction.amount | number:'1.2-2' }}
              </p>
            </div>
          </div>
        } @empty {
            <div class="text-center py-10 text-zinc-400">ยังไม่มีรายการเทรด</div>
        }
      </div>

      @if (selectedImage()) {
        <app-image-modal 
            [imageUrl]="selectedImage()!" 
            [title]="selectedImageTitle()" 
            (closeModal)="closeImage()">
        </app-image-modal>
      }
    </div>
  `
})
export class RecentTransactionsComponent {
  transactions = input.required<Transaction[]>();

  selectedImage = signal<string | null>(null);
  selectedImageTitle = signal<string>('');

  viewImage(event: Event, url: string, title: string) {
    event.stopPropagation();
    this.selectedImage.set(url);
    this.selectedImageTitle.set(title);
  }

  closeImage() {
    this.selectedImage.set(null);
  }

  getCategoryEmoji(category: string): string {
    const map: Record<string, string> = {
      'อาหาร': '🍔',
      'เดินทาง': '🚕',
      'เงินเดือน': '💰',
      'บันเทิง': '🎬',
      'เงินออม': '🏦',
      'ช้อปปิ้ง': '🛍️',
      'ลงทุน': '📈',
      'บิล/สาธารณูปโภค': '🧾'
    };
    return map[category] || '💸';
  }

  getCategoryColor(): string {
    return 'bg-zinc-100 dark:bg-zinc-700';
  }
}
