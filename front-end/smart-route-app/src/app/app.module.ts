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
import { MatTabsModule } from '@angular/material/tabs'
import { MatSliderModule } from '@angular/material/slider'
import { TripOverlayComponent } from './trip-overlay/trip-overlay.component';
import { AddressCardComponent } from './address-card/address-card.component';
import { AddIntermediateStopComponent } from './add-intermediate-stop/add-intermediate-stop.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { TripSettingsComponent } from './trip-settings/trip-settings.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    RoutesComponent,
    HeaderComponent,
    ProfileCreationComponent,
    TripOverlayComponent,
    AddressCardComponent,
    AddIntermediateStopComponent,
    TagsComponent,
    TripSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

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
    DragDropModule,
  ],
  providers: [
    MatDatepickerModule,
    MatDialogModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddIntermediateStopComponent]
})
export class AppModule { }
