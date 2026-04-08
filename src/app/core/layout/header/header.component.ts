import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <a routerLink="/" class="text-xl font-bold text-indigo-600 tracking-tight">NgArch</a>
        <nav class="flex gap-4">
          <a routerLink="/" class="text-sm font-medium hover:text-indigo-600 transition-colors">Home</a>
          <a routerLink="/dashboard" class="text-sm font-medium hover:text-indigo-600 transition-colors">Dashboard</a>
        </nav>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
