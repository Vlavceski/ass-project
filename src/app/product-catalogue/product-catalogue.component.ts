import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";

import { TransactionService } from '../services/transaction.service'
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ApexPlotOptions,
  ApexLegend,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
};
interface ResultItem {
  category: string;
  amount: number;
}
@Component({
  selector: 'app-product-catalogue',
  templateUrl: './product-catalogue.component.html',
  styleUrls: ['./product-catalogue.component.scss']
})
export class ProductCatalogueComponent {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  public result: ResultItem[] = [];
  constructor(
    private transactionService: TransactionService) {
      
    this.calculateTotalAmountByCodeParent()
    this.chartOptions = {
      series: [
        {
          data: this.result.map(item => ({
            x: item.category,
            y: item.amount
          }))
        }
      ],

      chart: {
        width:400,
        height: 200,
        type: "treemap"
      },
      title: {
        text: "Basic Treemap"
      }
    };
  }
  dataStorage= this.transactionService.getMultipleData('dataCategory');


  calculateTotalAmountByCodeParent() {
    const groupedData: { [key: string]: number } = {};

    // Group the data by codeParent and calculate the total amount for each category.
    for (const item of this.dataStorage) {
      const { codeParent, amount } = item;
      if (!groupedData[codeParent]) {
        groupedData[codeParent] = 0;
      }
      groupedData[codeParent] += amount;
    }

    // Convert the groupedData object into the desired format.
    this.result = Object.entries(groupedData).map(([category, amount]) => ({
      category,
      amount
    }));
  }

}
