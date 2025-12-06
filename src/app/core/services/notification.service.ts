import { Injectable, signal } from '@angular/core';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    notifications = signal<AppNotification[]>([]);

    // Computed: Unread count
    unreadCount = signal(0);

    constructor() {
        // Mock initial notifications
        this.add({
            title: 'ยินดีต้อนรับ',
            message: 'เข้าสู่ใช้งาน RaiJai App ครั้งแรก',
            type: 'success'
        });
    }

    add(n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
        const newNotification: AppNotification = {
            ...n,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            read: false
        };
        this.notifications.update(list => [newNotification, ...list]);
        this.updateUnreadCount();
    }

    markAsRead(id: string) {
        this.notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
        this.updateUnreadCount();
    }

    markAllAsRead() {
        this.notifications.update(list => list.map(n => ({ ...n, read: true })));
        this.updateUnreadCount();
    }

    remove(id: string) {
        this.notifications.update(list => list.filter(n => n.id !== id));
        this.updateUnreadCount();
    }

    private updateUnreadCount() {
        this.unreadCount.set(this.notifications().filter(n => !n.read).length);
    }
}
