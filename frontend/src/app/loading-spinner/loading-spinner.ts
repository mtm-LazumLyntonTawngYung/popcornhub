import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css'
})
export class LoadingSpinner {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: string = '#ef4444';
  @Input() message?: string;
  @Input() progress?: number;
  @Input() isOverlay: boolean = false;
  @Output() loadingCompleted = new EventEmitter<void>();

  getSize(): string {
    switch (this.size) {
      case 'small': return '24px';
      case 'medium': return '48px';
      case 'large': return '64px';
      default: return '48px';
    }
  }

  completeLoading(): void {
    this.loadingCompleted.emit();
  }
}
