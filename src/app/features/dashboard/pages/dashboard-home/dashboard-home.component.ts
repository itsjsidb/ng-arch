import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p class="text-gray-600 mb-6">Welcome to your dashboard. This feature module is lazy-loaded.</p>
      
      <div class="flex gap-4">
        <app-button variant="primary">Primary Action</app-button>
        <app-button variant="outline">Secondary Action</app-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent {}
