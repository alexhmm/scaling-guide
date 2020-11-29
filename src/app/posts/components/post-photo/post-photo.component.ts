import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Post } from '../../models/post.interface';
import { PostsService } from '../../services/posts.service';

/**
 * PostPhotoComponent
 */
@Component({
  selector: 'app-post-photo',
  templateUrl: './post-photo.component.html',
  styleUrls: ['./post-photo.component.scss']
})
export class PostPhotoComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Current post index
   */
  currentIndex: number;

  /**
   * Post
   */
  @Input() post: Post;

  /**
   * Post index
   */
  @Input() postIndex: number;

  /**
   * Post visibility
   */
  @Input() postVisible = false;

  /**
   * Image source.
   */
  src = '';

  /**
   * Image source loaded validilty.
   */
  @Input() loadSource: boolean;

  /**
   * Unsubscribe
   */
  unsubscribe$ = new Subject();

  /**
   * PostPhotoComponent constructor.
   */
  constructor(private postsService: PostsService) {}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.initSubscriptionCurrentIndex();
  }

  /**
   * A lifecycle hook that is called when any data-bound property of a directive changes.
   * @param changes SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Load post source
    if (changes.loadSource && changes.loadSource.currentValue) {
      this.src = this.post.photos[0].original_size.url;
    }
    // Fade in post
    if (changes.postVisible && changes.postVisible.currentValue) {
      this.postVisible = true;
    } else {
      this.postVisible = false;
    }
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Inits subscription on current index.
   */
  initSubscriptionCurrentIndex(): void {
    this.postsService.currentIndex
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(currentIndex => {
        this.currentIndex = currentIndex;
      });
  }

  /**
   * Handler on setting next post.
   */
  onNextPost(): void {
    this.postsService.setNextIndex(this.currentIndex + 1);
  }

  /**
   * Event when image loading has finished.
   */
  onPostLoaded(): void {
    this.postsService.setPostLoaded(this.postIndex);
  }

  /**
   * Handler on setting previous post.
   */
  onPreviousPost(): void {
    this.postsService.setPreviousIndex(this.currentIndex - 1);
  }
}
