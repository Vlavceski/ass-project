import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SupportComponent } from './support/support.component';
import { SelfCareComponent } from './self-care/self-care.component';
import { PfmComponent } from './pfm/pfm.component';
import { ProductCatalogueComponent } from './product-catalogue/product-catalogue.component';
import { CurrencyExchangeComponent } from './currency-exchange/currency-exchange.component';
import { CardsComponent } from './cards/cards.component';
import { PaymentsComponent } from './payments/payments.component';
import { MyAccountComponent } from './my-account/my-account.component';

const routes: Routes = [
  {
    path: "",
    redirectTo:'home',
    pathMatch:'full'
  },  
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "my_accounts",
    component: MyAccountComponent
  },
 {
    path: "payments",
    component: PaymentsComponent
  }, {
    path: "cards",
    component: CardsComponent
  }, {
    path: "currency_exchange",
    component: CurrencyExchangeComponent
  }, {
    path: "product_catalogue",
    component: ProductCatalogueComponent
  }, {
    path: "pfm",
    component: PfmComponent
  }, {
    path: "self_care",
    component: SelfCareComponent
  }, {
    path: "support",
    component: SupportComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
