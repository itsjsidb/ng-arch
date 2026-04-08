import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [disabled]="disabled()"
      [type]="type()"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50"
      [class]="variantClasses()"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'outline'>('primary');
  disabled = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  variantClasses() {
    switch (this.variant()) {
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200 h-10 px-4 py-2';
      case 'outline':
        return 'border border-gray-300 bg-transparent hover:bg-gray-50 h-10 px-4 py-2 text-gray-900';
      case 'primary':
      default:
        return 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm h-10 px-4 py-2';
    }
  }
}
