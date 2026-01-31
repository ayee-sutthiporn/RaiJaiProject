import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toasts = signal<Toast[]>([]);

    show(toast: Omit<Toast, 'id'>) {
        const id = crypto.randomUUID();
        const newToast = { ...toast, id, duration: toast.duration || 3000 };

        this.toasts.update(current => [newToast, ...current]);

        if (newToast.duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, newToast.duration);
        }
    }

    remove(id: string) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
