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
import { HttpClientModule } from '@angular/common/http';
import { TripOverlayComponent } from './trip-overlay/trip-overlay.component';
import { AddressCardComponent } from './address-card/address-card.component';
import { AddIntermediateStopComponent } from './add-intermediate-stop/add-intermediate-stop.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { TripSettingsComponent } from './trip-settings/trip-settings.component';
import { CardComponent } from './card/card.component';

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
    TripSettingsComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
    MatPaginatorModule
  ],
  providers: [
    MatDatepickerModule,
    MatDialogModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddIntermediateStopComponent]
})
export class AppModule { }
