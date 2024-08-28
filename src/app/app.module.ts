import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
<<<<<<< HEAD
import { PrimeNGConfig } from 'primeng/api';
=======
>>>>>>> 2108c01 (module settings, more translations)

//Wykresy
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

//Tłumaczenie
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
<<<<<<< HEAD
=======
import { SettingsComponent } from './tabs/settings/settings.component';
import { FormsModule } from '@angular/forms';
>>>>>>> 2108c01 (module settings, more translations)

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
<<<<<<< HEAD
=======
    FormsModule,
>>>>>>> 2108c01 (module settings, more translations)
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
<<<<<<< HEAD
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    PrimeNGConfig,
=======
  declarations: [AppComponent, SettingsComponent],
  bootstrap: [AppComponent],
  providers: [
>>>>>>> 2108c01 (module settings, more translations)
    provideCharts(withDefaultRegisterables()),
  ],
})
export class AppModule {}
