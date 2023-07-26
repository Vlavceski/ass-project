import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PfmComponent } from './pfm/pfm.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SnavComponent } from './snav/snav.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { PaymentsComponent } from './payments/payments.component';
import { CardsComponent } from './cards/cards.component';
import { CurrencyExchangeComponent } from './currency-exchange/currency-exchange.component';
import { ProductCatalogueComponent } from './product-catalogue/product-catalogue.component';
import { SelfCareComponent } from './self-care/self-care.component';
import { SupportComponent } from './support/support.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SplitDialogComponent } from './split-dialog/split-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MultiCateDialogComponent } from './multi-cate-dialog/multi-cate-dialog.component';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';

import { NgxApexchartsModule } from 'ngx-apexcharts';

import {CdkAccordionModule} from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { ShowSplitDialogComponent } from './show-split-dialog/show-split-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    PfmComponent,
    HeaderComponent,
    HomeComponent,
    SnavComponent,
    MyAccountComponent,
    PaymentsComponent,
    CardsComponent,
    CurrencyExchangeComponent,
    ProductCatalogueComponent,
    SelfCareComponent,
    SupportComponent,
    SplitDialogComponent,
    MultiCateDialogComponent,
    AddCategoryDialogComponent,
    MainNavComponent,
    ShowSplitDialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatGridListModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    HttpClientModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    NgbModule,
    MatDialogModule,
    FormsModule,
    MatSelectModule,
    NgxApexchartsModule,
    CdkAccordionModule,
    MatExpansionModule,
    MatButtonModule,
    MatNativeDateModule

  ],schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
