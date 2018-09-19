import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {SuiModule} from 'ng2-semantic-ui';
import { BootstrapGridModule } from 'ng2-bootstrap-grid';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { MainComponent } from './main/main.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AuthguardService } from './services/authguard.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { UserComponent } from './user/user.component';
import { ApplicationComponent } from './application/application.component';
import {TableModule} from 'ngx-easy-table';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LandingComponent,
    LoginComponent,
    UserComponent,
    ApplicationComponent
  ],
  imports: [
    SuiModule,
    BrowserModule,
    AppRoutingModule,
    BootstrapGridModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    TableModule
  ],
  providers: [AuthguardService, {provide: LocationStrategy, useClass:HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
