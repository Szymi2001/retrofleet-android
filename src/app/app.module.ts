import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    MessageService,
    PrimeNGConfig,
    provideCharts(withDefaultRegisterables()),
  ],
})
export class AppModule {}
