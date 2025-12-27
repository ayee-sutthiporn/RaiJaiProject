import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-callback',
    template: `<p>Processing login...</p>`,
    standalone: true
})
export class CallbackComponent implements OnInit {
    private router = inject(Router);

    ngOnInit() {
        // Since APP_INITIALIZER has already handled the token exchange,
        // we just need to redirect to the dashboard or home.
        this.router.navigate(['/dashboard'], { replaceUrl: true });
    }
}
