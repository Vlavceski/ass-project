import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TransactionService } from '../services/transaction.service'
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SplitDialogComponent } from '../split-dialog/split-dialog.component';
import { MultiCateDialogComponent } from '../multi-cate-dialog/multi-cate-dialog.component';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { ChartComponent } from "ng-apexcharts";
import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


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
import { ShowSplitDialogComponent } from '../show-split-dialog/show-split-dialog.component';

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
  [x: string]: any;

  public data: any;
  public data2: any;
  public dataCategory: any;
  showCheckboxes = false;

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public chartOptionsBubble: Partial<ChartOptionsBubble> | any;
  public chartOptionsBar: Partial<ChartOptionsBar> | any;
  public chartOptionsPie: Partial<ChartOptionsPie> | any;

  public date?: Date | null = new Date();
  public calendarDate = Date.now();
  minDate: Date;
  maxDate: Date;
  modelfrom!: NgbDateStruct;
  modelto!: NgbDateStruct;
  splitData: any
  columnsToDisplay: string[] = ['id', 'beneficiary-name', 'codeCat', 'date', 'amount'];



  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
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
        width:400,
        height: 200,
        type: "bubble"
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 1
      },
      title: {
        text: "Bubble Chart"
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
        width:400,
        height: 200,
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
        this.result.map(item => (
          item.amount
        ))
      ],
      chart: {
        width:400,
        height: 200,
        type: "pie"
      },
      labels: [
        this.result.map(item => (
          item.category
        ))
      ],
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

    this.loadSplitTransactions()
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    // this.transactionService.clearAllData()

  }

  ngOnInit(): void {
    this.loadTransactions();
    this.calculateTotalAmountByCodeParent()
    this.paginateData()
  }
  onToday() {
    this.calendarDate = Date.now();
  }

  onCancel() {
    this.date = null;
  }

  loadSplitTransactions() {
    this.splitData = this.transactionService.getMultipleData('splitData');
  }


  upDown!: string


  dateRange = {
    start: null as Date | null,
    end: null as Date | null,
  };

  filteredData: any[] = [];
  applyDateFilter() {
    this.filteredData = this.data.items.filter((item:any) => {
      const itemDate = new Date(item.date);
      const startDate = this.dateRange.start;
      const endDate = this.dateRange.end;

      if (startDate === null || endDate === null) {
        return true;
      }

      // Set the time to midnight for proper date comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      return itemDate >= startDate && itemDate <= endDate;
    });
    this.data.items=this.filteredData

    this.paginateData();    
    console.log(this.filteredData)
  }


  loadTransactions(): void {

    this.transactionService.getDataCategories().subscribe(
      (category) => {
        this.dataCategory = category.items
      })

    this.transactionService.getData().subscribe(
      (data) => {
        this.data2 = data;
        this.data = this.data2
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
  existSplit(items: any) {
    const splitData = this.transactionService.getMultipleData('splitData')
    const idArray = splitData.map(item => item.id);
    for (let i = 0; i < idArray.length; i++) {
      if (items.id == idArray[i]) {
        return true
      }
    }
    return false
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
    if (this.selectedItems.length <= 0) {
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


  //dialogs
  showSplitDialog(item: any): void {

    this.dialog.open(ShowSplitDialogComponent, {
      data: { items: item }
    });
  }

  openDialog(item: any): void {
    this.dialog.open(SplitDialogComponent, {
      data: { item: item }
    });
  }

  openDialogMultiCate(items: any[]): void {
    const dialogRef = this.dialog.open(MultiCateDialogComponent, {
      data: { items: items }
    });
  }

  openDialogAddCategory(items: any): void {
    const pro = this.transactionService.getMultipleData('dataCategory');
    var codeItem;
    if (pro.length == 0) {
    } else {
      const idTransactionsArray = items.id

      const foundItem = pro.find((proItem: any) => proItem.idTransaction === idTransactionsArray);

      if (foundItem) {
        const foundObject = this.dataCategory.find((category: any) => category.code === foundItem.codecat);

        codeItem = foundObject.code
      }

    }
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      data: { items: items, code: codeItem }
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
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.data.items.slice(startIndex, endIndex);
  }

  onPageChange(event: any) {
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
        const foundObject = this.dataCategory.find((category: any) => category.code === foundItem.codecat);

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

  ascendingOrder = true;

  searchAndFilterData(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const searchText = inputElement.value.trim();
    
    var filteredData!:any[];
    if (searchText)  {
      filteredData = this.data2.items.filter((item: any) =>item['beneficiary-name'].toLowerCase().includes(searchText.toLowerCase()));
      this.data.items = filteredData
      this.paginateData()
    }
    if(searchText===''){
      this.loadTransactions()
    }
   
    this.paginateData();
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
    this.dateRange.start = null;
    this.dateRange.end = null;
    this.filteredData = [];
    this.loadTransactions();
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



}
