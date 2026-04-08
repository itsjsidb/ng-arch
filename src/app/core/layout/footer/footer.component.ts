import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="container mx-auto px-4 h-16 flex items-center justify-center">
        <p class="text-sm text-gray-500">
          &copy; {{ currentYear }} NgArch. All rights reserved.
        </p>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
