import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TransactionService } from '../services/transaction.service'
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SplitDialogComponent } from '../split-dialog/split-dialog.component';
import { MultiCateDialogComponent } from '../multi-cate-dialog/multi-cate-dialog.component';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { ChartComponent } from "ng-apexcharts";


interface DataItem {
  idTransaction: number;
  codecat: string;
  codeParent: string;
  amount: number;
}
interface ResultItem {
  category: string;
  amount: number;
}

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ApexPlotOptions,
  ApexLegend,
  ApexFill,
  ApexXAxis,
  ApexYAxis,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
};


export type ChartOptionsBubble = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
};
export type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};
export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};


@Component({
  selector: 'app-pfm',
  templateUrl: './pfm.component.html',
  styleUrls: ['./pfm.component.scss']
})
export class PfmComponent implements OnInit {
  public data: any;
  public data2: any;
  public dataCategory: any;
  showCheckboxes = false;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public chartOptionsBubble: Partial<ChartOptions> | any;
  public chartOptionsBar: Partial<ChartOptions> | any;
  public chartOptionsPie: Partial<ChartOptions> | any;

  public date?: Date | null = new Date();
  public calendarDate = Date.now();

  onToday() {
    this.calendarDate = Date.now();
  }

  onCancel() {
    this.date = null;
  }
  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.calculateTotalAmountByCodeParent()
    console.log(this.result)
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
        height: 350,
        type: "treemap"
      },
      title: {
        text: "Basic Treemap"
      }
    };
    this.chartOptionsBubble = {
      series: [
        {
          data: this.result.map(item => ({
            x: item.category,
            y: item.amount
          }))
        }
      ],
      chart: {
        height: 350,
        type: "bubble"
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 0.8
      },
      title: {
        text: "Simple Bubble Chart"
      },
      xaxis: {
        tickAmount: 12,
        type: "category"
      },
      yaxis: {
        max: 70
      }
    };
    this.chartOptionsBar = {
      series: [
        {
          data: this.result.map(item => ({
            x: item.category,
            y: item.amount
          }))
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      }

    };
    this.chartOptionsPie = {
      series: [
        {
          data: this.result.map(item => ({
            x: item.category,
            y: item.amount
          }))
        }
      ],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };


  }


  ngOnInit(): void {
    this.loadTransactions();
    console.log(this.transactionService.getMultipleData('dataCategory'))
    // this.transactionService.clearAllData();

    // this.chart()
    this.calculateTotalAmountByCodeParent()

  }

  openDialog(item: any): void {

    const dialogRef = this.dialog.open(SplitDialogComponent, {
      data: { item: item }
    });

  }

  loadTransactions(): void {

    this.transactionService.getDataCategories().subscribe(
      (category) => {
        this.dataCategory = category.items
      })

    this.transactionService.getData().subscribe(
      (data) => {
        this.data = data;
        console.log(this.data)
        this.paginateData();
      },
      (error) => {
        console.error(error);
      }
    );
  }
  toggleCheckboxes() {
    this.showCheckboxes = !this.showCheckboxes;
    this.buttonText = this.buttonText === this.previousText ? this.newText : this.previousText;

  }





  //checkbox
  selectedItems: any[] = [];

  onCheckboxChange(item: any) {
    if (item.checked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(
        (selectedItem: any) => selectedItem !== item
      );
    }
  }

  onOkButtonClick() {
    console.log(this.selectedItems);
    if (this.selectedItems.length <= 0) {
      console.log("empty")
      this.showCheckboxes = false
      for (const item of this.data.items) {
        item.checked = false;
      }
      this.selectedItems = [];
      this.buttonText = this.buttonText === this.previousText ? this.newText : this.previousText;

    } else {
      this.openDialogMultiCate(this.selectedItems)
      this.showCheckboxes = false
      for (const item of this.data.items) {
        item.checked = false;
      }
      this.selectedItems = [];
      this.buttonText = this.buttonText === this.previousText ? this.newText : this.previousText;
    }
  }
  onCancelButtonClick() {
    this.showCheckboxes = false
    for (const item of this.data.items) {
      item.checked = false;
    }
    this.selectedItems = [];
    this.buttonText = this.buttonText === this.previousText ? this.newText : this.previousText;
  }

  openDialogMultiCate(items: any[]): void {

    const dialogRef = this.dialog.open(MultiCateDialogComponent, {
      data: { items: items }
    });
  }

  openDialogAddCategory(items: any): void {
    const pro = this.transactionService.getMultipleData('dataCategory');
    // console.log(items)
    // console.log("pro")
    var codeItem;
    if (pro.length == 0) {
    } else {
      const idTransactionsArray = items.id

      const foundItem = pro.find((proItem: any) => proItem.idTransaction === idTransactionsArray);

      if (foundItem) {
        const foundObject = this.dataCategory.find((category: any) => category.code === foundItem.codecat);

        // console.log(foundObject.code)
        codeItem=foundObject.code
      }

    }
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      data: { items: items,code:codeItem }
    });
  }


  //text & button
  buttonText: string = 'Categorize multiple transactions';
  previousText: string = this.buttonText;
  newText: string = 'Please select transaction';

  //pagination
  paginatedData: any[] = [];
  pageSize = 4;
  currentPage = 0;

  paginateData() {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedData = this.data.items.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.paginateData();
  }

  //category
  namecategory!: string;

  checkCategory(item: any) {


    const pro = this.transactionService.getMultipleData('dataCategory');

    if (pro.length == 0) {
      return false;
    }
    const idTransactionsArray = pro.map(item => item.idTransaction);
    for (let i = 0; i < idTransactionsArray.length; i++) {
      const foundItem = pro.find((proItem: any) => proItem.idTransaction === idTransactionsArray[i]);

      if (idTransactionsArray[i] == item.id) {
        // console.log(foundItem.codecat)
        const foundObject = this.dataCategory.find((category: any) => category.code === foundItem.codecat);

        // console.log(foundObject)
        if (foundObject) {
          this.namecategory = foundObject.name;
        }


        return true;
      }
    }

    return false;
  }


  //filter
  actions = {
    name: false,
    date: false,
    amount: false,
  };
  applyFilters() {
    // Apply the filters based on checkbox states
    console.log("---------------------");
    console.log(this.data);
    var filteredData: any
    if (this.actions.name) {
      this.sortData()

    }
    // console.log(filteredData);
    // this.currentPage = 0; 
    // this.data.items = filteredData;
    this.paginateData();
  }

  ascendingOrder = true;

  searchQuery!: string;

  searchAndFilterData() {
    const query = String(this.searchQuery).toLowerCase()

    this.data.items = this.data.items.filter((item: any) => item['beneficiary-name'].toLowerCase().includes(query));

    console.log(this.data.items);
    this.paginateData()
  }



  filterByNameAscending() {
    this.ascendingOrder = true;
    this.sortData();
  }

  sortData() {
    if (this.ascendingOrder) {
      this.data.items.sort((a: any, b: any) => a['beneficiary-name'].localeCompare(b['beneficiary-name']));
    } else {
      this.data.items.sort((a: any, b: any) => b['beneficiary-name'].localeCompare(a['beneficiary-name']));
    }
    this.paginateData();
  }
  resetFilter() {
    this.ascendingOrder = true;
    this.actions = { name: false, date: false, amount: false };
    this.data.items.sort((a: any, b: any) => a.date.localeCompare(b.date));
    this.paginateData();
  }


  //chart
  public result: ResultItem[] = [];

  dataStorage: DataItem[] = this.transactionService.getMultipleData('dataCategory');


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




  public generateData(count: number, yrange: { max: number; min: number; }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }

  //drop downs

  onCheckboxChange2() {
    // You can add any logic here if you need to respond to checkbox changes.
  }

  SplitData() {
    console.log(this.transactionService.getMultipleData('splitData'))
  }


}
