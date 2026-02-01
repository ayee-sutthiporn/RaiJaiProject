import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserApiService } from '../../core/services/api/user-api.service';
import { User } from '../../core/models/user.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DatePipe],
    template: `
    <div class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">จัดการผู้ใช้งาน</h1>
          <p class="text-zinc-500 dark:text-zinc-400">บริหารจัดการรายชื่อผู้ใช้งานในระบบ</p>
        </div>
        <button (click)="openModal()" class="bg-zinc-900 dark:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:opacity-90 transition-opacity flex items-center gap-2">
            <span class="material-icons-outlined text-[18px]">person_add</span>
            เพิ่มผู้ใช้งาน
        </button>
      </header>

      <!-- Users Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (user of users(); track user.id) {
            <div class="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-700 shadow-sm relative group">
                 <div class="flex items-start justify-between mb-4">
                     <div class="flex items-center gap-4">
                         <div class="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-xl font-bold text-zinc-600 dark:text-zinc-300">
                             {{ (user.name || user.username).charAt(0).toUpperCase() }}
                         </div>
                         <div>
                             <h3 class="font-bold text-zinc-900 dark:text-white">{{ user.name || user.username }}</h3>
                             <p class="text-xs text-zinc-500">{{ user.email }}</p>
                         </div>
                     </div>
                     <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button (click)="openModal(user)" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-blue-500 transition-colors" title="แก้ไข">
                             <span class="material-icons-outlined text-[20px]">edit</span>
                         </button>
                         <button (click)="deleteUser(user.id)" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-red-500 transition-colors" title="ลบ">
                             <span class="material-icons-outlined text-[20px]">delete</span>
                         </button>
                     </div>
                 </div>

                 <div class="flex items-center justify-between text-sm mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700">
                     <span [class]="'px-2 py-1 rounded-full text-xs font-bold ' + (user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400')">
                         {{ user.role || 'USER' }}
                     </span>
                     <span [class]="'flex items-center gap-1.5 text-xs font-medium ' + (user.status === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400')">
                         <span [class]="'w-2 h-2 rounded-full ' + (user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-zinc-400')"></span>
                         {{ user.status === 'ACTIVE' ? 'Active' : 'Inactive' }}
                     </span>
                 </div>
                 <p class="text-[10px] text-zinc-400 mt-2 text-right">Created: {{ user.createdAt | date:'dd-MM-yyyy' }}</p>
            </div>
        } @empty {
            <div class="col-span-full text-center py-10 text-zinc-400">ไม่พบข้อมูลผู้ใช้งาน</div>
        }
      </div>

       <!-- Modal -->
       @if (showModal()) {
           <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
               <div class="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-700 relative">
                   <h2 class="text-xl font-bold mb-6 text-zinc-900 dark:text-white">{{ editingId() ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่' }}</h2>
                   
                   <button (click)="closeModal()" class="absolute top-5 right-5 z-20 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
                       <span class="material-icons-outlined text-2xl">close</span>
                   </button>

                   <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
                       <div>
                           <label for="name" class="block text-xs font-medium text-zinc-500 mb-1">ชื่อ-นามสกุล</label>
                           <input id="name" type="text" formControlName="name" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                       </div>
                       
                       <div>
                           <label for="email" class="block text-xs font-medium text-zinc-500 mb-1">อีเมล</label>
                           <input id="email" type="email" formControlName="email" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                       </div>

                       @if (!editingId()) {
                           <div>
                               <label for="password" class="block text-xs font-medium text-zinc-500 mb-1">รหัสผ่าน</label>
                               <input id="password" type="password" formControlName="password" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                           </div>
                       }

                       <div class="grid grid-cols-2 gap-4">
                           <div>
                               <label for="role" class="block text-xs font-medium text-zinc-500 mb-1">สิทธิ์การใช้งาน</label>
                               <select id="role" formControlName="role" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                                   <option value="USER">User</option>
                                   <option value="ADMIN">Admin</option>
                               </select>
                           </div>
                           <div>
                               <label for="status" class="block text-xs font-medium text-zinc-500 mb-1">สถานะ</label>
                               <select id="status" formControlName="status" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                                   <option value="ACTIVE">Active</option>
                                   <option value="INACTIVE">Inactive</option>
                               </select>
                           </div>
                       </div>

                       <div class="flex gap-3 mt-6 pt-4">
                           <button type="button" (click)="closeModal()" class="flex-1 py-2 text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">ยกเลิก</button>
                           <button type="submit" [disabled]="form.invalid" class="flex-1 py-2 bg-zinc-900 dark:bg-emerald-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">บันทึก</button>
                       </div>
                   </form>
               </div>
           </div>
       }
    </div>
  `
})
export class UsersComponent {
    userService = inject(UserApiService);
    toastService = inject(ToastService);
    fb = inject(FormBuilder);

    // NOTE: This endpoint might not exist in backend yet, handled as 404 potentially or should be implemented
    users = toSignal(this.userService.getUsers(), { initialValue: [] as User[] });

    showModal = signal(false);
    editingId = signal<string | null>(null);

    form = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['USER', Validators.required],
        status: ['ACTIVE', Validators.required],
        password: ['']
    });

    openModal(user?: User) {
        this.showModal.set(true);
        if (user) {
            this.editingId.set(user.id);
            this.form.patchValue({
                name: user.name,
                email: user.email,
                role: user.role || 'USER',
                status: user.status || 'ACTIVE'
            });
            this.form.controls.password.clearValidators();
            this.form.controls.password.updateValueAndValidity();
        } else {
            this.editingId.set(null);
            this.form.reset({ role: 'USER', status: 'ACTIVE' });
            this.form.controls.password.setValidators(Validators.required);
            this.form.controls.password.updateValueAndValidity();
        }
    }

    closeModal() {
        this.showModal.set(false);
        this.editingId.set(null);
    }

    async onSubmit() {
        if (this.form.valid) {
            const val = this.form.value;
            try {
                if (this.editingId()) {
                    await this.userService.updateUser(this.editingId()!, {
                        name: val.name!,
                        email: val.email!,
                        role: val.role as 'ADMIN' | 'USER',
                        status: val.status as 'ACTIVE' | 'INACTIVE'
                    }).toPromise();
                    this.finishSubmit('แก้ไขผู้ใช้งานเรียบร้อยแล้ว');
                } else {
                    await this.userService.addUser({
                        name: val.name!,
                        email: val.email!,
                        role: val.role as 'ADMIN' | 'USER',
                        status: val.status as 'ACTIVE' | 'INACTIVE',
                        username: val.email!.split('@')[0],
                        password: val.password || '123456'
                    }).toPromise();
                    this.finishSubmit('เพิ่มผู้ใช้งานเรียบร้อยแล้ว');
                }
            } catch (error) {
                console.error(error);
                this.toastService.show({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
            }
        }
    }

    finishSubmit(msg: string) {
        this.closeModal();
        this.toastService.show({ type: 'success', title: 'สำเร็จ', message: msg });
        window.location.reload();
    }

    async deleteUser(id: string) {
        if (confirm('คุณแน่ใจว่าต้องการลบผู้ใช้งานนี้?')) {
            try {
                await this.userService.deleteUser(id).toPromise();
                this.toastService.show({ type: 'success', title: 'สำเร็จ', message: 'ลบผู้ใช้งานเรียบร้อยแล้ว' });
                window.location.reload();
            } catch (error) {
                console.error(error);
                this.toastService.show({ type: 'error', title: 'ผิดพลาด', message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
            }
        }
    }
}
