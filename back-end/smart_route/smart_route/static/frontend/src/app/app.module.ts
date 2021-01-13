import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountsComponent } from './accounts/accounts.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutesComponent } from './routes/routes.component';
import { HeaderComponent } from './header/header.component';
import { ProfileCreationComponent } from './accounts/profile-creation/profile-creation.component';
import { MatNativeDateModule } from '@angular/material/core';
import { TagsComponent } from './tags/tags.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { TripOverlayComponent } from './trip-overlay/trip-overlay.component';
import { AddressCardComponent } from './address-card/address-card.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { CardComponent } from './card/card.component';
import { TagComponent } from './tag/tag.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    RoutesComponent,
    HeaderComponent,
    ProfileCreationComponent,
    TripOverlayComponent,
    AddressCardComponent,
    TagsComponent,
    CardComponent,
    TagComponent,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    SlickCarouselModule,

    // Angular Material
    MatButtonToggleModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTabsModule,
    MatSliderModule,
    MatPaginatorModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
  ],
  providers: [
    MatDatepickerModule,
    MatDialogModule
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
